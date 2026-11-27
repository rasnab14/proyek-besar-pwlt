// app/admin/transaksi/jual/baru/page.tsx
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import "@/components/transaksi/transaksi.css";
import "@/components/booking/booking.css";
import "@/components/booking/create/booking-create.css";
import {
  ProdukJualItem,
  TransaksiJualRecord,
  MetodePembayaranJual,
  getStoredProdukJual,
  getStoredTransaksiJual,
  generateNextJualKode,
  createTransaksiJual,
  updateTransaksiJual,
  PrintReceiptJualModal,
} from "@/components/transaksi-jual";
import { CustomerData, MOCK_CUSTOMERS } from "@/components/booking/create";
import { NewCustomerModal } from "@/components/booking/create/NewCustomerModal";
import { formatRupiah } from "@/lib/format";

interface CartJualItem {
  id: string;
  kode: string;
  nama: string;
  kategori: string;
  harga: number;
  stok: number;
  jumlah: number;
  subtotal: number;
}

function TransaksiJualFormInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editParam = searchParams ? searchParams.get("edit") : null;

  // ─── Mode Edit State ───
  const [isEditMode, setIsEditMode] = useState(false);
  const [existingRecord, setExistingRecord] = useState<TransaksiJualRecord | null>(null);

  // ─── Kode Transaksi & Kasir ───
  const [kodeTransaksi, setKodeTransaksi] = useState("TJ-0129");
  const tanggalHariIni = "2026-11-27";
  const [tanggalTransaksi, setTanggalTransaksi] = useState(tanggalHariIni);
  const kasir = "Admin Toko";

  // ─── Pelanggan State ───
  const [customers, setCustomers] = useState<CustomerData[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(null); // default null = Pelanggan Umum
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);

  // ─── Produk & Keranjang State ───
  const [products, setProducts] = useState<ProdukJualItem[]>([]);
  const [cart, setCart] = useState<CartJualItem[]>([]);

  // ─── Filter & Search Katalog ───
  const [searchCatalog, setSearchCatalog] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Semua");
  const [stockFilter, setStockFilter] = useState<"semua" | "ada">("semua");
  const [sortBy, setSortBy] = useState<"nama-asc" | "nama-desc" | "harga-asc" | "harga-desc">("nama-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // ─── Pembayaran Kasir ───
  const [diskonManual, setDiskonManual] = useState<number>(0);
  const [nominalDiterima, setNominalDiterima] = useState<number>(0);
  const [metodePembayaran, setMetodePembayaran] = useState<MetodePembayaranJual>("tunai");

  // ─── Modals & Feedback ───
  const [successTx, setSuccessTx] = useState<TransaksiJualRecord | null>(null);
  const [isPrintReceiptOpen, setIsPrintReceiptOpen] = useState(false);
  const [isConfirmPaymentOpen, setIsConfirmPaymentOpen] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  // Load products & handle edit prefill or generate new code
  useEffect(() => {
    if (typeof window !== "undefined") {
      const masterProds = getStoredProdukJual();
      setProducts(masterProds);

      if (editParam) {
        const allTx = getStoredTransaksiJual();
        const target = allTx.find(
          (t) => t.id === editParam || t.kode.toLowerCase() === editParam.toLowerCase()
        );
        if (target) {
          setIsEditMode(true);
          setExistingRecord(target);
          setKodeTransaksi(target.kode);
          setTanggalTransaksi(target.waktu.split(" ")[0] || tanggalHariIni);

          // Pelanggan
          if (target.pelanggan?.nama && target.pelanggan.nama !== "Pelanggan Umum") {
            const matched = customers.find(
              (c) =>
                c.nama.toLowerCase() === target.pelanggan.nama.toLowerCase() ||
                (target.pelanggan.telepon && c.telepon === target.pelanggan.telepon)
            );
            setSelectedCustomer(
              matched || {
                id: "cust-loaded",
                nama: target.pelanggan.nama,
                telepon: target.pelanggan.telepon || "",
                alamat: target.pelanggan.alamat || "",
              }
            );
          } else {
            setSelectedCustomer(null);
          }

          // Keranjang items
          const loadedCart: CartJualItem[] = target.items.map((it) => {
            const p = masterProds.find((prod) => prod.id === it.id);
            return {
              id: it.id,
              kode: it.kode,
              nama: it.nama,
              kategori: it.kategori,
              harga: it.hargaSatuan,
              stok: p ? p.stok + it.jumlah : it.jumlah,
              jumlah: it.jumlah,
              subtotal: it.subtotal,
            };
          });
          setCart(loadedCart);
          setDiskonManual(target.diskon || 0);
          setNominalDiterima(target.nominalBayar || target.total);
          setMetodePembayaran(target.metodeBayar);
          return;
        }
      }

      setKodeTransaksi(generateNextJualKode());
    }
  }, [editParam]);

  const showToast = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 3500);
  };

  // Filter Pelanggan
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const q = customerSearchQuery.toLowerCase().trim();
    return customers.filter(
      (c) => c.nama.toLowerCase().includes(q) || c.telepon.includes(q)
    );
  }, [customers, customerSearchQuery]);

  // Dynamic Categories with counts
  const categoriesWithCounts = useMemo(() => {
    const counts: { [key: string]: number } = {};
    products.forEach((p) => {
      counts[p.kategori] = (counts[p.kategori] || 0) + 1;
    });

    return [
      { name: "Semua", count: products.length },
      { name: "Gas", count: counts["Gas"] || 0 },
      { name: "Aksesoris", count: counts["Aksesoris"] || 0 },
      { name: "Pakaian", count: counts["Pakaian"] || 0 },
      { name: "Perlengkapan", count: counts["Perlengkapan"] || 0 },
      { name: "Alas Kaki", count: counts["Alas Kaki"] || 0 },
    ];
  }, [products]);

  // Sisa stok real-time (stok master + unit di transaksi asal jika mode edit - unit di keranjang)
  const remainingStockMap = useMemo(() => {
    const map: { [id: string]: number } = {};
    products.forEach((p) => {
      const originalUnits =
        isEditMode && existingRecord
          ? existingRecord.items.find((it) => it.id === p.id)?.jumlah || 0
          : 0;
      const inCart = cart.find((ci) => ci.id === p.id);
      const cartUnits = inCart ? inCart.jumlah : 0;
      map[p.id] = Math.max(0, p.stok + originalUnits - cartUnits);
    });
    return map;
  }, [products, cart, isEditMode, existingRecord]);

  // Filtered & Sorted Catalog
  const displayProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search
        if (searchCatalog.trim()) {
          const q = searchCatalog.toLowerCase().trim();
          const matchName = p.nama.toLowerCase().includes(q);
          const matchSKU = p.kode.toLowerCase().includes(q);
          if (!matchName && !matchSKU) return false;
        }

        // Category
        if (selectedCategory !== "Semua" && p.kategori !== selectedCategory) {
          return false;
        }

        // Stock filter
        if (stockFilter === "ada") {
          const rem = remainingStockMap[p.id] ?? p.stok;
          if (rem <= 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "nama-asc") return a.nama.localeCompare(b.nama);
        if (sortBy === "nama-desc") return b.nama.localeCompare(a.nama);
        if (sortBy === "harga-asc") return a.harga - b.harga;
        if (sortBy === "harga-desc") return b.harga - a.harga;
        return 0;
      });
  }, [products, searchCatalog, selectedCategory, stockFilter, remainingStockMap, sortBy]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(displayProducts.length / itemsPerPage));
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return displayProducts.slice(start, start + itemsPerPage);
  }, [displayProducts, currentPage, itemsPerPage]);

  // Cart Totals
  const subtotal = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [cart]);

  const totalTagihan = Math.max(0, subtotal - diskonManual);

  // Sync uang diterima default = total
  useEffect(() => {
    setNominalDiterima(totalTagihan);
  }, [totalTagihan]);

  const kembalian = Math.max(0, nominalDiterima - totalTagihan);

  // ─── Cart Actions ───
  const handleAddToCart = (product: ProdukJualItem) => {
    const remaining = remainingStockMap[product.id] ?? product.stok;
    if (remaining <= 0) {
      showToast(`Stok ${product.nama} sudah habis.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((ci) => ci.id === product.id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === product.id
            ? {
                ...ci,
                jumlah: ci.jumlah + 1,
                subtotal: ci.harga * (ci.jumlah + 1),
              }
            : ci
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          kode: product.kode,
          nama: product.nama,
          kategori: product.kategori,
          harga: product.harga,
          stok: product.stok,
          jumlah: 1,
          subtotal: product.harga,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    if (delta > 0) {
      const remaining = remainingStockMap[id] ?? 0;
      if (remaining <= 0) {
        showToast("Stok barang ini sudah mencapai batas maksimum ketersediaan.");
        return;
      }
    }

    setCart((prev) =>
      prev
        .map((ci) => {
          if (ci.id === id) {
            const nextQty = ci.jumlah + delta;
            if (nextQty <= 0) return null;
            return {
              ...ci,
              jumlah: nextQty,
              subtotal: ci.harga * nextQty,
            };
          }
          return ci;
        })
        .filter(Boolean) as CartJualItem[]
    );
  };

  const handleRemoveFromCart = (id: string) => {
    setCart((prev) => prev.filter((ci) => ci.id !== id));
  };

  // ─── Submit Transaksi Penjualan (Create / Update dengan Konfirmasi) ───
  const handleProcessPayment = () => {
    if (cart.length === 0) {
      showToast("Keranjang penjualan masih kosong. Pilih produk terlebih dahulu.");
      return;
    }

    if (nominalDiterima < totalTagihan) {
      showToast(`Nominal uang diterima kurang dari total tagihan (${formatRupiah(totalTagihan)}).`);
      return;
    }

    // Buka konfirmasi terlebih dahulu
    setIsConfirmPaymentOpen(true);
  };

  const executeProcessPayment = () => {
    setIsConfirmPaymentOpen(false);

    try {
      if (isEditMode && existingRecord) {
        // Mode Koreksi / Edit Pesanan: perbarui transaksi dan sesuaikan stok
        const updated = updateTransaksiJual(existingRecord.id, {
          pelanggan: {
            nama: selectedCustomer?.nama || "Pelanggan Umum",
            telepon: selectedCustomer?.telepon,
            alamat: selectedCustomer?.alamat,
          },
          items: cart.map((ci) => ({
            id: ci.id,
            kode: ci.kode,
            nama: ci.nama,
            kategori: ci.kategori,
            jumlah: ci.jumlah,
            hargaSatuan: ci.harga,
            subtotal: ci.subtotal,
          })),
          diskon: diskonManual,
          nominalBayar: nominalDiterima,
          metodeBayar: metodePembayaran,
          kasir: kasir,
          catatan: "Perubahan pesanan penjualan ritel kasir",
        });

        if (updated) {
          setSuccessTx(updated);
        } else {
          showToast("Data transaksi tidak ditemukan untuk diperbarui.");
        }
      } else {
        // Mode Transaksi Baru
        const created = createTransaksiJual({
          pelanggan: {
            nama: selectedCustomer?.nama || "Pelanggan Umum",
            telepon: selectedCustomer?.telepon,
            alamat: selectedCustomer?.alamat,
          },
          items: cart.map((ci) => ({
            id: ci.id,
            kode: ci.kode,
            nama: ci.nama,
            kategori: ci.kategori,
            jumlah: ci.jumlah,
            hargaSatuan: ci.harga,
            subtotal: ci.subtotal,
          })),
          diskon: diskonManual,
          nominalBayar: nominalDiterima,
          metodeBayar: metodePembayaran,
          kasir: kasir,
          catatan: "Penjualan ritel toko langsung",
        });

        setSuccessTx(created);
      }
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Gagal memproses transaksi penjualan.");
    }
  };

  const handleResetForm = () => {
    setSuccessTx(null);
    setCart([]);
    setSelectedCustomer(null);
    setDiskonManual(0);
    setKodeTransaksi(generateNextJualKode());
    setProducts(getStoredProdukJual());
  };

  // Color mapper untuk pastel card catalog
  const getCardStyle = (kat: string) => {
    switch (kat) {
      case "Gas":
        return { bg: "#FEF3C7", line: "#FDE68A", text: "#92400E" };
      case "Pakaian":
        return { bg: "#DCFCE7", line: "#BBF7D0", text: "#166534" };
      case "Aksesoris":
        return { bg: "#F3E8FF", line: "#E9D5FF", text: "#6B21A8" };
      case "Perlengkapan":
        return { bg: "#FEF9C3", line: "#FEF08A", text: "#854D0E" };
      case "Alas Kaki":
        return { bg: "#E0F2FE", line: "#BAE6FD", text: "#0369A1" };
      default:
        return { bg: "#F1F5F9", line: "#E2E8F0", text: "#334155" };
    }
  };

  return (
    <div className="main">
      {/* Top Header Navigation */}
      <div className="bc-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/admin/transaksi/jual" className="bc-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali ke Transaksi Penjualan
          </Link>
          <span className="hero-badge">
            {isEditMode ? "ADMIN · KOREKSI TRANSAKSI PENJUALAN" : "ADMIN · TRANSAKSI PENJUALAN"}
          </span>
        </div>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, color: "#0F172A", margin: 0, display: "flex", alignItems: "center", gap: "10px" }}>
          {isEditMode ? "Ubah Transaksi Penjualan" : "Transaksi Penjualan"}
          {isEditMode && (
            <span style={{ fontSize: "12px", background: "#FEF3C7", color: "#92400E", padding: "3px 10px", borderRadius: "9999px", fontWeight: 600 }}>
              Mode Koreksi: {kodeTransaksi}
            </span>
          )}
        </h1>
        <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>
          {isEditMode
            ? "Koreksi data pesanan, pelanggan, atau pembayaran; selisih stok barang akan disesuaikan otomatis."
            : "Pilih produk dari katalog; stok berkurang otomatis setelah pembayaran."}
        </p>
      </div>

      {/* Main 2-Column Grid matching Screenshot 2 */}
      <div className="bc-container">
        {/* Kolom Kiri (65%): Info Penjualan & Katalog Produk */}
        <div className="bc-left-col">
          {/* Card 1: Informasi Penjualan */}
          <div className="bc-card">
            <div className="bc-card-header">
              <h2 className="bc-card-title">Informasi penjualan</h2>
              <span className="bc-code-badge">{kodeTransaksi}</span>
            </div>

            {/* Pelanggan */}
            <div>
              <label className="bc-form-label">Pelanggan</label>
              <div className="bc-customer-search-row">
                <input
                  type="text"
                  className="bc-customer-search-input"
                  placeholder="Cari nama atau nomor WhatsApp pelanggan..."
                  value={customerSearchQuery}
                  onChange={(e) => setCustomerSearchQuery(e.target.value)}
                />
                <button
                  type="button"
                  className="bc-new-cust-btn"
                  onClick={() => setIsNewCustModalOpen(true)}
                >
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "4px" }}>
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                  Pelanggan baru
                </button>
              </div>

              <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
                Kosongkan untuk pelanggan umum.
              </div>

              {/* Customer List */}
              <div className="bc-customer-list" style={{ marginTop: "8px" }}>
                {/* Opsi Pelanggan Umum */}
                <div
                  className={`bc-customer-item ${selectedCustomer === null ? "selected" : ""}`}
                  onClick={() => setSelectedCustomer(null)}
                >
                  <span className="bc-cust-name" style={{ display: "inline-flex", alignItems: "center" }}>
                    {selectedCustomer === null && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                    Pelanggan Umum (Walk-in tanpa identitas)
                  </span>
                  <span className="bc-cust-phone">Umum</span>
                </div>

                {filteredCustomers.slice(0, 3).map((cust) => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      className={`bc-customer-item ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedCustomer(cust)}
                    >
                      <span className="bc-cust-name" style={{ display: "inline-flex", alignItems: "center" }}>
                        {isSelected && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0284C7" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: "6px" }}>
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        )}
                        {cust.nama}
                      </span>
                      <span className="bc-cust-phone">{cust.telepon}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3-Kolom Box: Nomor Transaksi, Tanggal Transaksi, Kasir */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr",
                gap: "12px",
                marginTop: "16px",
                background: "#F8FAFC",
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #E2E8F0",
              }}
            >
              <div>
                <label className="bc-form-label" style={{ fontSize: "11px", color: "#64748B" }}>
                  Nomor Transaksi
                </label>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#0F172A", marginTop: "2px" }}>
                  {kodeTransaksi}
                </div>
              </div>

              <div>
                <label className="bc-form-label" style={{ fontSize: "11px", color: "#64748B" }}>
                  Tanggal Transaksi
                </label>
                <input
                  type="date"
                  className="bc-date-input"
                  style={{ height: "30px", fontSize: "12px", padding: "4px 8px" }}
                  value={tanggalTransaksi}
                  onChange={(e) => setTanggalTransaksi(e.target.value)}
                />
              </div>

              <div>
                <label className="bc-form-label" style={{ fontSize: "11px", color: "#64748B" }}>
                  Kasir
                </label>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "#334155", marginTop: "2px" }}>
                  {kasir}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Katalog Barang Jual */}
          <div className="bc-card">
            {/* Search Bar */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
              <div style={{ position: "relative", flex: 1 }}>
                <input
                  type="text"
                  placeholder="Cari nama barang atau SKU..."
                  className="bc-customer-search-input"
                  style={{ width: "100%", paddingLeft: "32px" }}
                  value={searchCatalog}
                  onChange={(e) => setSearchCatalog(e.target.value)}
                />
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#94A3B8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }}
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            {/* Category Pills matching Screenshot 2 */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "14px" }}>
              {categoriesWithCounts.map((cat) => {
                const isActive = selectedCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.name);
                      setCurrentPage(1);
                    }}
                    style={{
                      padding: "5px 12px",
                      borderRadius: "9999px",
                      border: "none",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: isActive ? "#0F172A" : "#F1F5F9",
                      color: isActive ? "#FFFFFF" : "#475569",
                      transition: "all 0.15s ease",
                    }}
                  >
                    {cat.name} {cat.count}
                  </button>
                );
              })}
            </div>

            {/* Sub-Header: Count, Filter stok, Sort */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "14px",
                flexWrap: "wrap",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: "12.5px", color: "#64748B", fontWeight: 500 }}>
                {displayProducts.length} barang
              </span>

              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                {/* Filter Stok Buttons */}
                <div style={{ display: "flex", background: "#F1F5F9", padding: "2px", borderRadius: "6px" }}>
                  <button
                    type="button"
                    onClick={() => { setStockFilter("semua"); setCurrentPage(1); }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: "none",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: stockFilter === "semua" ? "#FFFFFF" : "transparent",
                      color: stockFilter === "semua" ? "#0F172A" : "#64748B",
                      boxShadow: stockFilter === "semua" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    Semua stok
                  </button>
                  <button
                    type="button"
                    onClick={() => { setStockFilter("ada"); setCurrentPage(1); }}
                    style={{
                      padding: "4px 10px",
                      borderRadius: "4px",
                      border: "none",
                      fontSize: "11.5px",
                      fontWeight: 600,
                      cursor: "pointer",
                      background: stockFilter === "ada" ? "#FFFFFF" : "transparent",
                      color: stockFilter === "ada" ? "#0F172A" : "#64748B",
                      boxShadow: stockFilter === "ada" ? "0 1px 2px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    Stok ada
                  </button>
                </div>

                {/* Sort dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  style={{
                    padding: "4px 8px",
                    borderRadius: "6px",
                    border: "1px solid #CBD5E1",
                    fontSize: "11.5px",
                    color: "#334155",
                    background: "#FFFFFF",
                    outline: "none",
                  }}
                >
                  <option value="nama-asc">Nama A–Z</option>
                  <option value="nama-desc">Nama Z–A</option>
                  <option value="harga-asc">Harga Terendah</option>
                  <option value="harga-desc">Harga Tertinggi</option>
                </select>
              </div>
            </div>

            {/* Product Grid matching Screenshot 2 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
                gap: "12px",
              }}
            >
              {paginatedProducts.map((p) => {
                const rem = remainingStockMap[p.id] ?? p.stok;
                const inCart = cart.find((ci) => ci.id === p.id);
                const isOutOfStock = rem <= 0;
                const cStyle = getCardStyle(p.kategori);

                return (
                  <div
                    key={p.id}
                    onClick={() => !isOutOfStock && handleAddToCart(p)}
                    style={{
                      border: inCart ? "2px solid #0EA5E9" : "1px solid #E2E8F0",
                      borderRadius: "10px",
                      overflow: "hidden",
                      background: "#FFFFFF",
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      opacity: isOutOfStock ? 0.6 : 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.03)",
                      transition: "transform 0.1s ease, box-shadow 0.1s ease",
                    }}
                  >
                    {/* Top Pastel Header with Category & Icon */}
                    <div
                      style={{
                        background: cStyle.bg,
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        position: "relative",
                        minHeight: "85px",
                      }}
                    >
                      <span
                        style={{
                          position: "absolute",
                          left: "8px",
                          top: "8px",
                          fontSize: "10px",
                          fontWeight: 700,
                          color: cStyle.text,
                        }}
                      >
                        {p.kategori}
                      </span>

                      {/* Icon */}
                      <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={cStyle.text} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        {p.kategori === "Gas" ? (
                          <rect x="7" y="4" width="10" height="16" rx="2"></rect>
                        ) : p.kategori === "Pakaian" ? (
                          <path d="M20.38 3.46L16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"></path>
                        ) : p.kategori === "Aksesoris" ? (
                          <circle cx="12" cy="12" r="7"></circle>
                        ) : (
                          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                        )}
                      </svg>
                    </div>

                    {/* Body */}
                    <div style={{ padding: "10px" }}>
                      <h4
                        title={p.nama}
                        style={{
                          margin: "0 0 2px 0",
                          fontSize: "13px",
                          fontWeight: 700,
                          color: "#0F172A",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {p.nama}
                      </h4>
                      <div style={{ fontSize: "11px", color: "#64748B", marginBottom: "6px" }}>
                        SKU: {p.kode}
                      </div>

                      <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                        {formatRupiah(p.harga)}
                      </div>

                      {/* Stock Indicator */}
                      <div
                        style={{
                          fontSize: "11px",
                          fontWeight: 600,
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          color: isOutOfStock ? "#EF4444" : "#10B981",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            background: isOutOfStock ? "#EF4444" : "#10B981",
                          }}
                        ></span>
                        {isOutOfStock ? "Stok habis" : `Stok ${rem}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: "16px",
                  paddingTop: "12px",
                  borderTop: "1px solid #F1F5F9",
                  fontSize: "12px",
                  color: "#64748B",
                }}
              >
                <span>Halaman {currentPage} dari {totalPages}</span>
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    type="button"
                    disabled={currentPage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      cursor: currentPage <= 1 ? "not-allowed" : "pointer",
                      color: currentPage <= 1 ? "#94A3B8" : "#0F172A",
                      fontWeight: 700,
                    }}
                  >
                    ‹
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                    <button
                      key={pg}
                      type="button"
                      onClick={() => setCurrentPage(pg)}
                      style={{
                        width: "28px",
                        height: "28px",
                        borderRadius: "6px",
                        border: pg === currentPage ? "none" : "1px solid #CBD5E1",
                        background: pg === currentPage ? "#0F172A" : "#FFFFFF",
                        color: pg === currentPage ? "#FFFFFF" : "#334155",
                        cursor: "pointer",
                        fontWeight: 600,
                      }}
                    >
                      {pg}
                    </button>
                  ))}
                  <button
                    type="button"
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    style={{
                      width: "28px",
                      height: "28px",
                      borderRadius: "6px",
                      border: "1px solid #CBD5E1",
                      background: "#FFFFFF",
                      cursor: currentPage >= totalPages ? "not-allowed" : "pointer",
                      color: currentPage >= totalPages ? "#94A3B8" : "#0F172A",
                      fontWeight: 700,
                    }}
                  >
                    ›
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Kolom Kanan (35% Sticky Sidebar): Keranjang & Kasir */}
        <div className="bc-right-col">
          <div className="bc-sticky-panel">
            {/* Card 1: Keranjang Penjualan */}
            <div className="bc-card">
              <div className="bc-card-header">
                <h2 className="bc-card-title">Keranjang penjualan</h2>
                <span className="bc-cart-badge" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0EA5E9", display: "inline-block", marginRight: "6px" }}></span>
                  {cart.length} item
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="bc-cart-empty">
                  <div className="bc-cart-empty-title">Keranjang kosong.</div>
                  <p className="bc-cart-empty-sub">Klik kartu barang untuk menambahkan.</p>
                </div>
              ) : (
                <div className="bc-cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="bc-cart-item">
                      <div className="bc-ci-info">
                        <div className="bc-ci-name" title={item.nama}>
                          {item.nama}
                        </div>
                        <div className="bc-ci-rate">
                          {formatRupiah(item.harga)} · SKU: {item.kode}
                        </div>
                      </div>

                      <div className="bc-ci-stepper">
                        <button
                          type="button"
                          className="bc-ci-btn"
                          onClick={() => handleUpdateQty(item.id, -1)}
                          title="Kurangi jumlah"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                        <span className="bc-ci-qty">{item.jumlah}</span>
                        <button
                          type="button"
                          className="bc-ci-btn"
                          onClick={() => handleUpdateQty(item.id, 1)}
                          title="Tambah jumlah"
                        >
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19"></line>
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                          </svg>
                        </button>
                      </div>

                      <div className="bc-ci-subtotal">{formatRupiah(item.subtotal)}</div>

                      <button
                        type="button"
                        className="bc-ci-del-btn"
                        onClick={() => handleRemoveFromCart(item.id)}
                        title="Hapus dari keranjang"
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"></polyline>
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Subtotal & Total Rows */}
              <div style={{ marginTop: "12px", borderTop: "1px solid #E2E8F0", paddingTop: "10px" }}>
                <div className="bc-pay-row" style={{ marginBottom: "6px" }}>
                  <span style={{ color: "#64748B" }}>Subtotal</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{formatRupiah(subtotal)}</span>
                </div>
                <div className="bc-pay-row" style={{ marginBottom: "0" }}>
                  <span style={{ fontWeight: 700, color: "#0F172A" }}>Total</span>
                  <span style={{ fontWeight: 700, fontSize: "15px", color: "#0F172A" }}>
                    {formatRupiah(totalTagihan)}
                  </span>
                </div>
              </div>
            </div>

            {/* Card 2: Pembayaran */}
            <div className="bc-card">
              <div className="bc-card-header">
                <h2 className="bc-card-title">Pembayaran</h2>
              </div>

              {/* Diskon Manual (Rp) */}
              <div className="bc-pay-input-group">
                <label className="bc-form-label">Diskon manual (Rp)</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="bc-pay-input"
                  value={diskonManual}
                  onChange={(e) => setDiskonManual(Math.max(0, parseInt(e.target.value, 10) || 0))}
                />
              </div>

              {/* Uang Diterima */}
              <div className="bc-pay-input-group">
                <label className="bc-form-label">Uang diterima</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="bc-pay-input"
                  value={nominalDiterima}
                  onChange={(e) => setNominalDiterima(parseInt(e.target.value, 10) || 0)}
                  style={{ fontSize: "14px", fontWeight: 600 }}
                />
              </div>

              {/* Metode Pembayaran */}
              <div className="bc-pay-input-group">
                <label className="bc-form-label">Metode pembayaran</label>
                <div className="bc-methods-seg">
                  {(["tunai", "qris", "transfer"] as MetodePembayaranJual[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      className={`bc-method-btn ${metodePembayaran === m ? "active" : ""}`}
                      onClick={() => setMetodePembayaran(m)}
                    >
                      {m === "tunai" ? "Tunai" : m === "qris" ? "QRIS" : "Transfer"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Uang Kembalian */}
              <div className="bc-pay-row">
                <span style={{ color: "#4B5563" }}>Uang kembalian</span>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>
                  {formatRupiah(kembalian)}
                </span>
              </div>

              {/* Status Pembayaran */}
              <div className="bc-pay-row">
                <span style={{ color: "#4B5563" }}>Status pembayaran</span>
                <span className="bc-status-pill paid" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16A34A" }}></span>
                  Selesai
                </span>
              </div>

              {/* Action Button: Proses Pembayaran / Simpan Perubahan */}
              <button
                type="button"
                className="bc-submit-btn"
                onClick={handleProcessPayment}
                disabled={cart.length === 0}
                style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                {isEditMode ? "Simpan Perubahan Transaksi" : "Proses pembayaran"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Pelanggan Baru */}
      <NewCustomerModal
        isOpen={isNewCustModalOpen}
        onClose={() => setIsNewCustModalOpen(false)}
        onAddCustomer={(newCust) => {
          setCustomers((prev) => [newCust, ...prev]);
          setSelectedCustomer(newCust);
          setIsNewCustModalOpen(false);
        }}
      />

      {/* Modal Konfirmasi Pembayaran / Simpan Perubahan */}
      {isConfirmPaymentOpen && (
        <div className="tx-modal-overlay" onClick={() => setIsConfirmPaymentOpen(false)}>
          <div
            className="tx-modal-container"
            style={{ maxWidth: "460px" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="tx-modal-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#E0F2FE", color: "#0284C7", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                </div>
                <div>
                  <h3 className="tx-modal-title" style={{ fontSize: "16px" }}>
                    {isEditMode ? `Simpan Perubahan ${kodeTransaksi}?` : `Selesaikan Penjualan ${kodeTransaksi}?`}
                  </h3>
                  <div style={{ fontSize: "12px", color: "var(--n600)" }}>{selectedCustomer?.nama || "Pelanggan Umum"}</div>
                </div>
              </div>
              <button type="button" className="tx-modal-close" onClick={() => setIsConfirmPaymentOpen(false)}>✕</button>
            </div>

            <div style={{ padding: "14px 20px" }}>
              <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "10px 14px", display: "flex", flexDirection: "column", gap: "6px", fontSize: "12.5px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Barang:</span>
                  <span style={{ fontWeight: 600, color: "#0F172A" }}>{cart.length} item</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #E2E8F0", paddingTop: "6px" }}>
                  <span style={{ color: "#64748B" }}>Total Tagihan:</span>
                  <span style={{ fontWeight: 700, color: "#0284C7" }}>{formatRupiah(totalTagihan)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Bayar ({metodePembayaran.toUpperCase()}):</span>
                  <span style={{ fontWeight: 700, color: "#166534" }}>{formatRupiah(nominalDiterima)}</span>
                </div>
                {kembalian > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#64748B" }}>Kembalian:</span>
                    <span style={{ fontWeight: 700, color: "#166534" }}>{formatRupiah(kembalian)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="tx-modal-footer" style={{ padding: "10px 20px" }}>
              <button
                type="button"
                className="tx-btn-secondary"
                style={{ padding: "7px 14px", fontSize: "12.5px" }}
                onClick={() => setIsConfirmPaymentOpen(false)}
              >
                Batal
              </button>
              <button
                type="button"
                className="tx-btn-primary"
                style={{ padding: "7px 14px", fontSize: "12.5px" }}
                onClick={executeProcessPayment}
              >
                {isEditMode ? "Ya, Simpan" : "Ya, Selesaikan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Sukses & Cetak Struk */}
      {successTx && (
        <div className="tx-modal-overlay">
          <div className="tx-modal-container" style={{ maxWidth: "520px" }}>
            <div className="tx-modal-header" style={{ borderBottom: "none", paddingBottom: "0" }}>
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ width: "52px", height: "52px", borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto 8px auto" }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ margin: "0", fontSize: "19px", fontWeight: 700, color: "#0F172A" }}>
                  {isEditMode ? "Perubahan Berhasil Disimpan!" : "Pembayaran Berhasil!"}
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "12.5px", color: "#64748B" }}>
                  {isEditMode
                    ? "Rincian transaksi penjualan telah diperbarui dan penyesuaian stok telah dicatat."
                    : "Transaksi telah dicatat dan stok barang otomatis terpotong."}
                </p>
              </div>
            </div>

            <div style={{ padding: "18px 24px" }}>
              <div style={{ background: "#F8FAFC", padding: "12px 14px", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "13px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>No Transaksi:</span>
                  <span style={{ fontWeight: 700, color: "#0284C7" }}>{successTx.kode}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Pelanggan:</span>
                  <span style={{ fontWeight: 600 }}>{successTx.pelanggan.nama}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Total Penjualan:</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(successTx.total)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Metode Bayar:</span>
                  <span style={{ fontWeight: 600, textTransform: "uppercase" }}>{successTx.metodeBayar}</span>
                </div>
                {successTx.kembalian > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#166534" }}>
                    <span>Kembalian:</span>
                    <span style={{ fontWeight: 700 }}>{formatRupiah(successTx.kembalian)}</span>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  onClick={() => setIsPrintReceiptOpen(true)}
                  style={{
                    padding: "11px 16px",
                    borderRadius: "8px",
                    background: "#0EA5E9",
                    color: "#FFFFFF",
                    border: "none",
                    fontWeight: 700,
                    fontSize: "13.5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Cetak Struk Penjualan (58mm / 80mm / A4)
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => router.push("/admin/transaksi/jual")}
                    className="tx-btn-secondary"
                    style={{ justifyContent: "center", padding: "10px" }}
                  >
                    Kembali ke Tabel
                  </button>
                  <button
                    type="button"
                    onClick={handleResetForm}
                    className="tx-btn-primary"
                    style={{ justifyContent: "center", padding: "10px" }}
                  >
                    + Transaksi Baru
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cetak Struk */}
      {successTx && (
        <PrintReceiptJualModal
          isOpen={isPrintReceiptOpen}
          record={successTx}
          onClose={() => setIsPrintReceiptOpen(false)}
        />
      )}

      {/* Toast Warning */}
      {toastError && (
        <div className="booking-toast warning" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
            <line x1="12" y1="9" x2="12" y2="13"></line>
            <line x1="12" y1="17" x2="12.01" y2="17"></line>
          </svg>
          <span>{toastError}</span>
        </div>
      )}
    </div>
  );
}

export default function AdminTransaksiJualBaruPage() {
  return (
    <Suspense fallback={<div className="main" style={{ padding: "40px 24px", color: "#64748B" }}>Memuat formulir penjualan...</div>}>
      <TransaksiJualFormInner />
    </Suspense>
  );
}
