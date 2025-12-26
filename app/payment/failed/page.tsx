import { Suspense } from "react";
import FailedClient from "./failed-client";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <FailedClient />
    </Suspense>
  );
}
