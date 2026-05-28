"use client";

import { signOut, useSession } from "next-auth/react";
import { Bell, Sun, Moon, LogOut, User, RefreshCw } from "lucide-react";
import { useUiStore } from "@/store/uiStore";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/constants/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function TopBar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useUiStore();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const pageTitle = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Dashboard";

  function handleRefresh() {
    queryClient.invalidateQueries();
    toast.success("Data refreshed");
  }

  function handleThemeToggle() {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
    document.documentElement.classList.toggle("light", newTheme === "light");
  }

  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-sm flex items-center justify-between px-6 shrink-0 sticky top-0 z-30">
      <div>
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
        <p className="text-xs text-muted-foreground">YouInSports Admin</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleRefresh}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          title="Refresh data"
        >
          <RefreshCw className="h-4 w-4" />
        </button>

        <button
          onClick={handleThemeToggle}
          className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
          {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>

        <button className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors relative">
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 bg-primary rounded-full" />
        </button>

        <div className="h-6 w-px bg-border mx-1" />

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/15 flex items-center justify-center">
            <User className="h-4 w-4 text-primary" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-medium text-foreground leading-none">
              {session?.user?.name ?? "Admin"}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {session?.user?.email ?? "admin@youinsports.ai"}
            </p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
