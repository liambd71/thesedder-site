import { Suspense } from "react";
import SuccessClient from "./success-client";

export default function Page() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Loading...</div>}>
      <SuccessClient />
    </Suspense>
  );
}
