"use client";

import { useEffect, useState } from "react";

type PaymentSetting = {
  id: number;
  method: string;
  account_number: string;
  instructions: string;
  required_reference: string;
  is_active: boolean;
  created_at: string;
  is_enabled?: boolean;
};

export default function PaymentMethods() {
  const [loading, setLoading] = useState(true);
  const [methods, setMethods] = useState<PaymentSetting[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch("/api/payment/settings", { cache: "no-store" });
        const json = await res.json();

        // ✅ ডিবাগ দরকার হলে নিচের লাইনটা রেখে দাও
        // console.log("PAYMENT SETTINGS:", json);

        if (!json?.success || !Array.isArray(json.settings)) {
          setMethods([]);
          setError(json?.error || "Payment settings not available");
          return;
        }

        // ✅ optional: is_enabled থাকলে true গুলাই দেখাবে
        const filtered = json.settings.filter((m: PaymentSetting) =>
          typeof m.is_enabled === "boolean" ? m.is_enabled : true
        );

        setMethods(filtered);
      } catch (e: any) {
        setMethods([]);
        setError("Failed to load payment methods");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, []);

  if (loading) {
    return (
      <div className="border rounded-lg p-6 text-center">
        Loading payment methods...
      </div>
    );
  }

  if (error || methods.length === 0) {
    return (
      <div className="border rounded-lg p-6 text-center">
        <div className="text-lg font-semibold">Payment methods are currently unavailable.</div>
        <div className="text-sm opacity-80 mt-1">
          {error ? error : "Please try again later or contact support."}
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Payment Methods</h2>

      <div className="space-y-4">
        {methods.map((m) => (
          <div key={m.id} className="border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="font-semibold capitalize">{m.method}</div>
              <div className="text-sm opacity-80">{m.account_number}</div>
            </div>

            <div className="mt-2 text-sm whitespace-pre-wrap">
              {m.instructions}
            </div>

            <div className="mt-3 text-sm">
              <span className="font-semibold">Reference:</span>{" "}
              {m.required_reference}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
