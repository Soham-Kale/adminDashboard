import { create } from "zustand";
import { persist } from "zustand/middleware";

export type SupportedCurrency = "INR" | "CAD" | "USD";

export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  USD: "$",
  CAD: "CA$",
  INR: "₹",
};

export const CURRENCY_FLAGS: Record<SupportedCurrency, string> = {
  USD: "🇺🇸",
  CAD: "🇨🇦",
  INR: "🇮🇳",
};

// Fallback rates (USD-based). Replaced by live rates on app load.
export const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  CAD: 1.36,
  INR: 83.5,
};

interface CurrencyStore {
  selectedCurrency: SupportedCurrency;
  detectedCurrency: SupportedCurrency;
  exchangeRates: Record<string, number>;
  hasManualOverride: boolean;
  isDetected: boolean;
  setCurrency: (currency: SupportedCurrency) => void;
  setDetectedCurrency: (currency: SupportedCurrency) => void;
  setExchangeRates: (rates: Record<string, number>) => void;
  setDetected: (value: boolean) => void;
}

export const useCurrencyStore = create<CurrencyStore>()(
  persist(
    (set) => ({
      selectedCurrency: "USD",
      detectedCurrency: "USD",
      exchangeRates: FALLBACK_RATES,
      hasManualOverride: false,
      isDetected: false,

      setCurrency: (currency) =>
        set({ selectedCurrency: currency, hasManualOverride: true }),

      setDetectedCurrency: (currency) =>
        set({ detectedCurrency: currency }),

      setExchangeRates: (rates) =>
        set({ exchangeRates: { ...FALLBACK_RATES, ...rates } }),

      setDetected: (value) =>
        set({ isDetected: value }),
    }),
    {
      name: "currency-store",
      // Only persist the user's explicit choice and whether they've overridden
      partialize: (s) => ({
        selectedCurrency: s.selectedCurrency,
        hasManualOverride: s.hasManualOverride,
      }),
    }
  )
);
