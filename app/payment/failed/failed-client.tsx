"use client";

import { useSearchParams } from "next/navigation";

export default function FailedClient() {
  const sp = useSearchParams();
  const reason = sp.get("reason");

  return (
    <div style={{ maxWidth: 720, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>❌ Payment Failed</h1>
      <p style={{ marginTop: 10 }}>দুঃখিত, আপনার পেমেন্ট ব্যর্থ হয়েছে।</p>

      <div style={{ marginTop: 16, padding: 12, border: "1px solid #ddd", borderRadius: 10 }}>
        <div><b>Reason:</b> {reason ?? "Unknown"}</div>
      </div>
    </div>
  );
}
