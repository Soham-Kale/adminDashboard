// Fields returned by real backend at /admin/revenue?type=history
export interface RevenueRecord {
  id: string;
  userSubscriptionId: string;
  userName: string;
  email: string;
  amount: number;
  currency: string;
  billingCycle: string;       // 'monthly' | 'annual'
  paymentStatus: "paid" | "failed";
  paymentDate: string;
  provider: string;           // 'stripe' | 'apple' | 'google' | etc.
  createdAt: string;
}

// Fields returned by real backend at /admin/revenue?type=failed
export interface FailedPayment {
  id: string;
  userSubscriptionId: string;
  userName: string;
  email: string;
  amount: number;
  currency: string;
  attemptedAt: string;
  retryCount: number;
  provider: string;
}

export interface RevenueStats {
  totalRevenue: number;
  mrr: number;
  arr: number;
  averageRevenuePerUser: number;
  revenueGrowth: number;
}
