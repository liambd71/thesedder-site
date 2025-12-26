import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getProductById } from "@/lib/products";

export const runtime = "nodejs";

type OrderRow = {
  id: string;
  status: string;
  user_id: string | null;
  product_id: string | null;
  created_at?: string | null;
  updated_at?: string | null;
};

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // optional: require logged-in user (admin panel)
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }
    if (!authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("orders")
      .select("id,status,user_id,product_id,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const orders = (data ?? []) as unknown as OrderRow[];

    const ordersWithProducts = orders.map((order) => {
      const product = order.product_id ? getProductById(order.product_id) : null;

      return {
        ...order,
        product: product ? { title: product.title, type: product.type } : null,
      };
    });

    return NextResponse.json({ success: true, orders: ordersWithProducts });
  } catch (e) {
    console.error("Admin orders GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
