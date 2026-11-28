import { DetailUnitContent } from "@/components/barang";

interface OwnerDetailUnitPageProps {
  params: Promise<{
    kode: string;
    unit: string;
  }>;
}

export default async function OwnerDetailUnitPage({ params }: OwnerDetailUnitPageProps) {
  const { kode, unit } = await params;
  return <DetailUnitContent kode={kode} unitParam={unit} role="owner" />;
}
