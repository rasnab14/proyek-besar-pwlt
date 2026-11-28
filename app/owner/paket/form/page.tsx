import { Suspense } from "react";
import { FormPaketPageContent } from "@/components/barang";

export default function OwnerPaketFormPage() {
  return (
    <Suspense fallback={<div className="main"><div className="brg-card">Memuat formulir paket...</div></div>}>
      <FormPaketPageContent role="owner" />
    </Suspense>
  );
}
