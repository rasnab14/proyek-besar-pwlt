import { DetailUnitContent } from "@/components/barang";

interface AdminDetailUnitPageProps {
  params: Promise<{
    kode: string;
    unit: string;
  }>;
}

export default async function AdminDetailUnitPage({ params }: AdminDetailUnitPageProps) {
  const { kode, unit } = await params;
  return <DetailUnitContent kode={kode} unitParam={unit} role="admin" />;
}
