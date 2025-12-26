import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const approveSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

type OrderRow = {
  id: string;
  status: string;
  user_id: string | null;
  product_id: string | null;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const validation = approveSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { orderId } = validation.data;

    const supabase = await createClient();

    // require logged-in user
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }
    if (!authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // fetch order
    const orderResult = await supabase
      .from("orders")
      .select("id,status,user_id,product_id")
      .eq("id", orderId)
      .maybeSingle();

    if (orderResult.error) {
      return NextResponse.json(
        { error: orderResult.error.message },
        { status: 500 }
      );
    }

    const order = orderResult.data as unknown as OrderRow | null;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending_verification") {
      return NextResponse.json(
        { error: "Order is not pending verification" },
        { status: 400 }
      );
    }

    // IMPORTANT: Supabase generated types না থাকলে `.update()`/`.insert()` এ "never" আসে
    // তাই এখানে table builder কে any করে নেওয়া হয়েছে।
    const ordersTable = supabase.from("orders") as any;

    const { error: updateError } = await ordersTable
      .update({
        status: "paid",
        verified_by: authData.user.id,
        verified_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to approve order" },
        { status: 500 }
      );
    }

    // create purchase (if order has user_id & product_id)
    if (order.user_id && order.product_id) {
      const purchasesTable = supabase.from("purchases") as any;

      // check existing
      const existing = await purchasesTable
        .select("id")
        .eq("user_id", order.user_id)
        .eq("product_id", order.product_id)
        .maybeSingle();

      // if not found -> insert
      if (!existing?.data) {
        const { error: insertError } = await purchasesTable.insert({
          user_id: order.user_id,
          product_id: order.product_id,
          order_id: order.id,
          purchased_at: new Date().toISOString(),
        });

        if (insertError) {
          // purchase insert fail হলেও order approved হয়েছে — তাই 500 না দিয়ে log করলাম
          console.error("Purchase insert error:", insertError);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Approve order error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
