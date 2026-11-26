/**
 * lib/format.ts — Utility format mata uang Rupiah dan tanggal id-ID
 * Sesuai docs/ATURAN-STRUKTUR-PROJECT.md §1
 */

/**
 * Format angka ke format mata uang Rupiah (contoh: Rp 816.000)
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace(/\s+/g, " ");
}

/**
 * Format tanggal ke format bahasa Indonesia (contoh: 21 Nov 2026 atau Sabtu, 21 Nov 2026)
 */
export function formatTanggal(
  date: Date | string,
  options?: { includeDay?: boolean; includeTime?: boolean }
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "-";

  const dayNames = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
    "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
  ];

  const dayName = dayNames[d.getDay()];
  const day = d.getDate();
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();

  let result = `${day} ${month} ${year}`;
  if (options?.includeDay) {
    result = `${dayName}, ${result}`;
  }

  if (options?.includeTime) {
    const hours = String(d.getHours()).padStart(2, "0");
    const minutes = String(d.getMinutes()).padStart(2, "0");
    result = `${result} · ${hours}.${minutes} WIB`;
  }

  return result;
}
