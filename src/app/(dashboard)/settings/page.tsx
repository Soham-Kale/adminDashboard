"use client";

import { useSession } from "next-auth/react";
import { useUiStore } from "@/store/uiStore";
import { Sun, Moon, User, Bell, Calendar, Shield, Trash2 } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { theme, setTheme } = useUiStore();
  const queryClient = useQueryClient();

  function handleTheme(newTheme: "dark" | "light") {
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.classList.toggle("light", newTheme === "light");
    toast.success(`Switched to ${newTheme} mode`);
  }

  function handleClearCache() {
    queryClient.clear();
    toast.success("Cache cleared — data will refresh on next visit");
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <User className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Profile</h3>
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1.5">Display Name</label>
            <input
              type="text"
              defaultValue={session?.user?.name ?? "Admin"}
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1.5">Email Address</label>
            <input
              type="email"
              defaultValue={session?.user?.email ?? "admin@youinsports.ai"}
              readOnly
              className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-muted-foreground cursor-not-allowed"
            />
          </div>
          <div>
            <label className="text-xs text-muted-foreground font-medium block mb-1.5">Role</label>
            <div className="px-3 py-2 bg-background border border-border rounded-lg text-sm text-primary font-medium w-fit">Admin</div>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Sun className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Appearance</h3>
        </div>
        <div className="flex gap-3">
          {(["dark", "light"] as const).map((t) => (
            <button
              key={t}
              onClick={() => handleTheme(t)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-colors ${
                theme === t
                  ? "bg-primary/10 border-primary/40 text-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              {t === "dark" ? "Dark Mode" : "Light Mode"}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Notifications</h3>
        </div>
        <div className="space-y-3">
          {[
            { label: "High churn alerts", description: "Notify when churn exceeds 10%" },
            { label: "New subscription alerts", description: "Daily summary of new subs" },
            { label: "Failed payment alerts", description: "Real-time failed payment notification" },
            { label: "Weekly digest", description: "Weekly analytics summary email" },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between py-2 border-b border-border last:border-0">
              <div>
                <p className="text-sm font-medium text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.description}</p>
              </div>
              <input type="checkbox" defaultChecked className="h-4 w-4 accent-primary cursor-pointer" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-5">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Default Date Range</h3>
        </div>
        <div className="flex gap-2">
          {["7 days", "30 days", "90 days", "1 year"].map((r) => (
            <button
              key={r}
              className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-colors ${
                r === "30 days"
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "bg-background border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-4 w-4 text-red-400" />
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-foreground">Clear data cache</p>
            <p className="text-xs text-muted-foreground">Invalidate all cached API responses</p>
          </div>
          <button
            onClick={handleClearCache}
            className="flex items-center gap-1.5 px-3 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 rounded-lg text-xs font-medium transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Cache
          </button>
        </div>
      </div>
    </div>
  );
}
