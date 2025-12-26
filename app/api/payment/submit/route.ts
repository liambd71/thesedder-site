import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

const submitSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  payment_method: z.enum(["bkash", "nagad", "rocket"]),
  customer_name: z.string().min(1, "Customer name is required"),
  customer_email: z.string().email("Invalid email"),
  sender_number: z.string().min(5, "Sender number is required"),
  reference: z.string().min(1, "Reference is required"),
  trxid: z.string().min(3, "TrxID is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.errors[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const {
      productId,
      payment_method,
      customer_name,
      customer_email,
      sender_number,
      reference,
      trxid,
    } = parsed.data;

    const product = getProductById(productId);
    if (!product || !product.published) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // user optional (guest order allowed)
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id ?? null;

    const orderPayload = {
      user_id: userId,
      product_id: product.id,
      amount: product.price,
      currency: product.currency ?? "BDT",
      status: "pending_verification",
      payment_method,
      customer_name,
      customer_email,
      sender_number,
      reference,
      trxid,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // ✅ IMPORTANT: typing issue fix (values: never)
    const ordersTable = supabase.from("orders") as any;

    const { data: inserted, error: insertError } = await ordersTable
      .insert(orderPayload as any)
      .select("id")
      .maybeSingle();

    if (insertError) {
      console.error("Order insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to create order" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: inserted?.id ?? null,
    });
  } catch (err) {
    console.error("Payment submit error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
