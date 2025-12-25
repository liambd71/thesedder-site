import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { PaymentSetting } from "@/types/database";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("payment_settings")
      .select("*")
      .eq("is_enabled", true)
      .order("display_order", { ascending: true });

    if (error) {
      console.error("Error fetching payment settings:", error);
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch payment settings",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      paymentMethods: data as PaymentSetting[],
    });
  } catch (error) {
    console.error("Payment settings error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
