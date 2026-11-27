// components/booking/CreateBookingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import { BookingRecord, BookingItem, CatalogItem, DPMethod } from "./types";
import { CATALOG_ITEMS } from "./mockData";
import { formatRupiah, formatTanggal } from "@/lib/format";

interface CreateBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitBooking: (booking: BookingRecord) => void;
  editingBooking?: BookingRecord | null;
}

export function CreateBookingModal({
  isOpen,
  onClose,
  onSubmitBooking,
  editingBooking,
}: CreateBookingModalProps) {
  // Form States
  const [nama, setNama] = useState("");
  const [telepon, setTelepon] = useState("");
  const [alamat, setAlamat] = useState("");
  const [catatan, setCatatan] = useState("");

  const [tanggalPengambilan, setTanggalPengambilan] = useState("2026-11-28");
  const [jamPengambilan, setJamPengambilan] = useState("09:00 WIB");
  const [durasiHari, setDurasiHari] = useState(2);
  const [tanggalPengembalian, setTanggalPengembalian] = useState("2026-11-30");
  const [jamPengembalian, setJamPengembalian] = useState("20:00 WIB");

  // Catalog Tab: "satuan" or "paket"
  const [activeCatalogTab, setActiveCatalogTab] = useState<"satuan" | "paket">("satuan");

  // Selected Cart Items
  const [cartItems, setCartItems] = useState<BookingItem[]>([]);

  // Payment States
  const [dpMetode, setDpMetode] = useState<DPMethod>("qris");

  // Validation Error States
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Reset or fill if editing
  useEffect(() => {
    if (editingBooking) {
      setNama(editingBooking.pelanggan.nama);
      setTelepon(editingBooking.pelanggan.telepon);
      setAlamat(editingBooking.pelanggan.alamat || "");
      setCatatan(editingBooking.catatan || "");
      setTanggalPengambilan(editingBooking.tanggalPengambilan);
      setJamPengambilan(editingBooking.jamPengambilan);
      setDurasiHari(editingBooking.durasiHari);
      setTanggalPengembalian(editingBooking.tanggalPengembalian);
      setJamPengembalian(editingBooking.jamPengembalian);
      setCartItems(editingBooking.items);
      setDpMetode(editingBooking.dpMetode || "qris");
    } else {
      // Default empty
      setNama("");
      setTelepon("");
      setAlamat("");
      setCatatan("");
      setTanggalPengambilan("2026-11-28");
      setJamPengambilan("09:00 WIB");
      setDurasiHari(2);
      setTanggalPengembalian("2026-11-30");
      setJamPengembalian("20:00 WIB");
      // Initial sample in cart for ease of use
      setCartItems([
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
      setDpMetode("qris");
    }
    setErrors({});
  }, [editingBooking, isOpen]);

  // Recalculate return date when pickup date or duration changes
  useEffect(() => {
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

  // Update item subtotals when durasiHari changes
  useEffect(() => {
    setCartItems((prev) =>
      prev.map((item) => ({
        ...item,
        subtotal: item.hargaPerHari * item.jumlah * durasiHari,
      }))
    );
  }, [durasiHari]);

  if (!isOpen) return null;

  // Add Item from Catalog to Cart
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

  // Change Quantity
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

  // Calculations
  const totalBiaya = cartItems.reduce((acc, curr) => acc + curr.subtotal, 0);

  // Check H-2 vs H-1 rule for DP
  // Current simulated base date: 2026-11-27
  const pickupDateObj = new Date(tanggalPengambilan);
  const now = new Date("2026-11-27");
  const diffDays = Math.ceil((pickupDateObj.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isH1OrLess = diffDays <= 1;

  const dpPersen = isH1OrLess ? 0 : 25;
  const dpNominal = isH1OrLess ? 0 : Math.round(totalBiaya * 0.25);
  const sisaPelunasan = totalBiaya - dpNominal;

  // Validation
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

  // Submit Handler
  const handleSubmit = (targetStatus: "draft" | "selesai") => {
    if (!validateForm()) return;

    const newBooking: BookingRecord = {
      id: editingBooking?.id || `b-${Date.now()}`,
      kode: editingBooking?.kode || `BK-02${Math.floor(Math.random() * 90 + 10)}`,
      pelanggan: {
        nama,
        telepon,
        alamat,
      },
      items: cartItems,
      tanggalPengambilan,
      jamPengambilan,
      durasiHari,
      tanggalPengembalian,
      jamPengembalian,
      totalBiaya,
      dpPersen,
      dpNominal,
      dpStatus: targetStatus === "selesai" ? (isH1OrLess ? "tidak_perlu" : "lunas") : "belum",
      dpMetode: targetStatus === "selesai" && !isH1OrLess ? dpMetode : undefined,
      sisaPelunasan,
      status: targetStatus,
      catatan,
      dibuatOleh: "Staf Admin",
      waktuDibuat: editingBooking?.waktuDibuat || "27 Nov 2026, 09:30 WIB",
      riwayat: [
        ...(editingBooking?.riwayat || []),
        {
          waktu: "27 Nov 2026, 09:30 WIB",
          user: "Staf Admin",
          aksi: targetStatus === "selesai" ? "Booking Disepakati (Selesai)" : "Draft Disimpan",
          catatan:
            targetStatus === "selesai"
              ? `Booking resmi disepakati (Selesai) dengan DP Rp ${dpNominal.toLocaleString()}`
              : "Draft booking berhasil diperbarui.",
        },
      ],
      isTodayPickup: tanggalPengambilan === "2026-11-27",
    };

    onSubmitBooking(newBooking);
  };

  // Filter Catalog
  const filteredCatalog = CATALOG_ITEMS.filter((item) => item.tipe === activeCatalogTab);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container wide"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-create-title"
      >
        {/* Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <h2 id="modal-create-title" className="modal-title">
              {editingBooking ? `Ubah Booking ${editingBooking.kode}` : "+ Catat Booking Baru"}
            </h2>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Tutup form"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          {/* Section: Customer Info */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              1. Data Pelanggan
            </div>
            <div className="form-group-grid">
              <div className="form-group">
                <label className="form-label">
                  Nama Pelanggan <span className="req">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Dimas Pratama"
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
                  placeholder="Contoh: 0812-3456-7890"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                />
                {errors.telepon && (
                  <span style={{ fontSize: "11px", color: "var(--st-er-t)" }}>{errors.telepon}</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Alamat / Asal Kampus / Domisili (Opsional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Contoh: Pogung Baru, Sleman (opsional)"
                  value={alamat}
                  onChange={(e) => setAlamat(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Section: Schedule */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              2. Jadwal &amp; Durasi Sewa
            </div>
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
                  <option value="19:00 WIB">19:00 WIB</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Durasi Sewa (Hari) <span className="req">*</span>
                </label>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <input
                    type="number"
                    min={1}
                    max={14}
                    className="form-input"
                    value={durasiHari}
                    onChange={(e) => setDurasiHari(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <span style={{ fontSize: "13px", color: "var(--n600)" }}>Hari</span>
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Tanggal Selesai / Pengembalian</label>
                <input
                  type="date"
                  className="form-input"
                  value={tanggalPengembalian}
                  readOnly
                  style={{ background: "var(--n100)", cursor: "not-allowed" }}
                />
                <span style={{ fontSize: "11px", color: "var(--n600)" }}>
                  Terhitung otomatis: {formatTanggal(tanggalPengembalian)}
                </span>
              </div>
            </div>
          </div>

          {/* Section: Catalog & Cart Selection (§E.32: Dua Tab Satuan & Paket) */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              3. Pilih Barang atau Paket Sewa (§E.32)
            </div>

            <div className="catalog-picker-card">
              {/* Tab Selector */}
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

              {/* Items Grid */}
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
                      {item.itemsPaket && (
                        <div
                          style={{
                            fontSize: "10.5px",
                            color: "var(--n600)",
                            marginTop: "4px",
                            background: "var(--n100)",
                            padding: "3px 6px",
                            borderRadius: "4px",
                          }}
                        >
                          Isi: {item.itemsPaket.join(", ")}
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      className="btn sm pri"
                      style={{ marginTop: "6px" }}
                      onClick={() => handleAddToCart(item)}
                    >
                      + Tambah ke Booking
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Table */}
            <div style={{ marginTop: "14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--k)" }}>
                  Keranjang Barang Booking ({cartItems.length} item)
                </span>
                {errors.cart && (
                  <span style={{ fontSize: "12px", color: "var(--st-er-t)", fontWeight: 600 }}>
                    {errors.cart}
                  </span>
                )}
              </div>

              {cartItems.length === 0 ? (
                <div
                  style={{
                    padding: "20px",
                    background: "var(--n50)",
                    border: "1px dashed var(--line)",
                    borderRadius: "var(--r-md)",
                    textAlign: "center",
                    color: "var(--n600)",
                    fontSize: "13px",
                  }}
                >
                  Keranjang masih kosong. Silakan pilih barang satuan atau paket dari katalog di atas.
                </div>
              ) : (
                <table className="cart-items-table">
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
                              padding: "4px",
                            }}
                            title="Hapus barang"
                          >
                            ✕
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Section: Dynamic Pricing & DP Calculation (§E.8 & §E.9) */}
          <div>
            <div className="detail-section-title">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <line x1="2" y1="10" x2="22" y2="10" />
              </svg>
              4. Perhitungan Biaya &amp; Uang Muka (DP 25%)
            </div>

            {/* Note about H-1 vs H-2 rule */}
            {isH1OrLess ? (
              <div className="note" style={{ marginBottom: "10px" }}>
                <div>
                  <strong>Ketentuan DP H-1:</strong> Booking dilakukan H-1 atau hari-H pengambilan,
                  sehingga pelanggan <strong>tidak diwajibkan membayar DP</strong> sesuai ketentuan perusahaan (§E.9). Pembayaran dilakukan lunas saat pengambilan.
                </div>
              </div>
            ) : (
              <div className="note ok" style={{ marginBottom: "10px" }}>
                <div>
                  <strong>Ketentuan DP H-2+:</strong> Booking minimal H-2 diwajibkan membayar DP sebesar{" "}
                  <strong>25%</strong> dari total sewa (§E.8) untuk mengunci ketersediaan stok barang.
                </div>
              </div>
            )}

            <div className="detail-financial-summary">
              <div className="dfs-row">
                <span>Total Biaya Sewa ({durasiHari} Hari):</span>
                <span style={{ fontWeight: 700, fontSize: "15px" }}>{formatRupiah(totalBiaya)}</span>
              </div>
              <div className="dfs-row">
                <span>Kebutuhan Uang Muka (DP {dpPersen}%):</span>
                <span style={{ fontWeight: 700, color: "var(--acc-t)", fontSize: "15px" }}>
                  {formatRupiah(dpNominal)}
                </span>
              </div>
              {!isH1OrLess && (
                <div className="dfs-row" style={{ alignItems: "center" }}>
                  <span style={{ color: "var(--n600)" }}>Metode Pembayaran DP:</span>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button
                      type="button"
                      className={`btn sm ${dpMetode === "qris" ? "pri" : ""}`}
                      onClick={() => setDpMetode("qris")}
                    >
                      QRIS
                    </button>
                    <button
                      type="button"
                      className={`btn sm ${dpMetode === "transfer" ? "pri" : ""}`}
                      onClick={() => setDpMetode("transfer")}
                    >
                      Transfer Bank
                    </button>
                    <button
                      type="button"
                      className={`btn sm ${dpMetode === "tunai" ? "pri" : ""}`}
                      onClick={() => setDpMetode("tunai")}
                    >
                      Tunai
                    </button>
                  </div>
                </div>
              )}
              <div className="dfs-row total">
                <span>Sisa Pelunasan (Dibayar saat pengambilan):</span>
                <span style={{ color: "var(--k)" }}>{formatRupiah(sisaPelunasan)}</span>
              </div>
            </div>
          </div>

          {/* Section: Notes */}
          <div className="form-group">
            <label className="form-label">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              className="form-textarea"
              placeholder="Catatan permintaan khusus pelanggan, janji waktu, atau detail kesepakatan WhatsApp..."
              value={catatan}
              onChange={(e) => setCatatan(e.target.value)}
            />
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="btn sm" onClick={onClose}>
            Batal
          </button>
          <button
            type="button"
            className="btn sm"
            onClick={() => handleSubmit("draft")}
            title="Simpan sementara data booking sebagai draft"
          >
            Simpan sebagai Draft
          </button>
          <button
            type="button"
            className="btn pri sm"
            onClick={() => handleSubmit("selesai")}
            title="Selesaikan kesepakatan booking dan kunci alokasi stok"
          >
            Selesaikan Booking
          </button>
        </div>
      </div>
    </div>
  );
}
