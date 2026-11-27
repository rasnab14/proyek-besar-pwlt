// app/admin/booking/baru/page.tsx
"use client";

import React, { useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import "@/components/booking/booking.css";
import "@/components/booking/create/booking-create.css";
import {
  CustomerData,
  CatalogProduct,
  CartItem,
  PaymentMethod,
  MOCK_CUSTOMERS,
  MOCK_PRODUCTS,
  BookingInformationCard,
  ProductCatalogCard,
  BookingCartCard,
  BookingPaymentCard,
  BookingSuccessModal,
  getTodayString,
  addDays,
  calculateEndDate,
  calculateHDiffBetween,
} from "@/components/booking/create";
import {
  calculatePeriodBaseStock,
  calculateDynamicCatalogWithCart,
} from "@/components/booking/create/stockService";
import {
  getBookingByIdOrCode,
  saveOrUpdateBooking,
  BookingRecord,
  BookingItem,
} from "@/components/booking";

// Deterministic default dates for safe SSR hydration matching
const DEFAULT_BOOKING_DATE = "2026-11-27";
const DEFAULT_RENTAL_START = "2026-11-30";

function BookingFormInner() {
  const searchParams = useSearchParams();
  const editId = searchParams.get("id") || searchParams.get("edit");

  // ─── Existing Draft Lookup ───
  const [existingDraft, setExistingDraft] = useState<BookingRecord | null>(null);
  const [isDraftLoaded, setIsDraftLoaded] = useState(false);

  // ─── Customer State ───
  const [customers, setCustomers] = useState<CustomerData[]>(MOCK_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerData | null>(MOCK_CUSTOMERS[0]); // Default Maya Sari

  // ─── Date & Duration States (§1, §2, §3, §4 & Reference Screenshot) ───
  const [tanggalBooking, setTanggalBooking] = useState<string>(DEFAULT_BOOKING_DATE);
  const [tanggalMulaiSewa, setTanggalMulaiSewa] = useState<string>(DEFAULT_RENTAL_START);
  const [durasiHari, setDurasiHari] = useState<number>(5);

  // ─── Booking Code ───
  const [createdBookingCode, setCreatedBookingCode] = useState("BK-0451");

  // ─── Products & Cart State ───
  const [cart, setCart] = useState<CartItem[]>([]);

  // ─── Payment States (§4) ───
  const [nominalDpDisepakati, setNominalDpDisepakati] = useState(0);
  const [dpDiterimaSekarang, setDpDiterimaSekarang] = useState(0);
  const [metodePembayaran, setMetodePembayaran] = useState<PaymentMethod>("tunai");

  // ─── Submission & Validation States ───
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isSuccessDraft, setIsSuccessDraft] = useState(false);
  const [toastError, setToastError] = useState<string | null>(null);

  // ─── Load Existing Draft Data on Mount if editId is provided (§1, §2, §4) ───
  useEffect(() => {
    if (editId && !isDraftLoaded) {
      const draft = getBookingByIdOrCode(editId);
      if (draft) {
        setExistingDraft(draft);
        setCreatedBookingCode(draft.kode);

        // 1. Pelanggan
        const matchCust = customers.find(
          (c) => c.nama.toLowerCase() === draft.pelanggan.nama.toLowerCase()
        );
        if (matchCust) {
          setSelectedCustomer(matchCust);
        } else {
          const newCust: CustomerData = {
            id: `cust-${Date.now()}`,
            nama: draft.pelanggan.nama,
            telepon: draft.pelanggan.telepon,
            alamat: draft.pelanggan.alamat,
          };
          setCustomers((prev) => [newCust, ...prev]);
          setSelectedCustomer(newCust);
        }

        // 2. Tanggal & Durasi
        const bDate = draft.tanggalBooking || DEFAULT_BOOKING_DATE;
        const sDate = draft.tanggalMulaiSewa || draft.tanggalPengambilan || DEFAULT_RENTAL_START;
        const dur = draft.durasiHari || 2;
        setTanggalBooking(bDate);
        setTanggalMulaiSewa(sDate);
        setDurasiHari(dur);

        // 3. Cart Items
        const mappedCart: CartItem[] = (draft.items || []).map((it) => {
          const catProd = MOCK_PRODUCTS.find((p) => p.id === it.id);
          return {
            id: it.id,
            kode: catProd ? catProd.kode : it.id.toUpperCase(),
            nama: it.nama,
            tipe: it.tipe,
            kategori: it.kategori,
            hargaPerHari: it.hargaPerHari,
            jumlah: it.jumlah,
            unitTersedia: catProd ? catProd.totalUnit : it.jumlah,
            subtotal: it.subtotal,
            itemsPaket: it.itemsPaket,
          };
        });
        setCart(mappedCart);

        // 4. Pembayaran DP
        setNominalDpDisepakati(draft.dpNominal || 0);
        setDpDiterimaSekarang(draft.dpStatus === "lunas" ? draft.dpNominal : 0);
        if (draft.dpMetode) {
          setMetodePembayaran(draft.dpMetode);
        }

        setIsDraftLoaded(true);
      }
    } else if (!editId) {
      // Sync client-side actual current date on mount for new booking
      const today = getTodayString();
      if (today && today !== DEFAULT_BOOKING_DATE) {
        setTanggalBooking(today);
        setTanggalMulaiSewa(addDays(today, 3));
      }
    }
  }, [editId, isDraftLoaded, customers]);

  // ─── Derived Calculations ───
  const hDiff = useMemo(() => {
    return calculateHDiffBetween(tanggalBooking, tanggalMulaiSewa);
  }, [tanggalBooking, tanggalMulaiSewa]);

  const dateError = useMemo(() => {
    if (tanggalBooking && tanggalMulaiSewa && tanggalMulaiSewa < tanggalBooking) {
      return "Tanggal Mulai Sewa tidak boleh lebih awal daripada Tanggal Booking.";
    }
    return null;
  }, [tanggalBooking, tanggalMulaiSewa]);

  const tanggalSelesaiSewa = useMemo(() => {
    return calculateEndDate(tanggalMulaiSewa, durasiHari);
  }, [tanggalMulaiSewa, durasiHari]);

  // Base stock ketersediaan per rentang tanggal pemesanan
  const baseProducts = useMemo(() => {
    return calculatePeriodBaseStock(MOCK_PRODUCTS, tanggalMulaiSewa, tanggalSelesaiSewa);
  }, [tanggalMulaiSewa, tanggalSelesaiSewa]);

  // Ketersediaan dinamis real-time (base stock dikurangi item & paket di dalam keranjang)
  const { dynamicProducts, remainingSingleStockMap, remainingPackageStockMap } = useMemo(() => {
    return calculateDynamicCatalogWithCart(baseProducts, cart);
  }, [baseProducts, cart]);

  // Peta gabungan sisa stok untuk validasi stepper dan pencegahan over-allocation
  const remainingStockMap = useMemo(() => {
    return { ...remainingSingleStockMap, ...remainingPackageStockMap };
  }, [remainingSingleStockMap, remainingPackageStockMap]);

  // Cart Total Calculation (Single source of truth for payment)
  const totalBiaya = useMemo(() => {
    return cart.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [cart]);

  // DP Wajib rule (§4): H-2 atau lebih awal (hDiff >= 2) => 25% totalBiaya, H-1 / Hari-H (hDiff <= 1) => 0
  const dpWajib = useMemo(() => {
    if (hDiff >= 2) {
      return Math.round(totalBiaya * 0.25);
    }
    return 0;
  }, [hDiff, totalBiaya]);

  // Reaktif: perbarui nominalDpDisepakati saat dpWajib berubah (jika bukan saat edit draft awal)
  useEffect(() => {
    if (!existingDraft) {
      setNominalDpDisepakati(dpWajib);
    }
  }, [dpWajib, existingDraft]);

  // ─── Handle Duration Change & Update Cart Subtotals (§1 & §2) ───
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

  // ─── Cart Handlers (Real-time Inventory Synchronization) ───
  const handleAddToCart = (product: CatalogProduct) => {
    const currentRemaining = remainingStockMap[product.id] ?? product.unitTersedia;
    if (currentRemaining <= 0) {
      showToast(`Stok unit ${product.nama} sudah maksimal atau habis untuk periode ini.`);
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
        showToast("Stok unit sudah mencapai batas maksimal yang tersedia.");
        return;
      }
    }

    setCart((prev) =>
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
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const showToast = (msg: string) => {
    setToastError(msg);
    setTimeout(() => setToastError(null), 3500);
  };

  // ─── Helper: Build Booking Record Structure ───
  const buildBookingRecord = (status: "draft" | "selesai"): BookingRecord => {
    const bookingId = existingDraft ? existingDraft.id : `b-${Date.now()}`;
    const code = createdBookingCode;

    const bookingItems: BookingItem[] = cart.map((c) => ({
      id: c.id,
      nama: c.nama,
      tipe: c.tipe,
      kategori: c.kategori,
      jumlah: c.jumlah,
      hargaPerHari: c.hargaPerHari,
      subtotal: c.subtotal,
      itemsPaket: c.itemsPaket,
    }));

    const isLunasDP = dpDiterimaSekarang >= nominalDpDisepakati && nominalDpDisepakati > 0;
    const isNoDpNeeded = hDiff <= 1;

    let dpStatusValue: "lunas" | "belum" | "tidak_perlu" = "belum";
    if (isNoDpNeeded) {
      dpStatusValue = "tidak_perlu";
    } else if (isLunasDP) {
      dpStatusValue = "lunas";
    }

    const nowStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const auditEntry = {
      waktu: `${nowStr}, ${new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`,
      user: "Staf Admin",
      aksi: status === "draft" ? (existingDraft ? "Draft diperbarui" : "Draft dibuat") : "Booking Selesai",
      catatan:
        status === "draft"
          ? "Data booking draft disimpan melalui form Catat Booking."
          : "Pemesanan telah disepakati dan dicatat resmi.",
    };

    const existingLogs = existingDraft?.riwayat || [];

    return {
      id: bookingId,
      kode: code,
      pelanggan: {
        nama: selectedCustomer?.nama || "Pelanggan Belum Dipilih",
        telepon: selectedCustomer?.telepon || "-",
        alamat: selectedCustomer?.alamat,
      },
      items: bookingItems,
      tanggalBooking,
      tanggalMulaiSewa,
      tanggalPengambilan: tanggalMulaiSewa,
      jamPengambilan: existingDraft?.jamPengambilan || "10:00 WIB",
      durasiHari,
      tanggalSelesaiSewa,
      tanggalPengembalian: tanggalSelesaiSewa,
      jamPengembalian: existingDraft?.jamPengembalian || "19:00 WIB",
      totalBiaya,
      dpPersen: totalBiaya > 0 ? Math.round((nominalDpDisepakati / totalBiaya) * 100) : 0,
      dpNominal: nominalDpDisepakati,
      dpStatus: dpStatusValue,
      dpMetode: metodePembayaran,
      sisaPelunasan: Math.max(0, totalBiaya - dpDiterimaSekarang),
      status,
      catatan: existingDraft?.catatan || "",
      dibuatOleh: existingDraft?.dibuatOleh || "Staf Admin",
      waktuDibuat: existingDraft?.waktuDibuat || `${nowStr}, 09:00 WIB`,
      riwayat: [auditEntry, ...existingLogs],
    };
  };

  // ─── Simpan Sebagai Draft (§5) ───
  const handleSaveDraft = () => {
    if (!selectedCustomer) {
      showToast("Pilih data pelanggan terlebih dahulu untuk menyimpan draft!");
      return;
    }

    const draftRecord = buildBookingRecord("draft");
    saveOrUpdateBooking(draftRecord);

    setIsSuccessDraft(true);
    setIsSuccessOpen(true);
  };

  // ─── Selesaikan Booking (§6 & §8) ───
  const handleCreateBooking = () => {
    if (dateError) {
      showToast(dateError);
      return;
    }
    if (!selectedCustomer) {
      showToast("Pilih data pelanggan terlebih dahulu!");
      return;
    }
    if (cart.length === 0) {
      showToast("Keranjang booking masih kosong. Tambahkan minimal 1 barang atau paket.");
      return;
    }
    if (durasiHari < 1) {
      showToast("Durasi sewa minimal 1 hari.");
      return;
    }

    const finishedRecord = buildBookingRecord("selesai");
    saveOrUpdateBooking(finishedRecord);

    setIsSuccessDraft(false);
    setIsSuccessOpen(true);
  };

  const handleResetForm = () => {
    setIsSuccessOpen(false);
    setCart([]);
    setNominalDpDisepakati(0);
    setDpDiterimaSekarang(0);
    setExistingDraft(null);
    setCreatedBookingCode(`BK-0${Math.floor(Math.random() * 800 + 100)}`);
  };

  return (
    <div className="main">
      {/* Top Bar with Back Button */}
      <div className="bc-page-header">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Link href="/admin/booking" className="bc-back-btn">
            ← Kembali ke Booking
          </Link>
          <span className="hero-badge">
            {existingDraft ? `ADMIN · LANJUTKAN DRAFT: ${createdBookingCode}` : "ADMIN · CATAT BOOKING"}
          </span>
        </div>
      </div>

      {/* Main 2-Column Grid matching Reference Screenshot */}
      <div className="bc-container">
        {/* Left Column (65%) */}
        <div className="bc-left-col">
          {/* Card 1: Informasi booking */}
          <BookingInformationCard
            bookingCode={createdBookingCode}
            customers={customers}
            selectedCustomer={selectedCustomer}
            onSelectCustomer={(c) => setSelectedCustomer(c)}
            onAddCustomer={(newCust) => setCustomers((prev) => [newCust, ...prev])}
            tanggalBooking={tanggalBooking}
            onTanggalBookingChange={setTanggalBooking}
            tanggalMulaiSewa={tanggalMulaiSewa}
            onTanggalMulaiSewaChange={setTanggalMulaiSewa}
            durasiHari={durasiHari}
            onDurasiHariChange={handleDurasiChange}
            tanggalSelesaiSewa={tanggalSelesaiSewa}
            hDiff={hDiff}
            dateError={dateError}
          />

          {/* Card 2: Catalog (Single Items & Packages) */}
          <ProductCatalogCard
            products={dynamicProducts}
            onAddToCart={handleAddToCart}
          />
        </div>

        {/* Right Column (35%, Sticky Sidebar Container) */}
        <div className="bc-right-col">
          <div className="bc-sticky-panel">
            {/* Card 1: Keranjang booking */}
            <BookingCartCard
              cart={cart}
              durasiHari={durasiHari}
              remainingStockMap={remainingStockMap}
              onUpdateQty={handleUpdateQty}
              onRemoveItem={handleRemoveItem}
            />

            {/* Card 2: Pembayaran (§4 & §5) */}
            <BookingPaymentCard
              totalBiaya={totalBiaya}
              dpWajib={dpWajib}
              hDiff={hDiff}
              nominalDpDisepakati={nominalDpDisepakati}
              onNominalDpDisepakatiChange={setNominalDpDisepakati}
              dpDiterimaSekarang={dpDiterimaSekarang}
              onDpDiterimaSekarangChange={setDpDiterimaSekarang}
              metodePembayaran={metodePembayaran}
              onMetodePembayaranChange={setMetodePembayaran}
              onSubmitBooking={handleCreateBooking}
              onSaveDraft={handleSaveDraft}
              isDraftEdit={Boolean(existingDraft)}
            />
          </div>
        </div>
      </div>

      {/* Success Modal Confirmation */}
      <BookingSuccessModal
        isOpen={isSuccessOpen}
        bookingCode={createdBookingCode}
        customer={selectedCustomer}
        cart={cart}
        tanggalBooking={tanggalBooking}
        tanggalMulaiSewa={tanggalMulaiSewa}
        durasiHari={durasiHari}
        tanggalSelesaiSewa={tanggalSelesaiSewa}
        totalBiaya={totalBiaya}
        dpNominal={dpDiterimaSekarang}
        sisaPembayaran={Math.max(0, totalBiaya - dpDiterimaSekarang)}
        isDraft={isSuccessDraft}
        onReset={handleResetForm}
      />

      {/* Error / Alert Toast */}
      {toastError && (
        <div className="booking-toast warning">
          <span>⚠️ </span>
          {toastError}
        </div>
      )}
    </div>
  );
}

export default function BookingCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="main" style={{ padding: "40px 24px", color: "#6B7280" }}>
          Memuat formulir booking...
        </div>
      }
    >
      <BookingFormInner />
    </Suspense>
  );
}
