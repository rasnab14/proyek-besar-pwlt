import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "19 Summit — Rental & Store",
    template: "%s | 19 Summit",
  },
  description: "Sistem manajemen rental dan penjualan perlengkapan outdoor 19 Summit Adventure",
  icons: {
    icon: [
      { url: "/logo-19summit.jpg", type: "image/jpeg" },
      { url: "/favicon.ico", sizes: "any" },
    ],
    shortcut: "/logo-19summit.jpg",
    apple: "/logo-19summit.jpg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/logo-19summit.jpg" type="image/jpeg" />
        <link rel="shortcut icon" href="/logo-19summit.jpg" type="image/jpeg" />
        <link rel="apple-touch-icon" href="/logo-19summit.jpg" />
        <meta name="theme-color" content="#0D1117" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
