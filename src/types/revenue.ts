export interface RevenueRecord {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  currency: string;
  planType: string;
  paymentDate: string;
  paymentStatus: "paid" | "failed" | "pending" | "refunded";
  invoiceId: string;
  country: string;
}

export interface FailedPayment {
  id: string;
  userId: string;
  userName: string;
  email: string;
  amount: number;
  attemptedAt: string;
  failureReason: string;
  retryCount: number;
  planType: string;
}

export interface RevenueStats {
  totalRevenue: number;
  mrr: number;
  arr: number;
  averageRevenuePerUser: number;
  revenueGrowth: number;
}
