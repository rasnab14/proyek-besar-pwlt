/**
 * lib/cn.ts — ClassName merger utility
 * Sesuai docs/ATURAN-STRUKTUR-PROJECT.md §1
 */

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}
