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
  country: string;
  deviceType: string;
  referralSource: string;
  onboardedAt: string;
  subscriptionId?: string;
  isActive: boolean;
}
