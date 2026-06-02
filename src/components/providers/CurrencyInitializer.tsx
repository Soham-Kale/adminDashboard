"use client";

import { useCurrency } from "@/hooks/useCurrency";

// Mounts once at app root to trigger IP-based currency detection.
// Renders nothing visible.
export function CurrencyInitializer() {
  useCurrency();
  return null;
}
