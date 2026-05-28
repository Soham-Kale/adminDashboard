import { format, subDays } from "date-fns";
import type { RevenueRecord, FailedPayment } from "@/types/revenue";

const NAMES = [
  "James Wilson", "Emma Thompson", "Liam Anderson", "Olivia Martinez", "Noah Garcia",
  "Ava Johnson", "William Davis", "Sophia Miller", "Benjamin Wilson", "Isabella Moore",
];

export const MOCK_REVENUE: RevenueRecord[] = Array.from({ length: 50 }, (_, i) => {
  const name = NAMES[i % NAMES.length];
  const isAnnual = i % 5 === 0;
  return {
    id: `rev_${i + 1}`,
    userId: `user_${i + 1}`,
    userName: name,
    email: name.toLowerCase().replace(" ", ".") + `${i}@example.com`,
    amount: isAnnual ? 999 : 99,
    currency: "USD",
    planType: isAnnual ? "annual" : "monthly",
    paymentDate: format(subDays(new Date(), i * 2), "yyyy-MM-dd"),
    paymentStatus: i % 10 === 7 ? "refunded" : "paid",
    invoiceId: `INV-${String(1000 + i).padStart(5, "0")}`,
    country: ["United States", "India", "United Kingdom", "Canada"][i % 4],
  };
});

export const MOCK_FAILED_PAYMENTS: FailedPayment[] = Array.from({ length: 12 }, (_, i) => {
  const name = NAMES[i % NAMES.length];
  const reasons = [
    "Card declined",
    "Insufficient funds",
    "Card expired",
    "Invalid card number",
    "Bank declined",
  ];
  return {
    id: `fail_${i + 1}`,
    userId: `user_fail_${i + 1}`,
    userName: name,
    email: name.toLowerCase().replace(" ", ".") + `_fail${i}@example.com`,
    amount: 99,
    attemptedAt: format(subDays(new Date(), i + 1), "yyyy-MM-dd"),
    failureReason: reasons[i % reasons.length],
    retryCount: Math.floor(Math.random() * 3),
    planType: "monthly",
  };
});
