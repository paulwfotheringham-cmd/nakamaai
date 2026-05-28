"use client";

import { readGuidePreferences, writeGuidePreferences } from "@/lib/guides/preferences";

const STORAGE_KEY = "nakama_username";

/** Persist display username for dashboard, couples, and guide chat. */
export function persistAccountUsername(username: string): void {
  if (typeof window === "undefined") return;
  const value = username.trim();
  if (!value) return;

  localStorage.setItem(STORAGE_KEY, value);
  localStorage.setItem("userName", value);

  const prefs = readGuidePreferences();
  writeGuidePreferences({ ...prefs, userName: value });
}

export function readAccountUsername(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(STORAGE_KEY)?.trim() || null;
}
