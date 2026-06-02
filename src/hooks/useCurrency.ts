"use client";

import { useEffect } from "react";
import {
  useCurrencyStore,
  CURRENCY_SYMBOLS,
  FALLBACK_RATES,
  type SupportedCurrency,
} from "@/store/currencyStore";

const SUPPORTED: SupportedCurrency[] = ["INR", "CAD", "USD"];

// Convert an amount from one currency to the user's selected currency.
// All exchange rates are USD-based (1 USD = X foreign).
export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>
): number {
  if (!amount || fromCurrency === toCurrency) return amount;
  const fromRate = rates[fromCurrency.toUpperCase()] ?? 1;
  const toRate   = rates[toCurrency.toUpperCase()]   ?? 1;
  const inUSD    = amount / fromRate;
  return inUSD * toRate;
}

export function formatRevenue(
  amount: number,
  fromCurrency: string,
  toCurrency: SupportedCurrency,
  rates: Record<string, number>
): string {
  const converted = convertAmount(amount, fromCurrency, toCurrency, rates);
  const symbol = CURRENCY_SYMBOLS[toCurrency] ?? "$";

  if (toCurrency === "INR") {
    // Indian number formatting (lakhs / crores)
    return `${symbol}${converted.toLocaleString("en-IN", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    })}`;
  }
  return `${symbol}${converted.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  })}`;
}

// React hook — call this to initialise IP detection and get conversion helpers
export function useCurrency() {
  const {
    selectedCurrency,
    exchangeRates,
    hasManualOverride,
    isDetected,
    setCurrency,
    setDetectedCurrency,
    setExchangeRates,
    setDetected,
  } = useCurrencyStore();

  // Run IP detection once on first mount
  useEffect(() => {
    if (isDetected) return;
    setDetected(true);

    Promise.all([
      fetch("https://ipapi.co/json/").then((r) => r.json()).catch(() => null),
      fetch("https://open.er-api.com/v6/latest/USD").then((r) => r.json()).catch(() => null),
    ]).then(([geo, fx]) => {
      // Exchange rates
      if (fx?.rates && typeof fx.rates === "object") {
        setExchangeRates(fx.rates as Record<string, number>);
      }

      // Currency detection
      if (geo) {
        const detected = (
          SUPPORTED.includes(geo.currency as SupportedCurrency)
            ? geo.currency
            : "USD"
        ) as SupportedCurrency;
        setDetectedCurrency(detected);
        // Only auto-set if the user has never manually chosen
        if (!hasManualOverride) {
          setCurrency(detected);
        }
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    selectedCurrency,
    exchangeRates,

    /** Convert + format any amount to the selected currency */
    formatRevenue: (amount: number, fromCurrency = "USD") =>
      formatRevenue(amount, fromCurrency, selectedCurrency, exchangeRates),

    /** Raw numeric conversion (for chart axes etc.) */
    convertAmount: (amount: number, fromCurrency = "USD") =>
      convertAmount(amount, fromCurrency, selectedCurrency, exchangeRates),

    symbol: CURRENCY_SYMBOLS[selectedCurrency],
  };
}
