import { Suspense } from "react";
import { FormBarangPageContent } from "@/components/barang";

export default function OwnerBarangFormPage() {
  return (
    <Suspense fallback={<div className="main"><div className="brg-card">Memuat formulir barang...</div></div>}>
      <FormBarangPageContent role="owner" />
    </Suspense>
  );
}
