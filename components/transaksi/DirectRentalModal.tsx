// components/transaksi/DirectRentalModal.tsx
"use client";

import React, { useState, useMemo } from "react";
import { SewaItem, MetodePembayaran, TransaksiSewaRecord } from "./types";
import { createTransaksiLangsung } from "./sewaStore";

interface DirectRentalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTx: TransaksiSewaRecord) => void;
}

interface CatalogItem {
  id: string;
  nama: string;
  tipe: "satuan" | "paket";
  kategori: string;
  hargaPerHari: number;
  stokTersedia: number;
  deskripsi?: string;
  rincianPaket?: string[];
}

const CATALOG_ITEMS: CatalogItem[] = [
  // Barang Satuan
  { id: "b-01", nama: "Tenda Dome 4P Double Layer", tipe: "satuan", kategori: "Tenda", hargaPerHari: 60000, stokTersedia: 8, deskripsi: "Tahan angin & badai, waterproof 3000mm" },
  { id: "b-02", nama: "Tenda Dome 2P Ultralight", tipe: "satuan", kategori: "Tenda", hargaPerHari: 45000, stokTersedia: 12, deskripsi: "Ringan 1.8kg, frame alloy" },
  { id: "b-03", nama: "Carrier 60L + Rain Cover", tipe: "satuan", kategori: "Carrier", hargaPerHari: 45000, stokTersedia: 10, deskripsi: "Backsystem nyaman, sirkulasi udara baik" },
  { id: "b-04", nama: "Sleeping Bag Polar Bulu", tipe: "satuan", kategori: "Sleeping Gear", hargaPerHari: 20000, stokTersedia: 25, deskripsi: "Hangat nyaman suhu 5-15°C" },
  { id: "b-05", nama: "Kompor Portable Mini Windproof", tipe: "satuan", kategori: "Memasak", hargaPerHari: 15000, stokTersedia: 15, deskripsi: "Anti angin dengan pemantik otomatis" },
  { id: "b-06", nama: "Matras Foam Aluminium Foil", tipe: "satuan", kategori: "Sleeping Gear", hargaPerHari: 12500, stokTersedia: 30, deskripsi: "Isolasi dingin tanah yang efektif" },
  { id: "b-07", nama: "Headlamp LED Outdoor Waterproof", tipe: "satuan", kategori: "Penerangan", hargaPerHari: 15000, stokTersedia: 20, deskripsi: "350 lumens, baterai tahan lama" },
  { id: "b-08", nama: "Cookware Set Nesting DS-300", tipe: "satuan", kategori: "Memasak", hargaPerHari: 20000, stokTersedia: 10, deskripsi: "Aluminium anodized 3 panci + wajan" },
  { id: "b-09", nama: "Flysheet 3x4 Meter Waterproof", tipe: "satuan", kategori: "Tenda", hargaPerHari: 20000, stokTersedia: 14, deskripsi: "Pelindung hujan dan terik matahari" },
  { id: "b-10", nama: "Trekking Pole Antishock", tipe: "satuan", kategori: "Aksesoris", hargaPerHari: 15000, stokTersedia: 18, deskripsi: "Alloy 7075 dengan sistem antishock" },

  // Paket Penyewaan
  {
    id: "p-01",
    nama: "Paket Camping Keluarga (4-6 Orang)",
    tipe: "paket",
    kategori: "Paket Hemat",
    hargaPerHari: 325000,
    stokTersedia: 4,
    deskripsi: "Paket lengkap hemat untuk keluarga tanpa repot",
    rincianPaket: ["1x Tenda Dome 6P", "4x Matras Foam", "4x Sleeping Bag", "1x Kompor Portable", "1x Cookware Set", "2x Lampu Tenda"],
  },
  {
    id: "p-02",
    nama: "Paket Pendakian Duo (2 Orang)",
    tipe: "paket",
    kategori: "Paket Hemat",
    hargaPerHari: 150000,
    stokTersedia: 6,
    deskripsi: "Paket praktis & ringan untuk 2 pendaki",
    rincianPaket: ["1x Tenda Dome 2P", "2x Sleeping Bag", "2x Matras Foam", "1x Kompor & Nesting", "2x Headlamp LED"],
  },
  {
    id: "p-03",
    nama: "Paket Pendakian Solo Ultralight",
    tipe: "paket",
    kategori: "Paket Hemat",
    hargaPerHari: 95000,
    stokTersedia: 5,
    deskripsi: "Paket ringkas untuk petualang mandiri",
    rincianPaket: ["1x Tenda Solo Ultralight", "1x Sleeping Bag", "1x Matras", "1x Kompor Mini", "1x Headlamp"],
  },
];

export function DirectRentalModal({ isOpen, onClose, onSuccess }: DirectRentalModalProps) {
  const today = new Date().toISOString().substring(0, 10);

  // Form State
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [tglMulai, setTglMulai] = useState(today);
  const [durasiHari, setDurasiHari] = useState(2);
  const [cartItems, setCartItems] = useState<SewaItem[]>([
    {
      id: "b-01",
      nama: "Tenda Dome 4P Double Layer",
      tipe: "satuan",
      kategori: "Tenda",
      jumlah: 1,
      hargaPerHari: 60000,
      subtotal: 120000,
    },
  ]);
  const [jaminanFisik, setJaminanFisik] = useState("");
  const [metodePembayaran, setMetodePembayaran] = useState<MetodePembayaran>("tunai");

  // Catalog UI State
  const [activeTab, setActiveTab] = useState<"satuan" | "paket">("satuan");
  const [searchCatalog, setSearchCatalog] = useState("");
  const [selectedKategori, setSelectedKategori] = useState<string>("semua");
  const [errorMsg, setErrorMsg] = useState("");

  // Auto calculate end date
  const calculatedEndDate = useMemo(() => {
    try {
      const d = new Date(tglMulai);
      d.setDate(d.getDate() + durasiHari);
      const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
      return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} (s.d. 21.00 WIB)`;
    } catch {
      return "-";
    }
  }, [tglMulai, durasiHari]);

  // Filtered Catalog
  const filteredCatalog = CATALOG_ITEMS.filter((item) => {
    if (item.tipe !== activeTab) return false;
    if (selectedKategori !== "semua" && item.kategori !== selectedKategori) return false;
    if (searchCatalog.trim()) {
      const q = searchCatalog.toLowerCase();
      const matchNama = item.nama.toLowerCase().includes(q);
      const matchKategori = item.kategori.toLowerCase().includes(q);
      if (!matchNama && !matchKategori) return false;
    }
    return true;
  });

  // Unique categories for active tab
  const kategoriOptions = ["semua", ...Array.from(new Set(CATALOG_ITEMS.filter((i) => i.tipe === activeTab).map((i) => i.kategori)))];

  // Cart operations
  const handleAddToCart = (cat: CatalogItem) => {
    setCartItems((prev) => {
      const existing = prev.find((it) => it.id === cat.id);
      if (existing) {
        return prev.map((it) =>
          it.id === cat.id
            ? {
                ...it,
                jumlah: it.jumlah + 1,
                subtotal: it.hargaPerHari * (it.jumlah + 1) * durasiHari,
              }
            : it
        );
      }
      return [
        ...prev,
        {
          id: cat.id,
          nama: cat.nama,
          tipe: cat.tipe,
          kategori: cat.kategori,
          jumlah: 1,
          hargaPerHari: cat.hargaPerHari,
          subtotal: cat.hargaPerHari * 1 * durasiHari,
          rincianPaket: cat.rincianPaket,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) => {
      return prev
        .map((it) => {
          if (it.id === id) {
            const nextQty = it.jumlah + delta;
            if (nextQty <= 0) return null;
            return {
              ...it,
              jumlah: nextQty,
              subtotal: it.hargaPerHari * nextQty * durasiHari,
            };
          }
          return it;
        })
        .filter(Boolean) as SewaItem[];
    });
  };

  const handleDurationChange = (days: number) => {
    const validDays = Math.max(1, days);
    setDurasiHari(validDays);
    setCartItems((prev) =>
      prev.map((it) => ({
        ...it,
        subtotal: it.hargaPerHari * it.jumlah * validDays,
      }))
    );
  };

  const totalTagihan = cartItems.reduce((acc, it) => acc + it.subtotal, 0);
  const formatRupiah = (val: number) => `Rp ${val.toLocaleString("id-ID")}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !telepon.trim()) {
      setErrorMsg("Nama dan nomor telepon pelanggan wajib diisi.");
      return;
    }
    if (cartItems.length === 0) {
      setErrorMsg("Pilih minimal satu barang sewa atau paket.");
      return;
    }
    if (!jaminanFisik.trim()) {
      setErrorMsg("Tuliskan jaminan fisik yang diserahkan pelanggan (misal: KTP Asli / SIM A).");
      return;
    }

    try {
      const newTx = createTransaksiLangsung({
        pelanggan: { nama: nama.trim(), telepon: telepon.trim(), alamat: alamat.trim() },
        tglMulai,
        durasiHari,
        items: cartItems,
        jaminanFisik: jaminanFisik.trim(),
        metodePembayaran,
      });
      onSuccess(newTx);
      onClose();
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Gagal menyimpan transaksi langsung.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="tx-modal-overlay" onClick={onClose}>
      <div
        className="tx-modal-container"
        style={{ maxWidth: "980px", width: "95vw", height: "92vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="tx-modal-header">
          <div>
            <h2 className="tx-modal-title">Transaksi Penyewaan Langsung (Walk-In)</h2>
            <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#64748B" }}>
              Pelanggan datang langsung ke toko. Tagihan dibayar lunas di kasir saat serah terima barang dan penyerahan jaminan fisik.
            </p>
          </div>
          <button type="button" className="tx-modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden" }}>
          {/* Main Body - Split 2 Kolom */}
          <div
            className="tx-modal-body"
            style={{
              display: "grid",
              gridTemplateColumns: "1.1fr 1fr",
              gap: "20px",
              padding: "18px 22px",
              overflowY: "auto",
              flex: 1,
            }}
          >
            {/* Kolom Kiri: Pelanggan, Jadwal, & Katalog Barang */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Box 1: Data Pelanggan (§J.4) */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "14px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "10px" }}>
                  1. Data Pelanggan Walk-In
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Nama Lengkap <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="tx-search-input"
                      style={{ paddingLeft: "10px" }}
                      placeholder="Nama penyewa"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      No. WhatsApp / Telepon <span style={{ color: "#DC2626" }}>*</span>
                    </label>
                    <input
                      type="text"
                      className="tx-search-input"
                      style={{ paddingLeft: "10px" }}
                      placeholder="08xxxxxxxxxx"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div style={{ marginTop: "8px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                    Alamat / Asal Kampus (Opsional)
                  </label>
                  <input
                    type="text"
                    className="tx-search-input"
                    style={{ paddingLeft: "10px" }}
                    placeholder="Contoh: Jatinangor / Sumedang"
                    value={alamat}
                    onChange={(e) => setAlamat(e.target.value)}
                  />
                </div>
              </div>

              {/* Box 2: Jadwal & Durasi Sewa (§F.1.7) */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "14px" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "10px" }}>
                  2. Periode Sewa Langsung
                </span>
                <div style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr 1.3fr", gap: "10px", alignItems: "end" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Mulai Sewa
                    </label>
                    <input
                      type="date"
                      className="tx-search-input"
                      style={{ paddingLeft: "8px" }}
                      value={tglMulai}
                      onChange={(e) => setTglMulai(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Durasi (Hari)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="30"
                      className="tx-search-input"
                      style={{ paddingLeft: "8px" }}
                      value={durasiHari}
                      onChange={(e) => handleDurationChange(parseInt(e.target.value) || 1)}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "12px", fontWeight: 600, color: "#334155", marginBottom: "4px" }}>
                      Batas Kembali (Otomatis)
                    </label>
                    <div
                      style={{
                        padding: "8px 10px",
                        background: "#F8FAFC",
                        border: "1px solid #CBD5E1",
                        borderRadius: "6px",
                        fontSize: "12px",
                        fontWeight: 600,
                        color: "#0284C7",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {calculatedEndDate}
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 3: Katalog Barang & Paket (§F.1.31) */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                  <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    3. Pilih Barang / Paket
                  </span>
                  {/* Tab Satuan & Paket */}
                  <div style={{ display: "flex", gap: "4px", background: "#F1F5F9", padding: "3px", borderRadius: "6px" }}>
                    <button
                      type="button"
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: activeTab === "satuan" ? "#0F172A" : "transparent",
                        color: activeTab === "satuan" ? "#FFFFFF" : "#64748B",
                      }}
                      onClick={() => setActiveTab("satuan")}
                    >
                      Barang Satuan
                    </button>
                    <button
                      type="button"
                      style={{
                        padding: "4px 10px",
                        fontSize: "12px",
                        fontWeight: 600,
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: activeTab === "paket" ? "#0F172A" : "transparent",
                        color: activeTab === "paket" ? "#FFFFFF" : "#64748B",
                      }}
                      onClick={() => setActiveTab("paket")}
                    >
                      Paket Penyewaan
                    </button>
                  </div>
                </div>

                {/* Filter Kategori & Search */}
                <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
                  <input
                    type="text"
                    className="tx-search-input"
                    style={{ paddingLeft: "10px", flex: 1, fontSize: "12px" }}
                    placeholder="Cari nama barang atau kategori..."
                    value={searchCatalog}
                    onChange={(e) => setSearchCatalog(e.target.value)}
                  />
                  <select
                    className="tx-select"
                    style={{ minWidth: "120px", fontSize: "12px", padding: "6px 24px 6px 8px" }}
                    value={selectedKategori}
                    onChange={(e) => setSelectedKategori(e.target.value)}
                  >
                    {kategoriOptions.map((k) => (
                      <option key={k} value={k}>
                        {k === "semua" ? "Semua Kategori" : k}
                      </option>
                    ))}
                  </select>
                </div>

                {/* List Item Katalog */}
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "180px", overflowY: "auto" }}>
                  {filteredCatalog.map((item) => (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 10px",
                        border: "1px solid #E2E8F0",
                        borderRadius: "6px",
                        background: "#FAFAFA",
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A" }}>{item.nama}</div>
                        <div style={{ fontSize: "11px", color: "#64748B" }}>
                          {formatRupiah(item.hargaPerHari)}/hari · <span style={{ color: "#16A34A" }}>Tersedia {item.stokTersedia} unit</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        className="tx-btn-secondary"
                        style={{ padding: "4px 10px", fontSize: "11.5px" }}
                        onClick={() => handleAddToCart(item)}
                      >
                        + Tambah
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Kolom Kanan: Keranjang, Jaminan Fisik, & Pembayaran Lunas Kasir */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {/* Box Keranjang Sewa */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "14px", flex: 1, display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "#0F172A", textTransform: "uppercase", letterSpacing: "0.04em", display: "block", marginBottom: "8px" }}>
                  Keranjang Sewa ({cartItems.length} Item)
                </span>

                {cartItems.length === 0 ? (
                  <div style={{ padding: "30px 0", textAlign: "center", color: "#94A3B8", fontSize: "13px" }}>
                    Keranjang masih kosong. Pilih barang di katalog sebelah kiri.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "6px", maxHeight: "200px", overflowY: "auto", flex: 1 }}>
                    {cartItems.map((it) => (
                      <div
                        key={it.id}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "8px 10px",
                          border: "1px solid #E2E8F0",
                          borderRadius: "6px",
                          background: "#FFFFFF",
                        }}
                      >
                        <div style={{ maxWidth: "200px" }}>
                          <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#0F172A" }}>{it.nama}</div>
                          <div style={{ fontSize: "11px", color: "#64748B" }}>
                            {formatRupiah(it.hargaPerHari)}/hari × {it.jumlah} unit × {durasiHari} hari
                          </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0F172A" }}>
                            {formatRupiah(it.subtotal)}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                            <button
                              type="button"
                              className="tx-btn-secondary"
                              style={{ padding: "2px 6px", fontSize: "12px", height: "24px" }}
                              onClick={() => handleUpdateQty(it.id, -1)}
                            >
                              -
                            </button>
                            <span style={{ fontSize: "12px", fontWeight: 600, minWidth: "16px", textAlign: "center" }}>
                              {it.jumlah}
                            </span>
                            <button
                              type="button"
                              className="tx-btn-secondary"
                              style={{ padding: "2px 6px", fontSize: "12px", height: "24px" }}
                              onClick={() => handleUpdateQty(it.id, 1)}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Total Ringkasan Biaya */}
                <div
                  style={{
                    background: "#F8FAFC",
                    border: "1px solid #E2E8F0",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    marginTop: "12px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <span style={{ fontSize: "11.5px", color: "#64748B" }}>Durasi Sewa: {durasiHari} Hari</span>
                    <div style={{ fontSize: "14px", fontWeight: 700, color: "#0F172A" }}>Total Biaya Sewa (Lunas)</div>
                  </div>
                  <div style={{ fontSize: "18px", fontWeight: 800, color: "#0284C7" }}>
                    {formatRupiah(totalTagihan)}
                  </div>
                </div>
              </div>

              {/* Box Jaminan Fisik Wajib (§F.1.8) */}
              <div style={{ background: "#FEF9C3", border: "1px solid #FEF08A", borderRadius: "8px", padding: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#854D0E", marginBottom: "4px" }}>
                  JAMINAN FISIK DISERAHKAN (§F.1.8) <span style={{ color: "#DC2626" }}>*</span>
                </label>
                <p style={{ margin: "0 0 6px 0", fontSize: "11px", color: "#713F12" }}>
                  Ditulis manual jenis identitas fisik tanpa nomor identitas (misal: <em>KTP Asli Rizky Ananda</em> atau <em>SIM A Dewi Lestari</em>).
                </p>
                <input
                  type="text"
                  className="tx-search-input"
                  style={{ paddingLeft: "10px", background: "#FFFFFF" }}
                  placeholder="Contoh: KTP Asli atas nama penyewa"
                  value={jaminanFisik}
                  onChange={(e) => setJaminanFisik(e.target.value)}
                  required
                />
              </div>

              {/* Box Metode Pembayaran Kasir */}
              <div style={{ background: "#FFFFFF", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "14px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: 700, color: "#0F172A", marginBottom: "6px" }}>
                  METODE PEMBAYARAN KASIR (LUNAS 100%)
                </label>
                <div style={{ display: "flex", gap: "8px" }}>
                  {(["tunai", "qris", "transfer"] as const).map((m) => (
                    <label
                      key={m}
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "8px 10px",
                        border: `1px solid ${metodePembayaran === m ? "#0284C7" : "#E2E8F0"}`,
                        borderRadius: "6px",
                        background: metodePembayaran === m ? "#F0F9FF" : "#FFFFFF",
                        cursor: "pointer",
                        fontSize: "12.5px",
                        fontWeight: 600,
                        textTransform: "capitalize",
                      }}
                    >
                      <input
                        type="radio"
                        name="direct_method"
                        checked={metodePembayaran === m}
                        onChange={() => setMetodePembayaran(m)}
                      />
                      {m}
                    </label>
                  ))}
                </div>
              </div>

              {errorMsg && (
                <div style={{ color: "#DC2626", fontSize: "12px", background: "#FEF2F2", padding: "8px 12px", borderRadius: "6px" }}>
                  {errorMsg}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="tx-modal-footer">
            <button type="button" className="tx-btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="tx-btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Simpan Transaksi &amp; Serahkan Barang
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
