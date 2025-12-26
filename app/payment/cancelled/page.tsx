import { Suspense } from "react";
import CancelledClient from "./cancelled-client";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <CancelledClient />
    </Suspense>
  );
}
