import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

const approveSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
});

type OrderRow = {
  id: string;
  status: string;
  user_id: string | null;
  product_id: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const validation = approveSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { orderId } = validation.data;

    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

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

    const order = orderResult.data as OrderRow | null;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "pending_verification") {
      return NextResponse.json(
        { error: "Order is not pending verification" },
        { status: 400 }
      );
    }

    const { error: updateError } = await supabase
      .from("orders")
      .update({
        status: "paid",
        verified_by: user?.id || null,
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

    // create purchase if missing
    if (order.user_id) {
      const existingPurchaseResult = await supabase
        .from("purchases")
        .select("id")
        .eq("user_id", order.user_id)
        .eq("product_id", order.product_id)
        .maybeSingle();

      if (!existingPurchaseResult.data) {
        await supabase.from("purchases").insert({
          user_id: order.user_id,
          product_id: order.product_id,
          order_id: order.id,
          purchased_at: new Date().toISOString(),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Approve order error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
