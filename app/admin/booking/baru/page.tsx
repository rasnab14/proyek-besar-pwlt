// app/admin/booking/baru/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import "@/components/booking/booking.css";
import {
  BookingRecord,
  BookingItem,
  CatalogItem,
  DPMethod,
  CATALOG_ITEMS,
} from "@/components/booking";
import { formatRupiah, formatTanggal } from "@/lib/format";

export default function AdminBookingBaruPage() {
  const router = useRouter();

  // Form States
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [noIdentitas, setNoIdentitas] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");

  const [tanggalPengambilan, setTanggalPengambilan] = useState("2026-11-28");
  const [jamPengambilan, setJamPengambilan] = useState("09:00 WIB");
  const [durasiHari, setDurasiHari] = useState(2);
  const [tanggalPengembalian, setTanggalPengembalian] = useState("2026-11-30");

  const [activeCatalogTab, setActiveCatalogTab] = useState<"satuan" | "paket">("satuan");
  const [cartItems, setCartItems] = useState<BookingItem[]>([
    {
      id: "cat-1",
      nama: "Tenda Kapasitas 4 Orang",
      tipe: "satuan",
      kategori: "Tenda",
      jumlah: 1,
      hargaPerHari: 40000,
      subtotal: 80000,
    },
  ]);

  const [dpMetode, setDpMetode] = useState<DPMethod>("qris");
  const [isSuccess, setIsSuccess] = useState(false);
  const [createdBooking, setCreatedBooking] = useState<BookingRecord | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Recalculate return date
  React.useEffect(() => {
    if (tanggalPengambilan && durasiHari > 0) {
      const parts = tanggalPengambilan.split("-").map(Number);
      if (parts.length === 3) {
        const pickup = new Date(parts[0], parts[1] - 1, parts[2]);
        pickup.setDate(pickup.getDate() + durasiHari);
        const y = pickup.getFullYear();
        const m = String(pickup.getMonth() + 1).padStart(2, "0");
        const d = String(pickup.getDate()).padStart(2, "0");
        setTanggalPengembalian(`${y}-${m}-${d}`);
      }
    }
  }, [tanggalPengambilan, durasiHari]);

  // Update subtotals
  React.useEffect(() => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        subtotal: item.hargaPerHari * item.jumlah * durasiHari,
      }))
    );
  }, [durasiHari]);

  const handleAddToCart = (catItem: CatalogItem) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === catItem.id);
      if (existing) {
        return prev.map((item) =>
          item.id === catItem.id
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
          id: catItem.id,
          nama: catItem.nama,
          tipe: catItem.tipe,
          kategori: catItem.kategori,
          jumlah: 1,
          hargaPerHari: catItem.hargaPerHari,
          subtotal: catItem.hargaPerHari * 1 * durasiHari,
          deskripsi: catItem.deskripsi,
          itemsPaket: catItem.itemsPaket,
        },
      ];
    });
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.jumlah + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              jumlah: newQty,
              subtotal: item.hargaPerHari * newQty * durasiHari,
            };
          }
          return item;
        })
        .filter(Boolean) as BookingItem[]
    );
  };

  const totalBiaya = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);
  const pickupDateObj = new Date(tanggalPengambilan);
  const now = new Date("2026-11-27");
  const diffDays = Math.ceil((pickupDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isH1OrLess = diffDays <= 1;

  const dpPersen = isH1OrLess ? 0 : 25;
  const dpNominal = isH1OrLess ? 0 : Math.round(totalBiaya * 0.25);
  const sisaPelunasan = totalBiaya - dpNominal;

  const validateForm = () => {
    const errs: { [key: string]: string } = {};
    if (!nama.trim()) errs.nama = "Nama pelanggan wajib diisi";
    if (!telepon.trim()) errs.telepon = "Nomor WhatsApp / telepon wajib diisi";
    if (!tanggalPengambilan) errs.tanggalPengambilan = "Tanggal pengambilan wajib diisi";
    if (durasiHari < 1) errs.durasiHari = "Durasi minimal 1 hari";
    if (cartItems.length === 0) errs.cart = "Pilih minimal 1 barang atau paket sewa";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (targetStatus: "draft" | "dikonfirmasi") => {
    if (!validateForm()) return;

    const newBooking: BookingRecord = {
      id: `b-${Date.now()}`,
      kode: `BK-02${Math.floor(Math.random() * 90 + 10)}`,
      pelanggan: { nama, telepon, noIdentitas, alamat },
      items: cartItems,
      tanggalPengambilan,
      jamPengambilan,
      durasiHari,
      tanggalPengembalian,
      jamPengembalian: "20:00 WIB",
      totalBiaya,
      dpPersen,
      dpNominal,
      dpStatus: targetStatus === "dikonfirmasi" ? (isH1OrLess ? "tidak_perlu" : "lunas") : "belum",
      dpMetode: targetStatus === "dikonfirmasi" && !isH1OrLess ? dpMetode : undefined,
      sisaPelunasan,
      status: targetStatus,
      catatan,
      dibuatOleh: "Staf Admin",
      waktuDibuat: "27 Nov 2026, 09:30 WIB",
      riwayat: [
        {
          waktu: "27 Nov 2026, 09:30 WIB",
          user: "Staf Admin",
          aksi: targetStatus === "dikonfirmasi" ? "Booking Dikonfirmasi" : "Draft Disimpan",
          catatan: "Dibuat dari Form Booking Baru.",
        },
      ],
      isTodayPickup: tanggalPengambilan === "2026-11-27",
    };

    setCreatedBooking(newBooking);
    setIsSuccess(true);
  };

  const filteredCatalog = CATALOG_ITEMS.filter((item) => item.tipe === activeCatalogTab);

  return (
    <div className="main">
      <div className="booking-page-container">
        {/* Header */}
        <section className="booking-hero">
          <div className="booking-hero-left">
            <span className="booking-breadcrumb">ADMIN · KASIR BOOKING</span>
            <h1 className="booking-title">Booking Baru</h1>
            <p className="booking-desc">
              Form pencatatan reservasi sewa dan pembayaran DP pelanggan hasil kesepakatan WhatsApp / toko.
            </p>
          </div>
          <div className="booking-hero-actions">
            <Link
              href="/admin/booking"
              className="btn sm"
              style={{
                background: "rgba(255, 255, 255, 0.12)",
                color: "#ffffff",
                border: "1px solid rgba(255, 255, 255, 0.22)",
              }}
            >
              ← Kembali ke Menu Booking
            </Link>
          </div>
        </section>

        {/* Success Struk Screen */}
        {isSuccess && createdBooking ? (
          <div className="card" style={{ maxWidth: "640px", margin: "0 auto", width: "100%" }}>
            <div className="ch" style={{ background: "var(--st-ok-bg)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "var(--st-ok)", fontSize: "20px" }}>✓</span>
                <h2 className="ct" style={{ color: "var(--st-ok-t)" }}>
                  Booking Berhasil Dicatat ({createdBooking.kode})
                </h2>
              </div>
            </div>
            <div className="pad" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div className="detail-info-grid">
                <div className="detail-info-item">
                  <span className="dii-label">Pelanggan</span>
                  <span className="dii-val">{createdBooking.pelanggan.nama}</span>
                </div>
                <div className="detail-info-item">
                  <span className="dii-label">Pengambilan</span>
                  <span className="dii-val">{formatTanggal(createdBooking.tanggalPengambilan)}</span>
                </div>
                <div className="detail-info-item">
                  <span className="dii-label">Total Sewa</span>
                  <span className="dii-val">{formatRupiah(createdBooking.totalBiaya)}</span>
                </div>
                <div className="detail-info-item">
                  <span className="dii-label">DP ({createdBooking.dpPersen}%)</span>
                  <span className="dii-val" style={{ color: "var(--acc-t)" }}>
                    {formatRupiah(createdBooking.dpNominal)}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "8px" }}>
                <button
                  type="button"
                  className="btn sm"
                  onClick={() => {
                    setIsSuccess(false);
                    setCreatedBooking(null);
                    setNama("");
                    setTelepon("");
                  }}
                >
                  + Catat Booking Lain
                </button>
                <Link href="/admin/booking" className="btn pri sm">
                  Lihat di Tabel Booking →
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Form Content */
          <div className="card">
            <div className="ch">
              <h2 className="ct">Form Reservasi &amp; Kasir Booking</h2>
              <span className="b in">Mode: Booking</span>
            </div>
            <div className="pad" style={{ display: "flex", flexDirection: "column", gap: "22px" }}>
              {/* Section 1: Customer */}
              <div>
                <div className="detail-section-title">1. Data Pelanggan</div>
                <div className="form-group-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Nama Pelanggan <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nama lengkap pemesan"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                    />
                    {errors.nama && (
                      <span style={{ fontSize: "11px", color: "var(--st-er-t)" }}>{errors.nama}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Nomor WhatsApp / Telepon <span className="req">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="08xxxxxxxxxx"
                      value={telepon}
                      onChange={(e) => setTelepon(e.target.value)}
                    />
                    {errors.telepon && (
                      <span style={{ fontSize: "11px", color: "var(--st-er-t)" }}>{errors.telepon}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor KTP / SIM</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nomor identitas (opsional)"
                      value={noIdentitas}
                      onChange={(e) => setNoIdentitas(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Alamat / Domisili</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Alamat pelanggan"
                      value={alamat}
                      onChange={(e) => setAlamat(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Schedule */}
              <div>
                <div className="detail-section-title">2. Jadwal &amp; Durasi Sewa</div>
                <div className="form-group-grid">
                  <div className="form-group">
                    <label className="form-label">
                      Tanggal Pengambilan <span className="req">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-input"
                      value={tanggalPengambilan}
                      onChange={(e) => setTanggalPengambilan(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jam Pengambilan</label>
                    <select
                      className="booking-select"
                      value={jamPengambilan}
                      onChange={(e) => setJamPengambilan(e.target.value)}
                    >
                      <option value="08:00 WIB">08:00 WIB</option>
                      <option value="09:00 WIB">09:00 WIB</option>
                      <option value="10:00 WIB">10:00 WIB</option>
                      <option value="11:30 WIB">11:30 WIB</option>
                      <option value="14:00 WIB">14:00 WIB</option>
                      <option value="16:00 WIB">16:00 WIB</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">
                      Durasi Sewa (Hari) <span className="req">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={14}
                      className="form-input"
                      value={durasiHari}
                      onChange={(e) => setDurasiHari(Math.max(1, parseInt(e.target.value) || 1))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Pengembalian (Otomatis)</label>
                    <input
                      type="date"
                      className="form-input"
                      value={tanggalPengembalian}
                      readOnly
                      style={{ background: "var(--n100)" }}
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Catalog & Cart (§E.32) */}
              <div>
                <div className="detail-section-title">3. Katalog Barang &amp; Paket Sewa (§E.32)</div>
                <div className="catalog-picker-card">
                  <div className="tabs" style={{ marginBottom: "8px" }}>
                    <button
                      type="button"
                      className={`tab ${activeCatalogTab === "satuan" ? "on" : ""}`}
                      onClick={() => setActiveCatalogTab("satuan")}
                    >
                      ⛺ Barang Satuan ({CATALOG_ITEMS.filter((c) => c.tipe === "satuan").length})
                    </button>
                    <button
                      type="button"
                      className={`tab ${activeCatalogTab === "paket" ? "on" : ""}`}
                      onClick={() => setActiveCatalogTab("paket")}
                    >
                      📦 Paket Penyewaan ({CATALOG_ITEMS.filter((c) => c.tipe === "paket").length})
                    </button>
                  </div>
                  <div className="catalog-list">
                    {filteredCatalog.map((item) => (
                      <div key={item.id} className="catalog-item-box">
                        <div>
                          <div className="cib-title">{item.nama}</div>
                          <div className="cib-price">{formatRupiah(item.hargaPerHari)} / hari</div>
                          {item.deskripsi && (
                            <div style={{ fontSize: "11px", color: "var(--n600)", marginTop: "2px" }}>
                              {item.deskripsi}
                            </div>
                          )}
                        </div>
                        <button
                          type="button"
                          className="btn sm pri"
                          style={{ marginTop: "6px" }}
                          onClick={() => handleAddToCart(item)}
                        >
                          + Tambah
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Cart Table */}
                <div style={{ marginTop: "14px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--k)" }}>
                    Keranjang Barang ({cartItems.length} item)
                  </span>
                  <table className="cart-items-table" style={{ marginTop: "8px" }}>
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th style={{ width: "120px", textAlign: "center" }}>Jumlah</th>
                        <th style={{ width: "110px", textAlign: "right" }}>Harga/Hari</th>
                        <th style={{ width: "130px", textAlign: "right" }}>Subtotal ({durasiHari} Hari)</th>
                        <th style={{ width: "50px", textAlign: "center" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <span style={{ fontWeight: 600, color: "var(--k)" }}>
                              {item.tipe === "paket" ? "📦 " : "⛺ "}
                              {item.nama}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <div className="qty-stepper">
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleUpdateQty(item.id, -1)}
                              >
                                −
                              </button>
                              <span className="qty-val">{item.jumlah}</span>
                              <button
                                type="button"
                                className="qty-btn"
                                onClick={() => handleUpdateQty(item.id, 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td style={{ textAlign: "right", color: "var(--n600)" }}>
                            {formatRupiah(item.hargaPerHari)}
                          </td>
                          <td style={{ textAlign: "right", fontWeight: 700, color: "var(--k)" }}>
                            {formatRupiah(item.subtotal)}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              type="button"
                              onClick={() => handleUpdateQty(item.id, -item.jumlah)}
                              style={{
                                background: "none",
                                border: "none",
                                color: "var(--st-er)",
                                cursor: "pointer",
                              }}
                            >
                              ✕
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Section 4: Price & DP */}
              <div>
                <div className="detail-section-title">4. Perhitungan DP &amp; Pelunasan</div>
                <div className="detail-financial-summary">
                  <div className="dfs-row">
                    <span>Total Biaya Sewa ({durasiHari} Hari):</span>
                    <span style={{ fontWeight: 700 }}>{formatRupiah(totalBiaya)}</span>
                  </div>
                  <div className="dfs-row">
                    <span>Kebutuhan Uang Muka (DP {dpPersen}%):</span>
                    <span style={{ fontWeight: 700, color: "var(--acc-t)" }}>
                      {formatRupiah(dpNominal)}
                    </span>
                  </div>
                  <div className="dfs-row total">
                    <span>Sisa Pelunasan:</span>
                    <span>{formatRupiah(sisaPelunasan)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                <Link href="/admin/booking" className="btn sm">
                  Batal
                </Link>
                <button
                  type="button"
                  className="btn sm"
                  onClick={() => handleSubmit("draft")}
                >
                  Simpan sebagai Draft
                </button>
                <button
                  type="button"
                  className="btn pri sm"
                  onClick={() => handleSubmit("dikonfirmasi")}
                >
                  Konfirmasi Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
