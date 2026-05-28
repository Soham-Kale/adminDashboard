export type LogAction =
  | "login"
  | "logout"
  | "export"
  | "sync"
  | "view"
  | "settings_change"
  | "user_action";

export interface AdminLog {
  id: string;
  adminEmail: string;
  adminName: string;
  action: LogAction;
  resource: string;
  details: string;
  ipAddress: string;
  timestamp: string;
  status: "success" | "failed";
}
