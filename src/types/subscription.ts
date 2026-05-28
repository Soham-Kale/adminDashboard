export type SubscriptionStatus =
  | "active"
  | "cancelled_access_ended"
  | "cancelled_access_active"
  | "pending"
  | "trial"
  | "trial_converted";

export type PlanType = "monthly" | "annual" | "trial" | "free";
export type PaymentStatus = "paid" | "failed" | "pending" | "refunded";
export type DeviceType = "mobile" | "desktop" | "tablet";

export interface Subscriber {
  id: string;
  userName: string;
  email: string;
  planType: PlanType;
  subscriptionStatus: SubscriptionStatus;
  trialStatus: "active" | "ended" | "none";
  subscriptionStartDate: string;
  renewalDate: string | null;
  cancellationDate: string | null;
  accessEndDate: string | null;
  revenue: number;
  country: string;
  deviceType: DeviceType;
  referralSource: string;
  paymentStatus: PaymentStatus;
  createdAt: string;
}

export interface SubscriberFilters {
  status?: SubscriptionStatus;
  plan?: PlanType;
  country?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}
