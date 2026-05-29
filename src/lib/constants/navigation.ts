export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/users", label: "Users", icon: "Users" },
  { href: "/subscriptions", label: "Subscriptions", icon: "CreditCard" },
  { href: "/analytics", label: "Analytics", icon: "BarChart2" },
  { href: "/revenue", label: "Revenue", icon: "DollarSign" },
  // { href: "/integrations", label: "Integrations", icon: "Plug" },
  { href: "/admin-logs", label: "Admin Logs", icon: "FileText" },
  { href: "/settings", label: "Settings", icon: "Settings" },
];
