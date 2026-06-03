// Status values from real backend
export type SubscriptionStatus =
  | "active"
  | "trial"
  | "pending"
  | "paused"
  | "cancelled"
  | "expired";

export type BillingCycle = "monthly" | "annual" | "yearly";
export type PaymentStatus = "paid" | "failed";
export type DeviceType = "mobile" | "desktop" | "tablet";

export interface Subscriber {
  userSubscriptionId: number | string;
  userName: string;
  email: string;
  phoneNumber?: string | null;
  planName: string;
  planCode: string;
  billingCycle: BillingCycle;
  currency: string;
  subscriptionStatus: SubscriptionStatus;
  trialStatus: "active" | "ended" | "none";
  provider: string;
  subscriptionStartDate: string;
  renewalDate: string | null;
  accessEndDate: string | null;
  trialStartDate?: string | null;
  trialEndDate?: string | null;
  isComplimentary?: number | boolean;
  createdAt: string;
}

export interface SubscriberFilters {
  status?: SubscriptionStatus;
  plan?: string;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
