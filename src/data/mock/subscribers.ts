import { format, subDays, addDays } from "date-fns";
import type { Subscriber } from "@/types/subscription";

const NAMES = [
  "James Wilson", "Emma Thompson", "Liam Anderson", "Olivia Martinez", "Noah Garcia",
  "Ava Johnson", "William Davis", "Sophia Miller", "Benjamin Wilson", "Isabella Moore",
  "Elijah Taylor", "Mia Thomas", "Lucas Jackson", "Charlotte White", "Mason Harris",
  "Amelia Martin", "Ethan Thompson", "Harper Lewis", "Alexander Lee", "Evelyn Walker",
  "Henry Hall", "Abigail Allen", "Sebastian Young", "Emily Hernandez", "Jack King",
  "Elizabeth Wright", "Daniel Scott", "Sofia Torres", "Matthew Nguyen", "Camila Hill",
];

const COUNTRIES = ["United States", "India", "United Kingdom", "Canada", "Australia", "Germany", "France", "Brazil"];
const SOURCES = ["organic", "google_ads", "social_media", "referral", "email", "direct"];
const DEVICES: Array<"mobile" | "desktop" | "tablet"> = ["mobile", "mobile", "mobile", "desktop", "desktop", "tablet"];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export const MOCK_SUBSCRIBERS: Subscriber[] = Array.from({ length: 23 }, (_, i) => {
  const name = NAMES[i];
  const startDate = subDays(new Date(), Math.floor(Math.random() * 60) + 5);
  return {
    id: `sub_active_${i + 1}`,
    userName: name,
    email: name.toLowerCase().replace(" ", ".") + "@example.com",
    planType: i % 3 === 0 ? "annual" : "monthly",
    subscriptionStatus: "active",
    trialStatus: "ended",
    subscriptionStartDate: format(startDate, "yyyy-MM-dd"),
    renewalDate: format(addDays(startDate, i % 3 === 0 ? 365 : 30), "yyyy-MM-dd"),
    cancellationDate: null,
    accessEndDate: null,
    revenue: i % 3 === 0 ? 999 : 99,
    country: randomFrom(COUNTRIES),
    deviceType: randomFrom(DEVICES),
    referralSource: randomFrom(SOURCES),
    paymentStatus: "paid",
    createdAt: format(startDate, "yyyy-MM-dd"),
  };
});

export const MOCK_PENDING: Subscriber[] = Array.from({ length: 3 }, (_, i) => {
  const name = NAMES[23 + i];
  const startDate = subDays(new Date(), i + 1);
  return {
    id: `sub_pending_${i + 1}`,
    userName: name,
    email: name.toLowerCase().replace(" ", ".") + "@example.com",
    planType: "monthly",
    subscriptionStatus: "pending",
    trialStatus: "none",
    subscriptionStartDate: format(startDate, "yyyy-MM-dd"),
    renewalDate: null,
    cancellationDate: null,
    accessEndDate: null,
    revenue: 0,
    country: randomFrom(COUNTRIES),
    deviceType: randomFrom(DEVICES),
    referralSource: randomFrom(SOURCES),
    paymentStatus: "pending",
    createdAt: format(startDate, "yyyy-MM-dd"),
  };
});

export const MOCK_CANCELLED: Subscriber[] = Array.from({ length: 60 }, (_, i) => {
  const name = NAMES[i % NAMES.length];
  const startDate = subDays(new Date(), Math.floor(Math.random() * 90) + 10);
  const cancelDate = subDays(new Date(), Math.floor(Math.random() * 30) + 1);
  const isAccessEnded = i % 2 === 0;
  return {
    id: `sub_cancelled_${i + 1}`,
    userName: `${name} (C)`,
    email: `cancelled${i + 1}@example.com`,
    planType: i % 4 === 0 ? "annual" : "monthly",
    subscriptionStatus: isAccessEnded ? "cancelled_access_ended" : "cancelled_access_active",
    trialStatus: "ended",
    subscriptionStartDate: format(startDate, "yyyy-MM-dd"),
    renewalDate: null,
    cancellationDate: format(cancelDate, "yyyy-MM-dd"),
    accessEndDate: isAccessEnded ? format(cancelDate, "yyyy-MM-dd") : format(addDays(startDate, 30), "yyyy-MM-dd"),
    revenue: i % 4 === 0 ? 999 : 99,
    country: randomFrom(COUNTRIES),
    deviceType: randomFrom(DEVICES),
    referralSource: randomFrom(SOURCES),
    paymentStatus: "paid",
    createdAt: format(startDate, "yyyy-MM-dd"),
  };
});

export const MOCK_TRIALS: Subscriber[] = Array.from({ length: 8 }, (_, i) => {
  const name = NAMES[(i + 26) % NAMES.length];
  const startDate = subDays(new Date(), i + 1);
  return {
    id: `sub_trial_${i + 1}`,
    userName: name,
    email: name.toLowerCase().replace(" ", ".") + `${i}@example.com`,
    planType: "trial",
    subscriptionStatus: "trial",
    trialStatus: "active",
    subscriptionStartDate: format(startDate, "yyyy-MM-dd"),
    renewalDate: format(addDays(startDate, 14), "yyyy-MM-dd"),
    cancellationDate: null,
    accessEndDate: format(addDays(startDate, 14), "yyyy-MM-dd"),
    revenue: 0,
    country: randomFrom(COUNTRIES),
    deviceType: randomFrom(DEVICES),
    referralSource: randomFrom(SOURCES),
    paymentStatus: "pending",
    createdAt: format(startDate, "yyyy-MM-dd"),
  };
});

export const ALL_SUBSCRIBERS = [...MOCK_SUBSCRIBERS, ...MOCK_PENDING, ...MOCK_CANCELLED, ...MOCK_TRIALS];
