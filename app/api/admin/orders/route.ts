import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

const rejectSchema = z.object({
  orderId: z.string().uuid("Invalid order ID"),
  reason: z.string().min(1, "Reason is required").max(500, "Reason too long"),
});

type OrderRow = {
  id: string;
  status: string;
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const validation = rejectSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { orderId, reason } = validation.data;

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
      .select("id,status")
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

    const ordersTable = supabase.from("orders") as any;

    const { error: updateError } = await ordersTable
      .update({
        status: "rejected",
        rejection_reason: reason,
        rejected_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", orderId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to reject order" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("Reject order error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
