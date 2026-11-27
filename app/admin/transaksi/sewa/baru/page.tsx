// app/admin/transaksi/sewa/baru/page.tsx
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/components/transaksi/transaksi.css";
import "@/components/booking/booking.css";
import "@/components/booking/create/booking-create.css";
import {
  CustomerData,
  CatalogProduct,
  CartItem,
  PaymentMethod,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  ProductCatalogCard,
  calculateEndDate,
} from "@/components/booking/create";
import {
  calculatePeriodBaseStock,
  calculateDynamicCatalogWithCart,
} from "@/components/booking/create/stockService";
import { NewCustomerModal } from "@/components/booking/create/NewCustomerModal";
import {
  createTransaksiLangsung,
  generateNextTransaksiKode,
} from "@/components/transaksi/sewaStore";
import { TransaksiSewaRecord, SewaItem } from "@/components/transaksi/types";
import { PrintReceiptModal } from "@/components/transaksi/PrintReceiptModal";
import { formatRupiah } from "@/lib/format";

const DEFAULT_RENTAL_START = "2026-11-27";

function DirectRentalFormInner() {
  const router = useRouter();

  // ─── Kode Transaksi ───
  const [trxKode, setTrxKode] = useState("TRX-0451");

  // ─── Pelanggan State ───
  const [customers, setCustomers] = useState<CustomerData[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(MOCK_CUSTOMERS[0]);
  const [customerSearchQuery, setCustomerSearchQuery] = useState("");
  const [isNewCustModalOpen, setIsNewCustModalOpen] = useState(false);

  // ─── Tanggal & Durasi (Hari-H Walk-in) ───
  const [tanggalSewa, setTanggalSewa] = useState<string>(DEFAULT_RENTAL_START);
  const [durasiHari, setDurasiHari] = useState<number>(2);

  // ─── Poin 2: Wajib Dicatat - Jenis Identitas Jaminan Fisik (tanpa nomor identitas) ───
  const [jaminanFisik, setJaminanFisik] = useState("KTP Asli atas nama penyewa");

  // ─── Keranjang Sewa ───
  const [cart, setCart] = useState<CartItem[]>([]);

  // ─── Poin 3 & 4: Pembayaran Pelunasan Total Sewa (Tanpa DP, Lunas 100% di Kasir) ───
  const [metodePembayaran, setMetodePembayaran] = useState<PaymentMethod>("tunai");
  const [nominalDiterima, setNominalDiterima] = useState<number>(0);

  // ─── Dialog Sukses & Feedback ───
  const [successTx, setSuccessTx] = useState<TransaksiSewaRecord | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  // Auto generate Next Code on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      setTrxKode(generateNextTransaksiKode());
    }
  }, []);

  // Update default jaminan ketika pelanggan berubah
  useEffect(() => {
    if (selectedCustomer) {
      setJaminanFisik(`KTP Asli atas nama ${selectedCustomer.nama}`);
    }
  }, [selectedCustomer]);

  // Tanggal Selesai Sewa
  const tanggalSelesaiSewa = useMemo(() => {
    return calculateEndDate(tanggalSewa, durasiHari);
  }, [tanggalSewa, durasiHari]);

  // Filter Pelanggan
  const filteredCustomers = useMemo(() => {
    if (!customerSearchQuery.trim()) return customers;
    const q = customerSearchQuery.toLowerCase().trim();
    return customers.filter(
      (c) => c.nama.toLowerCase().includes(q) || c.telepon.includes(q)
    );
  }, [customers, customerSearchQuery]);

  // Base stock ketersediaan
  const baseProducts = useMemo(() => {
    return calculatePeriodBaseStock(MOCK_PRODUCTS, tanggalSewa, tanggalSelesaiSewa);
  }, [tanggalSewa, tanggalSelesaiSewa]);

  // Ketersediaan dinamis real-time
  const { dynamicProducts, remainingSingleStockMap, remainingPackageStockMap } = useMemo(() => {
    return calculateDynamicCatalogWithCart(baseProducts, cart);
  }, [baseProducts, cart]);

  const remainingStockMap = useMemo(() => {
    return { ...remainingSingleStockMap, ...remainingPackageStockMap };
  }, [remainingSingleStockMap, remainingPackageStockMap]);

  // Total Biaya Sewa
  const totalBiaya = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [cart]);

  const totalItemCount = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.jumlah, 0);
  }, [cart]);

  // Poin 3: Tanpa DP, default uang diterima otomatis sama dengan total sewa (Lunas 100%)
  useEffect(() => {
    setNominalDiterima(totalBiaya);
  }, [totalBiaya]);

  const kembalian = Math.max(0, nominalDiterima - totalBiaya);
  const sisaTagihan = Math.max(0, totalBiaya - nominalDiterima);

  // ─── Handlers ───
  const showToast = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 4000);
  };

  const handleDurasiChange = (newDurasi: number) => {
    const validDur = Math.max(1, newDurasi);
    setDurasiHari(validDur);
    setCart((prev) =>
      prev.map((item) => ({
        ...item,
        subtotal: item.hargaPerHari * item.jumlah * validDur,
      }))
    );
  };

  const handleAddToCart = (product: CatalogProduct) => {
    const currentRemaining = remainingStockMap[product.id] ?? product.unitTersedia;
    if (currentRemaining <= 0) {
      showToast(`Stok unit ${product.nama} sudah maksimal atau habis.`);
      return;
    }

    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? {
                ...item,
                jumlah: item.jumlah + 1,
                subtotal: item.hargaPerHari * (item.jumlah + 1) * durasiHari,
              }
            : item
        );
      }

      return [
        ...prev,
        {
          id: product.id,
          kode: product.kode,
          nama: product.nama,
          tipe: product.tipe,
          kategori: product.kategori,
          hargaPerHari: product.hargaPerHari,
          jumlah: 1,
          unitTersedia: product.totalUnit,
          subtotal: product.hargaPerHari * 1 * durasiHari,
          itemsPaket: product.itemsPaket,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    if (delta > 0) {
      const currentRemaining = remainingStockMap[id] ?? 0;
      if (currentRemaining <= 0) {
        showToast("Stok unit barang untuk periode ini sudah mencapai batas maksimum.");
        return;
      }
    }

    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id) {
            const nextQty = item.jumlah + delta;
            if (nextQty <= 0) return null;
            return {
              ...item,
              jumlah: nextQty,
              subtotal: item.hargaPerHari * nextQty * durasiHari,
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // ─── Submit Transaksi Langsung ───
  const handleSubmitTransaksiLangsung = () => {
    if (!selectedCustomer) {
      showToast("Pilih data pelanggan terlebih dahulu.");
      return;
    }
    if (cart.length === 0) {
      showToast("Keranjang sewa masih kosong. Tambahkan minimal satu barang atau paket.");
      return;
    }
    if (!jaminanFisik.trim()) {
      showToast("Wajib mengisi jenis identitas jaminan fisik (misal: KTP Asli atas nama penyewa atau SIM A).");
      return;
    }

    try {
      const mappedItems: SewaItem[] = cart.map((it) => ({
        id: it.id,
        nama: it.nama,
        tipe: it.tipe === "paket" ? "paket" : "satuan",
        kategori: it.kategori,
        jumlah: it.jumlah,
        hargaPerHari: it.hargaPerHari,
        subtotal: it.subtotal,
        rincianPaket: it.itemsPaket,
      }));

      // Poin 5: Menghasilkan transaksi sewa dengan status Sudah Diambil dan Lunas
      const created = createTransaksiLangsung({
        pelanggan: {
          nama: selectedCustomer.nama,
          telepon: selectedCustomer.telepon,
          alamat: selectedCustomer.alamat,
        },
        tglMulai: tanggalSewa,
        durasiHari,
        items: mappedItems,
        jaminanFisik: jaminanFisik.trim(),
        metodePembayaran,
      });

      setSuccessTx(created);
    } catch (err: unknown) {
      showToast(err instanceof Error ? err.message : "Gagal memproses transaksi langsung.");
    }
  };

  const handleResetForm = () => {
    setSuccessTx(null);
    setCart([]);
    setSelectedCustomer(MOCK_CUSTOMERS[0]);
    setTrxKode(generateNextTransaksiKode());
  };

  return (
    <div className="main">
      {/* Top Bar with Back Button */}
      <div className="bc-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/admin/transaksi/sewa" className="bc-back-btn">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Kembali ke Transaksi Penyewaan
          </Link>
          <span className="hero-badge">
            ADMIN · TRANSAKSI LANGSUNG
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid (Persis seperti Catat Booking) */}
      <div className="bc-container">
        {/* Left Column (65%) */}
        <div className="bc-left-col">
          {/* Card 1: Informasi Transaksi Langsung */}
          <div className="bc-card">
            <div className="bc-card-header">
              <h2 className="bc-card-title">Informasi transaksi langsung</h2>
              <span className="bc-code-badge">{trxKode}</span>
            </div>

            {/* Pelanggan Field */}
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

              {/* Customer Results List */}
              <div className="bc-customer-list">
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

            {/* Tanggal & Durasi Sewa */}
            <div className="bc-date-duration-row">
              <div className="bc-field-col">
                <label className="bc-form-label">Tanggal transaksi / sewa</label>
                <input
                  type="date"
                  className="bc-date-input"
                  value={tanggalSewa}
                  onChange={(e) => setTanggalSewa(e.target.value)}
                  title="Tanggal transaksi sewa langsung di toko (Hari-H)"
                />
              </div>

              <div className="bc-field-col">
                <label className="bc-form-label">Durasi sewa</label>
                <div className="bc-duration-field">
                  <input
                    type="number"
                    min={1}
                    className="bc-date-input"
                    value={durasiHari}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      handleDurasiChange(isNaN(val) || val < 1 ? 1 : val);
                    }}
                    title="Masukkan durasi sewa dalam hari"
                  />
                  <span className="bc-duration-suffix">hari</span>
                </div>
              </div>
            </div>

            {/* Tanggal Selesai Sewa Otomatis */}
            <div className="bc-end-date-section">
              <span className="bc-end-date-label">Tanggal selesai sewa (otomatis)</span>
              <div className="bc-end-date-value">
                {tanggalSelesaiSewa} (s.d. 21.00 WIB)
              </div>
            </div>

            {/* Info Callout Banner dengan SVG Icon */}
            <div className="bc-info-callout" style={{ marginTop: "16px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#0369A1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
              </svg>
              <div>
                Pelanggan datang langsung ke toko hari itu juga (walk-in) dan langsung membawa barang pulang. Unit barang langsung diserahterimakan (<strong>Sudah diambil</strong>), jaminan fisik dicatat di kasir, dan transaksi wajib dibayar <strong>LUNAS 100% tanpa DP</strong> di kasir saat itu juga.
              </div>
            </div>
          </div>

          {/* Card 2: Catalog (Single Items & Packages) persis seperti Catat Booking */}
          <ProductCatalogCard
            products={dynamicProducts}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Right Column (35%, Sticky Sidebar Container) */}
        <div className="bc-right-col">
          <div className="bc-sticky-panel">
            {/* Card 1: Keranjang transaksi sewa */}
            <div className="bc-card">
              <div className="bc-card-header">
                <h2 className="bc-card-title">Keranjang transaksi sewa</h2>
                <span className="bc-cart-badge" style={{ display: "inline-flex", alignItems: "center" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0EA5E9", display: "inline-block", marginRight: "6px" }}></span>
                  {totalItemCount} item
                </span>
              </div>

              {cart.length === 0 ? (
                <div className="bc-cart-empty">
                  <div className="bc-cart-empty-title">Keranjang kosong.</div>
                  <p className="bc-cart-empty-sub">Klik kartu barang atau paket untuk menambahkan.</p>
                </div>
              ) : (
                <div className="bc-cart-list">
                  {cart.map((item) => (
                    <div key={item.id} className="bc-cart-item">
                      <div className="bc-ci-info">
                        <div className="bc-ci-name" title={item.nama}>
                          {item.tipe === "paket" && (
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: "inline-block", verticalAlign: "middle", marginRight: "4px" }}>
                              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                              <line x1="12" y1="22.08" x2="12" y2="12"></line>
                            </svg>
                          )}
                          {item.nama}
                        </div>
                        <div className="bc-ci-rate">
                          {formatRupiah(item.hargaPerHari)}/hari · {durasiHari} hr
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
                        onClick={() => handleRemoveItem(item.id)}
                        title="Hapus barang dari keranjang"
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
            </div>

            {/* Card 2: Pembayaran Kasir (Walk-in: Tanpa DP, Lunas 100%) */}
            <div className="bc-card">
              <div className="bc-card-header">
                <h2 className="bc-card-title">Pembayaran</h2>
              </div>

              {/* Callout box Walk-in dengan SVG Icon */}
              <div className="bc-pay-banner" style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "2px" }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
                <div>
                  Transaksi sewa langsung (Hari-H). <strong>Tanpa DP</strong>, seluruh tagihan sewa wajib dibayar <strong>LUNAS 100%</strong> di kasir saat serah terima barang.
                </div>
              </div>

              {/* Total Tagihan Sewa */}
              <div className="bc-pay-row">
                <span style={{ color: "#4B5563" }}>Total tagihan sewa</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#111827" }}>
                  {formatRupiah(totalBiaya)}
                </span>
              </div>

              {/* Nominal Pembayaran Diterima di Kasir */}
              <div className="bc-pay-input-group">
                <label className="bc-form-label">Nominal pembayaran diterima di kasir</label>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  className="bc-pay-input"
                  value={nominalDiterima}
                  onChange={(e) => setNominalDiterima(parseInt(e.target.value, 10) || 0)}
                  style={{ fontSize: "14px", fontWeight: 600 }}
                />
                <div className="bc-pay-helper">
                  Wajib lunas 100% sebesar {formatRupiah(totalBiaya)}.
                </div>
              </div>

              {/* Poin 2: Wajib Dicatat - Jenis Identitas Jaminan Fisik di Kasir */}
              <div className="bc-pay-input-group">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <label className="bc-form-label" style={{ margin: 0 }}>Jenis identitas jaminan fisik *</label>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#166534", background: "#DCFCE7", padding: "2px 8px", border: "1px solid #BBF7D0", borderRadius: "4px", fontWeight: 700 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Wajib dicatat
                  </span>
                </div>
                <input
                  type="text"
                  className="bc-pay-input"
                  placeholder="Misal: KTP Asli atas nama penyewa atau SIM A (tanpa nomor identitas)"
                  value={jaminanFisik}
                  onChange={(e) => setJaminanFisik(e.target.value)}
                  required
                />
                <div className="bc-pay-helper">
                  Ditulis manual tanpa nomor identitas saat serah terima fisik di kasir.
                </div>
              </div>

              {/* Metode Pembayaran */}
              <div className="bc-pay-input-group">
                <label className="bc-form-label">Metode pembayaran</label>
                <div className="bc-methods-seg">
                  {(["tunai", "qris", "transfer"] as PaymentMethod[]).map((method) => (
                    <button
                      key={method}
                      type="button"
                      className={`bc-method-btn ${metodePembayaran === method ? "active" : ""}`}
                      onClick={() => setMetodePembayaran(method)}
                    >
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kembalian kasir jika ada */}
              {nominalDiterima > totalBiaya && (
                <div className="bc-pay-row" style={{ background: "#F0F9FF", padding: "8px 10px", borderRadius: "6px", border: "1px solid #BAE6FD" }}>
                  <span style={{ color: "#0369A1", fontWeight: 600 }}>Kembalian kasir</span>
                  <span style={{ color: "#0369A1", fontWeight: 700 }}>{formatRupiah(kembalian)}</span>
                </div>
              )}

              {/* Sisa Tagihan */}
              <div className="bc-pay-row">
                <span style={{ color: "#4B5563" }}>Sisa tagihan</span>
                <span style={{ fontWeight: 700, color: sisaTagihan > 0 ? "#DC2626" : "#166534" }}>
                  {formatRupiah(sisaTagihan)}
                </span>
              </div>

              {/* Status Pembayaran */}
              <div className="bc-pay-row">
                <span style={{ color: "#4B5563" }}>Status pembayaran</span>
                <span className="bc-status-pill paid" style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#16A34A" }}></span>
                  Lunas
                </span>
              </div>

              {/* Status Pengambilan */}
              <div className="bc-pay-row">
                <span style={{ color: "#4B5563" }}>Status pengambilan</span>
                <span className="bc-status-pill" style={{ background: "#E0F2FE", color: "#0369A1", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#0284C7" }}></span>
                  Sudah diambil
                </span>
              </div>

              {/* Action Button: Selesaikan & Serahkan Barang */}
              <button
                type="button"
                className="bc-submit-btn"
                onClick={handleSubmitTransaksiLangsung}
                disabled={cart.length === 0}
                style={{ marginTop: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Selesaikan & Serahkan Barang
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Tambah Pelanggan Baru */}
      <NewCustomerModal
        isOpen={isNewCustModalOpen}
        onClose={() => setIsNewCustModalOpen(false)}
        onAddCustomer={(newCust: CustomerData) => {
          setCustomers((prev) => [newCust, ...prev]);
          setSelectedCustomer(newCust);
          setIsNewCustModalOpen(false);
        }}
      />

      {/* Modal Transaksi Berhasil & Cetak Struk */}
      {successTx && (
        <div className="tx-modal-overlay">
          <div className="tx-modal-container" style={{ maxWidth: "560px" }}>
            <div className="tx-modal-header" style={{ borderBottom: "none", paddingBottom: "0" }}>
              <div style={{ textAlign: "center", width: "100%" }}>
                <div style={{ width: "56px", height: "56px", borderRadius: "50%", background: "#DCFCE7", color: "#166534", display: "inline-flex", alignItems: "center", justifyContent: "center", margin: "0 auto 10px auto" }}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <h3 style={{ margin: "0", fontSize: "20px", fontWeight: 700, color: "#0F172A" }}>
                  Transaksi Langsung Berhasil!
                </h3>
                <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "#64748B" }}>
                  Barang telah diserahterimakan ke pelanggan dan pembayaran tercatat lunas di kasir.
                </p>
              </div>
            </div>

            <div style={{ padding: "20px 24px" }}>
              <div style={{ background: "#F8FAFC", padding: "14px", borderRadius: "8px", border: "1px solid #E2E8F0", display: "flex", flexDirection: "column", gap: "8px", fontSize: "13px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Kode Transaksi</span>
                  <span style={{ fontWeight: 700, color: "#0284C7" }}>{successTx.kode}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Pelanggan</span>
                  <span style={{ fontWeight: 600 }}>{successTx.pelanggan.nama} ({successTx.pelanggan.telepon})</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Jaminan Fisik Disimpan</span>
                  <span style={{ fontWeight: 600, color: "#1E40AF" }}>{successTx.jaminanFisik}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Total Tagihan</span>
                  <span style={{ fontWeight: 700 }}>{formatRupiah(successTx.totalTagihan)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Status Pembayaran</span>
                  <span className="tx-dot-badge lunas" style={{ fontWeight: 700 }}>
                    <span className="tx-dot green"></span>
                    Lunas ({(successTx.metodePelunasan || "TUNAI").toUpperCase()})
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Status Pengambilan</span>
                  <span className="tx-dot-badge diambil" style={{ fontWeight: 700 }}>
                    <span className="tx-dot green"></span>
                    Sudah diambil
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#64748B" }}>Batas Pengembalian</span>
                  <span style={{ fontWeight: 600, color: "#D97706" }}>{successTx.tglKembaliDisplay}</span>
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "18px" }}>
                <button
                  type="button"
                  onClick={() => setIsReceiptOpen(true)}
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
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9"></polyline>
                    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
                    <rect x="6" y="14" width="12" height="8"></rect>
                  </svg>
                  Cetak Struk Bukti Sewa (58mm / 80mm / A4)
                </button>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    onClick={() => router.push("/admin/transaksi/sewa")}
                    className="tx-btn-secondary"
                    style={{ justifyContent: "center", padding: "10px" }}
                  >
                    Kembali ke Tabel Sewa
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
        <PrintReceiptModal
          isOpen={isReceiptOpen}
          record={successTx}
          onClose={() => setIsReceiptOpen(false)}
        />
      )}

      {/* Toast Alert */}
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

export default function AdminDirectRentalPage() {
  return (
    <Suspense
      fallback={
        <div className="main" style={{ padding: "40px 24px", color: "#6B7280" }}>
          Memuat formulir transaksi langsung...
        </div>
      }
    >
      <DirectRentalFormInner />
    </Suspense>
  );
}
