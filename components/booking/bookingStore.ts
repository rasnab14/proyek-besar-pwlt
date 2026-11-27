// components/booking/bookingStore.ts
/**
 * Shared storage layer for Booking records between Admin and Owner.
 * Ensures that changes made in "Catat Booking" or "Lanjutkan Draft" 
 * update the exact same record without duplication and synchronize across views.
 */

import { BookingRecord } from "./types";
import { INITIAL_BOOKINGS } from "./mockData";

const STORAGE_KEY = "summit_bookings_data";

export function getStoredBookings(): BookingRecord[] {
  if (typeof window === "undefined") {
    return INITIAL_BOOKINGS;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKINGS));
      return INITIAL_BOOKINGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_BOOKINGS;
  } catch {
    return INITIAL_BOOKINGS;
  }
}

export function getBookingByIdOrCode(idOrCode: string): BookingRecord | undefined {
  const list = getStoredBookings();
  const search = idOrCode.toLowerCase().trim();
  return list.find((b) => b.id.toLowerCase() === search || b.kode.toLowerCase() === search);
}

export function saveOrUpdateBooking(booking: BookingRecord): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredBookings();
    const idx = list.findIndex(
      (b) => b.id === booking.id || b.kode.toLowerCase() === booking.kode.toLowerCase()
    );
    let updatedList: BookingRecord[];
    if (idx >= 0) {
      updatedList = [...list];
      updatedList[idx] = booking;
    } else {
      updatedList = [booking, ...list];
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
    window.dispatchEvent(new Event("summit_bookings_updated"));
  } catch (err) {
    console.error("Failed to save booking to storage:", err);
  }
}

export function deleteBookingFromStore(id: string): void {
  if (typeof window === "undefined") return;
  try {
    const list = getStoredBookings();
    const updated = list.filter((b) => b.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("summit_bookings_updated"));
  } catch (err) {
    console.error("Failed to delete booking:", err);
  }
}
