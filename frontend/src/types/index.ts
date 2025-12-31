/**
 * Type exports
 */
export * from "./api";

// ========== Cart Types ==========
export interface CartItem {
  service: import("./api").Service;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
  branchId: number | null;
  branchName: string | null;
  staffId: number | null;
  staffName: string | null;
  dateTime: string | null;
}

// ========== App Types ==========
export interface AppSettings {
  language: "vi" | "en";
  onboardingComplete: boolean;
}
