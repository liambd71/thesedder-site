"use client";

import { useSearchParams } from "next/navigation";

export default function CancelledClient() {
  const sp = useSearchParams();
  const by = sp.get("by");

  return (
    <div style={{ maxWidth: 720, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>⚠️ Payment Cancelled</h1>
      <p style={{ marginTop: 10 }}>
        পেমেন্ট ক্যানসেল করা হয়েছে।
      </p>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
        <div><b>Cancelled By:</b> {by ?? "N/A"}</div>
      </div>
    </div>
  );
}
