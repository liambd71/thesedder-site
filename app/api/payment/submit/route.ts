import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getProductById } from "@/lib/products";

const submitSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  payment_method: z.enum(["bkash", "nagad", "rocket"]),
  customer_name: z.string().min(1, "Name is required").max(120),
  customer_email: z.string().email("Invalid email").max(200),
  sender_number: z.string().min(6, "Invalid sender number").max(30),
  reference: z.string().min(1, "Reference is required").max(200),
  trxid: z.string().min(3, "TRXID is required").max(120),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = submitSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors[0]?.message || "Invalid input" },
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
    } = validation.data;

    const product = getProductById(productId);

    if (!product || !product.published) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const supabase = await createClient();
    if (!supabase) {
      return NextResponse.json({ error: "Database not available" }, { status: 500 });
    }

    // user optional (guest allowed)
    const { data: authData } = await supabase.auth.getUser();
    const userId = authData?.user?.id ?? null;

    // IMPORTANT: avoid "never" type errors (when Database types are missing)
    const ordersTable = supabase.from("orders") as any;

    const orderPayload = {
      user_id: userId,
      product_id: product.id,
      amount: product.price,
      currency: "BDT",
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

    const { error: insertError } = await ordersTable.insert(orderPayload);

    if (insertError) {
      console.error("Order insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to submit payment" },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Payment submit error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
