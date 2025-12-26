import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // ✅ null check (এইটাই তোমার error fix করবে)
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    // require logged-in user
    const { data: authData, error: authErr } = await supabase.auth.getUser();
    if (authErr) {
      return NextResponse.json({ error: authErr.message }, { status: 500 });
    }
    if (!authData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // fetch orders (admin page er jonno)
    const ordersRes = await supabase
      .from("orders")
      .select("id,status,user_id,product_id,created_at,updated_at")
      .order("created_at", { ascending: false });

    if (ordersRes.error) {
      return NextResponse.json(
        { error: ordersRes.error.message },
        { status: 500 }
      );
    }

    const orders = (ordersRes.data ?? []) as unknown as OrderRow[];

    return NextResponse.json({ success: true, orders });
  } catch (e) {
    console.error("Admin orders GET error:", e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
