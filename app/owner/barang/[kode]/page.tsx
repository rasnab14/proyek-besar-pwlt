import { DetailBarangContent } from "@/components/barang";

interface OwnerDetailBarangPageProps {
  params: Promise<{
    kode: string;
  }>;
}

export default async function OwnerDetailBarangPage({ params }: OwnerDetailBarangPageProps) {
  const { kode } = await params;
  return <DetailBarangContent kode={kode} role="owner" />;
}
