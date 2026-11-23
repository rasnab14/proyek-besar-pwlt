import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "19 Summit — Rental & Store",
  description: "Sistem manajemen rental dan penjualan perlengkapan outdoor 19 Summit",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
