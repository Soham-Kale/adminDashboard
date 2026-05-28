import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UiStore {
  sidebarCollapsed: boolean;
  theme: "dark" | "light";
  activeModal: string | null;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  setTheme: (theme: "dark" | "light") => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      theme: "dark",
      activeModal: null,
      toggleSidebar: () =>
        set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
      setSidebarCollapsed: (collapsed) =>
        set({ sidebarCollapsed: collapsed }),
      setTheme: (theme) => set({ theme }),
      openModal: (id) => set({ activeModal: id }),
      closeModal: () => set({ activeModal: null }),
    }),
    { name: "ui-store", partialize: (s) => ({ sidebarCollapsed: s.sidebarCollapsed, theme: s.theme }) }
  )
);
