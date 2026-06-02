"use client";

import { useCurrencyStore, CURRENCY_FLAGS, CURRENCY_SYMBOLS, type SupportedCurrency } from "@/store/currencyStore";
import { ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils/cn";

const OPTIONS: SupportedCurrency[] = ["USD", "CAD", "INR"];

export function CurrencySelector() {
  const { selectedCurrency, detectedCurrency, setCurrency } = useCurrencyStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-sm font-medium bg-muted/50 hover:bg-accent border border-border transition-colors"
      >
        <span>{CURRENCY_FLAGS[selectedCurrency]}</span>
        <span className="text-foreground">{selectedCurrency}</span>
        <ChevronDown className={cn("h-3 w-3 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-1 w-36 bg-card border border-border rounded-lg shadow-xl z-50 overflow-hidden">
          <div className="px-3 py-2 border-b border-border">
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Currency</p>
          </div>
          {OPTIONS.map((currency) => (
            <button
              key={currency}
              onClick={() => { setCurrency(currency); setOpen(false); }}
              className={cn(
                "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors hover:bg-accent",
                selectedCurrency === currency && "bg-primary/10 text-primary"
              )}
            >
              <span className="text-base">{CURRENCY_FLAGS[currency]}</span>
              <div className="text-left">
                <p className="font-medium leading-none">{currency}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{CURRENCY_SYMBOLS[currency]}</p>
              </div>
              {currency === detectedCurrency && (
                <span className="ml-auto text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                  Auto
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
