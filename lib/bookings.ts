'use client';

import { Booking } from './data';

const BOOKINGS_KEY = 'workbee_bookings';

export function getBookings(): Booking[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(BOOKINGS_KEY);
  if (!stored) return [];
  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function updateBookingStatus(bookingId: string, status: Booking['status']): void {
  const bookings = getBookings();
  const idx = bookings.findIndex(b => b.id === bookingId);
  if (idx !== -1) {
    bookings[idx].status = status;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  }
}

export function getRecentBookings(limit = 3): Booking[] {
  return getBookings().slice(0, limit);
}
