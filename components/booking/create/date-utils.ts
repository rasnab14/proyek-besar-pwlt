// components/booking/create/date-utils.ts
/**
 * Utility functions for Booking Date, Duration, and End Date Calculations
 * Sesuai docs/KEBUTUHAN-FUNGSIONAL.md §E.5, §E.8, §E.9, & §E.33
 */

/**
 * Format today's date as YYYY-MM-DD
 */
export function getTodayString(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/**
 * Add days to date string YYYY-MM-DD
 */
export function addDays(dateStr: string, days: number): string {
  if (!dateStr || isNaN(days)) return "";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return "";
  const [y, m, d] = parts;
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  const resY = date.getFullYear();
  const resM = String(date.getMonth() + 1).padStart(2, "0");
  const resD = String(date.getDate()).padStart(2, "0");
  return `${resY}-${resM}-${resD}`;
}

/**
 * Hitung Tanggal Selesai Sewa secara otomatis:
 * Tanggal Selesai Sewa = Tanggal Mulai Sewa + Durasi Sewa
 * Contoh: 27 November 2026 + 5 hari = 2 Desember 2026 (2026-12-02)
 */
export function calculateEndDate(startDateStr: string, durationDays: number): string {
  return addDays(startDateStr, durationDays);
}

/**
 * Hitung selisih hari kalender antara Tanggal Booking dan Tanggal Mulai Sewa:
 * Selisih Hari = Tanggal Mulai Sewa - Tanggal Booking
 * Contoh: 30 Nov 2026 - 27 Nov 2026 = 3 hari (H-3 => DP 25%)
 * Contoh: 28 Nov 2026 - 27 Nov 2026 = 1 hari (H-1 => DP 0%)
 * Contoh: 27 Nov 2026 - 27 Nov 2026 = 0 hari (Hari-H => DP 0%)
 */
export function calculateHDiffBetween(bookingDateStr: string, startDateStr: string): number {
  if (!bookingDateStr || !startDateStr) return 0;
  const bParts = bookingDateStr.split("-").map(Number);
  const sParts = startDateStr.split("-").map(Number);
  if (bParts.length !== 3 || sParts.length !== 3) return 0;
  const [by, bm, bd] = bParts;
  const [sy, sm, sd] = sParts;
  const bDate = new Date(by, bm - 1, bd);
  const sDate = new Date(sy, sm - 1, sd);
  const diffTime = sDate.getTime() - bDate.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format tanggal YYYY-MM-DD ke format singkat sesuai Screenshot Referensi (contoh: 2 Des 2026)
 */
export function formatTanggalSingkat(dateStr: string): string {
  if (!dateStr) return "-";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
  return `${d} ${months[m - 1]} ${y}`;
}

export const formatDateShort = formatTanggalSingkat;

/**
 * Format tanggal YYYY-MM-DD ke Bahasa Indonesia lengkap (contoh: 2 Desember 2026)
 */
export function formatIndonesianDateFull(dateStr: string): string {
  if (!dateStr) return "-";
  const parts = dateStr.split("-").map(Number);
  if (parts.length !== 3) return dateStr;
  const [y, m, d] = parts;
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  return `${d} ${months[m - 1]} ${y}`;
}
