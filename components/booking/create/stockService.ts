// components/booking/create/stockService.ts
/**
 * ─────────────────────────────────────────────────────────────────────────────
 * LAYANAN MANAJEMEN KETERSEDIAAN STOK (FRONT-END SIMULATION & BACKEND CONTRACT)
 * ─────────────────────────────────────────────────────────────────────────────
 * Modul ini menyediakan abstraksi perhitungan ketersediaan stok sewa secara real-time.
 * 
 * ATURAN BISNIS & PERSIAPAN INTEGRASI BACKEND:
 * 1. Single Source of Truth: Ketersediaan dihitung dari (Total Stok Fisik - Unit Non-Aktif
 *    [rusak/cuci/rawat] - Alokasi Booking Periode Terkait - Alokasi Keranjang Aktif).
 * 2. Paket Penyewaan (Shared Inventory): Paket tidak memiliki unit fisik tersendiri,
 *    melainkan bergantung langsung pada ketersediaan barang-barang satuan penyusunnya.
 *    Penambahan paket akan mengalokasikan komponen barang penyusun, dan sebaliknya.
 * 3. Ketersediaan Berbasis Rentang Tanggal: Ketersediaan berubah secara responsif saat
 *    Tanggal Mulai Sewa atau Durasi Sewa diubah, memperhitungkan tumpang tindih sewa lain.
 * 4. Kontrak Backend: Saat backend dihubungkan, fungsi `calculatePeriodBaseStock` akan
 *    digantikan dengan pemanggilan Supabase RPC (e.g. `check_product_availability(start_date, end_date)`).
 */

import { CatalogProduct, CartItem } from "./types";
import { getStoredBookings } from "@/components/booking/bookingStore";
import { getStoredTransaksiSewa } from "@/components/transaksi/sewaStore";

export interface PackageComponentRequirement {
  productId: string;
  qty: number;
}

// Komposisi baku barang satuan penyusun untuk setiap Paket Penyewaan
export const PACKAGE_COMPONENTS_MAP: Record<string, PackageComponentRequirement[]> = {
  // Paket Bromo 4 Orang: 1x Tenda 4P, 4x Matras Spons, 1x Kompor Mini, 1x Cooking Set, 1x Lampu Tenda
  "pkg-brm4": [
    { productId: "p-t4p", qty: 1 },
    { productId: "p-mat", qty: 4 },
    { productId: "p-kmp", qty: 1 },
    { productId: "p-cst", qty: 1 },
    { productId: "p-lmp", qty: 1 },
  ],
  // Paket Rinjani Adventure 4P: 1x Tenda Dome 2P, 4x Sleeping Bag Bulu Angsa, 4x Matras Spons, 1x Kompor Mini, 1x Headlamp
  "pkg-rnj4": [
    { productId: "p-dm2", qty: 1 },
    { productId: "p-sba", qty: 4 },
    { productId: "p-mat", qty: 4 },
    { productId: "p-kmp", qty: 1 },
    { productId: "p-hlp", qty: 1 },
  ],
};

/**
 * Mengecek apakah dua rentang tanggal saling bertumpang tindih (overlap).
 */
function isDateOverlap(
  startA: string,
  endA: string,
  startB: string,
  endB: string
): boolean {
  return startA <= endB && endA >= startB;
}

/**
 * Menghitung base stock (stok dasar tersedia di toko pada rentang tanggal sewa)
 * sebelum dikurangi oleh item yang sedang dimasukkan ke dalam keranjang saat ini.
 * 
 * Aturan Bisnis & Rekonsiliasi:
 * 1. Menggunakan data dinamis dari storage (getStoredBookings), bukan mock data statis.
 * 2. Booking Dihapus: Otomatis tidak ada dalam storage sehingga alokasi stok kembali 100%.
 * 3. Booking Dibatalkan: Status 'dibatalkan' tidak mengunci stok (stok dilepaskan).
 * 4. Booking Diubah: Mendukung parameter excludeBookingId agar stok lama booking yang sedang
 *    disunting tidak terhitung ganda terhadap keranjang yang baru.
 */
export function calculatePeriodBaseStock(
  products: CatalogProduct[],
  tanggalMulaiSewa: string,
  tanggalSelesaiSewa: string,
  excludeBookingId?: string,
  excludeTxId?: string
): CatalogProduct[] {
  // 1. Hitung alokasi dari booking lain dan transaksi penyewaan aktif yang bertumpang tindih
  const bookedUnitsMap: Record<string, number> = {};
  const activeBookings = getStoredBookings();
  const activeTransactions = getStoredTransaksiSewa();

  if (tanggalMulaiSewa && tanggalSelesaiSewa) {
    const linkedBookingIds = new Set<string>();

    // A. Perhitungkan Transaksi Penyewaan aktif (§F.1.D)
    activeTransactions.forEach((tx) => {
      // Lewati transaksi yang sedang disunting atau berasal dari booking yang sedang disunting agar tidak terhitung ganda
      if (excludeTxId && (tx.id.toLowerCase() === excludeTxId.toLowerCase() || tx.kode.toLowerCase() === excludeTxId.toLowerCase())) {
        return;
      }
      if (excludeBookingId && ((tx.bookingId && tx.bookingId.toLowerCase() === excludeBookingId.toLowerCase()) || (tx.bookingKode && tx.bookingKode.toLowerCase() === excludeBookingId.toLowerCase()))) {
        return;
      }
      // Transaksi yang barangnya sudah selesai dikembalikan tidak lagi mengunci stok
      if (tx.statusPengembalian === "seluruhnya") {
        return;
      }

      // Catat relasi booking asal agar booking yang telah dikonversi TIDAK terhitung ganda (§F.1.D)
      if (tx.bookingId) linkedBookingIds.add(tx.bookingId.toLowerCase());
      if (tx.bookingKode) linkedBookingIds.add(tx.bookingKode.toLowerCase());

      const txStart = tx.tglMulai || "";
      const txEnd = tx.tglSelesai || "";

      if (isDateOverlap(tanggalMulaiSewa, tanggalSelesaiSewa, txStart, txEnd)) {
        tx.items.forEach((item) => {
          if (item.tipe === "satuan") {
            bookedUnitsMap[item.id] = (bookedUnitsMap[item.id] || 0) + item.jumlah;
          } else if (item.tipe === "paket") {
            const compList = PACKAGE_COMPONENTS_MAP[item.id] || [];
            compList.forEach((c) => {
              bookedUnitsMap[c.productId] =
                (bookedUnitsMap[c.productId] || 0) + c.qty * item.jumlah;
            });
          }
        });
      }
    });

    // B. Perhitungkan Booking aktif yang berstatus 'selesai'
    activeBookings.forEach((b) => {
      // Lewati booking yang sedang disunting agar unit lamanya tidak terhitung ganda
      if (excludeBookingId && (b.id === excludeBookingId || b.kode === excludeBookingId)) {
        return;
      }

      // JANGAN duplikasi alokasi jika booking sudah dikonversi dan telah diperhitungkan pada transaksi aktif di atas (§F.1.D)
      if (linkedBookingIds.has(b.id.toLowerCase()) || linkedBookingIds.has(b.kode.toLowerCase())) {
        return;
      }

      // HANYA booking berstatus 'selesai' yang mengunci stok pada periode overlap
      // Booking yang dibatalkan / draft TIDAK MENGUNCI STOK
      if (b.status === "selesai") {
        const bStart = b.tanggalPengambilan || b.tanggalMulaiSewa || "";
        const bEnd = b.tanggalPengembalian || b.tanggalSelesaiSewa || "";

        if (isDateOverlap(tanggalMulaiSewa, tanggalSelesaiSewa, bStart, bEnd)) {
          b.items.forEach((item) => {
            if (item.tipe === "satuan") {
              bookedUnitsMap[item.id] = (bookedUnitsMap[item.id] || 0) + item.jumlah;
            } else if (item.tipe === "paket") {
              const compList = PACKAGE_COMPONENTS_MAP[item.id] || [];
              compList.forEach((c) => {
                bookedUnitsMap[c.productId] =
                  (bookedUnitsMap[c.productId] || 0) + c.qty * item.jumlah;
              });
            }
          });
        }
      }
    });
  }

  // 2. Tentukan ketersediaan dasar barang satuan
  const singleProducts = products
    .filter((p) => p.tipe === "satuan")
    .map((p) => {
      const bookedCount = bookedUnitsMap[p.id] || 0;
      // Flysheet 3x4 (p-fly) disimulasikan habis di periode saat ini sesuai desain
      const isFlysheet = p.id === "p-fly";
      const unitTersedia = isFlysheet
        ? 0
        : Math.max(0, p.totalUnit - bookedCount);

      return {
        ...p,
        unitTersedia,
      };
    });

  const singleStockMap: Record<string, number> = {};
  singleProducts.forEach((p) => {
    singleStockMap[p.id] = p.unitTersedia;
  });

  // 3. Tentukan ketersediaan dasar paket berdasarkan komponen terkecilnya
  const packageProducts = products
    .filter((p) => p.tipe === "paket")
    .map((pkg) => {
      const components = PACKAGE_COMPONENTS_MAP[pkg.id] || [];
      if (components.length === 0) {
        return pkg;
      }

      // Kapasitas paket = minimum floor(komponen.tersedia / komponen.dibutuhkan)
      let maxPossiblePackages = pkg.totalUnit;
      components.forEach((c) => {
        const availableCompUnits = singleStockMap[c.productId] ?? 0;
        const possible = Math.floor(availableCompUnits / c.qty);
        if (possible < maxPossiblePackages) {
          maxPossiblePackages = possible;
        }
      });

      return {
        ...pkg,
        unitTersedia: Math.max(0, maxPossiblePackages),
      };
    });

  return [...singleProducts, ...packageProducts];
}

/**
 * Menghitung ketersediaan dinamis katalog secara real-time dengan mengurangkan
 * barang yang sudah dimasukkan ke dalam keranjang (cart).
 */
export function calculateDynamicCatalogWithCart(
  baseProducts: CatalogProduct[],
  cart: CartItem[]
): {
  dynamicProducts: CatalogProduct[];
  remainingSingleStockMap: Record<string, number>;
  remainingPackageStockMap: Record<string, number>;
} {
  // 1. Akumulasi penggunaan stok dari keranjang
  const cartConsumedSingleMap: Record<string, number> = {};
  const cartPackageQtyMap: Record<string, number> = {};

  cart.forEach((cItem) => {
    if (cItem.tipe === "satuan") {
      cartConsumedSingleMap[cItem.id] =
        (cartConsumedSingleMap[cItem.id] || 0) + cItem.jumlah;
    } else if (cItem.tipe === "paket") {
      cartPackageQtyMap[cItem.id] =
        (cartPackageQtyMap[cItem.id] || 0) + cItem.jumlah;

      const components = PACKAGE_COMPONENTS_MAP[cItem.id] || [];
      components.forEach((c) => {
        cartConsumedSingleMap[c.productId] =
          (cartConsumedSingleMap[c.productId] || 0) + c.qty * cItem.jumlah;
      });
    }
  });

  // 2. Hitung sisa stok barang satuan
  const remainingSingleStockMap: Record<string, number> = {};
  const dynamicSingles = baseProducts
    .filter((p) => p.tipe === "satuan")
    .map((p) => {
      const consumed = cartConsumedSingleMap[p.id] || 0;
      const remaining = Math.max(0, p.unitTersedia - consumed);
      remainingSingleStockMap[p.id] = remaining;

      return {
        ...p,
        unitTersedia: remaining,
      };
    });

  // 3. Hitung sisa stok paket berdasarkan sisa komponen barang satuan
  const remainingPackageStockMap: Record<string, number> = {};
  const dynamicPackages = baseProducts
    .filter((p) => p.tipe === "paket")
    .map((pkg) => {
      const components = PACKAGE_COMPONENTS_MAP[pkg.id] || [];
      const inCartThisPkg = cartPackageQtyMap[pkg.id] || 0;

      let maxAdditionalPackages = Math.max(0, pkg.totalUnit - inCartThisPkg);
      components.forEach((c) => {
        const availableCompUnits = remainingSingleStockMap[c.productId] ?? 0;
        const possible = Math.floor(availableCompUnits / c.qty);
        if (possible < maxAdditionalPackages) {
          maxAdditionalPackages = possible;
        }
      });

      const remaining = Math.max(0, maxAdditionalPackages);
      remainingPackageStockMap[pkg.id] = remaining;

      return {
        ...pkg,
        unitTersedia: remaining,
      };
    });

  return {
    dynamicProducts: [...dynamicSingles, ...dynamicPackages],
    remainingSingleStockMap,
    remainingPackageStockMap,
  };
}
