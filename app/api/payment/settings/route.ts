import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  try {
    const supabase = await createClient();

    // 🔐 CRITICAL FIX (এইটা না থাকলেই error)
    if (!supabase) {
      return NextResponse.json(
        { error: "Database not available" },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq('is_active', true)

      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: data ?? null,
    });
  } catch (err) {
    console.error("Payment settings error:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
