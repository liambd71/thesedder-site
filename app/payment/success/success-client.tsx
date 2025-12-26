"use client";

import { useSearchParams } from "next/navigation";

export default function SuccessClient() {
  const sp = useSearchParams();

  const trxid = sp.get("trxid");
  const reference = sp.get("reference");

  return (
    <div style={{ maxWidth: 720, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>✅ Payment Success</h1>
      <p style={{ marginTop: 10 }}>আপনার পেমেন্ট সাবমিট হয়েছে।</p>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
        <div><b>TRXID:</b> {trxid ?? "N/A"}</div>
        <div><b>Reference:</b> {reference ?? "N/A"}</div>
      </div>
    </div>
  );
}
