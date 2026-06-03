export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "super_admin" | "admin" | "viewer";
  avatar?: string;
  lastLogin: string;
  createdAt: string;
}

// /admin/users now returns only 4 fields — no subscription data
export interface AppUser {
  id: string;
  userName: string;
  email: string;
  onboardedAt: string;
}
