import { DetailBarangContent } from "@/components/barang";

interface AdminDetailBarangPageProps {
  params: Promise<{
    kode: string;
  }>;
}

export default async function AdminDetailBarangPage({ params }: AdminDetailBarangPageProps) {
  const { kode } = await params;
  return <DetailBarangContent kode={kode} role="admin" />;
}
