import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiStore {
  sidebarCollapsed: boolean;   // desktop sidebar collapsed state (persisted)
  mobileDrawerOpen: boolean;   // mobile drawer open state (NOT persisted — always starts closed)
  theme: "dark" | "light";
  activeModal: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      mobileDrawerOpen: false,
      theme: "dark",
      activeModal: null,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),
      setMobileDrawerOpen: (open) =>
        set({ mobileDrawerOpen: open }),
      setTheme: (theme) => set({ theme }),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    // Only persist desktop state — mobileDrawerOpen always starts false
    { name: "ui-store", partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, theme: s.theme }) }
  )
);
