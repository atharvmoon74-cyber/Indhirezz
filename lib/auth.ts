'use client';

export interface User {
  name: string;
  phone: string;
}

const USER_KEY = 'workbee_user';

export function getUser(): User | null {
  if (typeof window === 'undefined') return null;
  const stored = localStorage.getItem(USER_KEY);
  if (!stored) return null;
  try {
    return JSON.parse(stored);
  } catch {
    return null;
  }
}

export function setUser(user: User): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function logout(): void {
  localStorage.removeItem(USER_KEY);
}

export function isLoggedIn(): boolean {
  return getUser() !== null;
}
