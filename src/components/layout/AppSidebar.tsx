"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Users, CreditCard, BarChart2, DollarSign,
  Plug, FileText, Settings, BarChart, ChevronLeft, ChevronRight, X,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useUiStore } from "@/store/uiStore";
import { NAV_ITEMS } from "@/lib/constants/navigation";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  LayoutDashboard, Users, CreditCard, BarChart2, DollarSign,
  Plug, FileText, Settings, BarChart,
};

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();
  const { sidebarCollapsed, toggleSidebar } = useUiStore();

  return (
    <>
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border shrink-0">
        <AnimatePresence mode="wait">
          {!sidebarCollapsed && (
            <motion.div
              key="logo-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-center gap-2.5"
            >
              <div className="p-1.5 rounded-md bg-primary/15">
                <BarChart className="h-5 w-5 text-primary" />
              </div>
              <div className="leading-tight">
                <p className="text-sm font-semibold text-foreground">Sports Analytics</p>
                <p className="text-[10px] text-muted-foreground">Admin Dashboard</p>
              </div>
            </motion.div>
          )}
          {sidebarCollapsed && (
            <motion.div key="logo-icon" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto">
              <BarChart className="h-5 w-5 text-primary" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <nav className="flex-1 py-4 px-2 space-y-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = ICON_MAP[item.icon] ?? LayoutDashboard;
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors group",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              <AnimatePresence>
                {!sidebarCollapsed && (
                  <motion.span
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: "auto" }}
                    exit={{ opacity: 0, width: 0 }}
                    transition={{ duration: 0.15 }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    {item.label}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle — desktop only */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 p-1 rounded-full bg-sidebar border border-sidebar-border text-muted-foreground hover:text-foreground transition-colors z-10 hidden md:flex"
      >
        {sidebarCollapsed ? <ChevronRight className="h-3 w-3" /> : <ChevronLeft className="h-3 w-3" />}
      </button>
    </>
  );
}

export function AppSidebar() {
  const { sidebarCollapsed, mobileDrawerOpen, setMobileDrawerOpen } = useUiStore();

  const closeMobileDrawer = () => setMobileDrawerOpen(false);

  return (
    <>
      {/* ── Desktop sidebar (md and up) ─────────────────────────── */}
      <motion.aside
        animate={{ width: sidebarCollapsed ? 64 : 240 }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="relative h-screen bg-sidebar border-r border-sidebar-border flex-col shrink-0 overflow-hidden hidden md:flex"
      >
        <SidebarContent />
      </motion.aside>

      {/* ── Mobile drawer (< md) ─────────────────────────────────── */}
      <AnimatePresence>
        {mobileDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={closeMobileDrawer}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
            />

            {/* Drawer panel */}
            <motion.aside
              key="drawer"
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-sidebar border-r border-sidebar-border flex flex-col z-50 md:hidden overflow-hidden"
            >
              {/* Close button inside drawer */}
              <button
                onClick={closeMobileDrawer}
                className="absolute top-4 right-4 p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>

              <SidebarContent onNavClick={closeMobileDrawer} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
