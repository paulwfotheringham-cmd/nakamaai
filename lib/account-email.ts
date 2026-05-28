"use client";

const STORAGE_KEY = "nakama_account_email";

export function persistAccountEmail(email: string): void {
  if (typeof window === "undefined") return;
  const value = email.trim().toLowerCase();
  if (!value || !value.includes("@")) return;
  localStorage.setItem(STORAGE_KEY, value);
}

export function readAccountEmail(): string | null {
  if (typeof window === "undefined") return null;
  const value = localStorage.getItem(STORAGE_KEY)?.trim().toLowerCase();
  if (!value || !value.includes("@")) return null;
  return value;
}
