import { create } from "zustand";
import { subDays, format } from "date-fns";

interface DateRange {
  from: string;
  to: string;
}

interface DashboardStore {
  dateRange: DateRange;
  selectedCountry: string | null;
  selectedPlan: string | null;
  selectedStatus: string | null;
  setDateRange: (range: DateRange) => void;
  setCountry: (country: string | null) => void;
  setPlan: (plan: string | null) => void;
  setStatus: (status: string | null) => void;
  resetFilters: () => void;
}

const defaultDateRange: DateRange = {
  from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
  to: format(new Date(), "yyyy-MM-dd"),
};

export const useDashboardStore = create<DashboardStore>((set) => ({
  dateRange: defaultDateRange,
  selectedCountry: null,
  selectedPlan: null,
  selectedStatus: null,
  setDateRange: (range) => set({ dateRange: range }),
  setCountry: (country) => set({ selectedCountry: country }),
  setPlan: (plan) => set({ selectedPlan: plan }),
  setStatus: (status) => set({ selectedStatus: status }),
  resetFilters: () =>
    set({
      dateRange: defaultDateRange,
      selectedCountry: null,
      selectedPlan: null,
      selectedStatus: null,
    }),
}));
