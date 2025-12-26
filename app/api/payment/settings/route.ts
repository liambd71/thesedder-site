import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    const supabase = await createClient();

    if (!supabase) {
      return NextResponse.json(
        { success: false, error: "Database not available", settings: [] },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message, settings: [] },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      settings: data ?? [],
    });
  } catch (err) {
    console.error("Payment settings error:", err);
    return NextResponse.json(
      { success: false, error: "Server error", settings: [] },
      { status: 500 }
    );
  }
}
