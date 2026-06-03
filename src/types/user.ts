export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "viewer";
  avatar?: string;
  lastLogin: string;
  createdAt: string;
}

export interface AppUser {
  id: string;
  userName: string;
  email: string;
  phoneNumber: string | null;
  onboardedAt: string;
  isActive: boolean;
  hasSubscription: boolean;
  subscriptionId: string | null;
  subscriptionStatus: string | null;
  planName: string | null;
  billingCycle: string | null;
  provider: string | null;
}
