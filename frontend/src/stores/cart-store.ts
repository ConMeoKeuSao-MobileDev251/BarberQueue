/**
 * Cart Store
 * Manages shopping cart state for booking services
 */
import { create } from "zustand";
import * as Sentry from "@sentry/react-native";
import type { Service, CartItem } from "../types";

interface CartState {
  // State
  items: CartItem[];
  branchId: number | null;
  branchName: string | null;
  staffId: number | null;
  staffName: string | null;
  dateTime: string | null;
  promoCode: string | null;
  promoDiscount: number; // percentage (e.g., 20 for 20%)

  // Actions
  addItem: (service: Service) => void;
  removeItem: (serviceId: number) => void;
  updateQuantity: (serviceId: number, quantity: number) => void;
  setBranch: (branchId: number, branchName: string) => void;
  setStaff: (staffId: number | null, staffName: string) => void;
  setDateTime: (dateTime: string) => void;
  setPromo: (code: string | null, discount: number) => void;
  clearCart: () => void;
}

export const useCartStore = create<CartState>()((set, get) => ({
  // Initial state
  items: [],
  branchId: null,
  branchName: null,
  staffId: null,
  staffName: null,
  dateTime: null,
  promoCode: null,
  promoDiscount: 0,

  // Add service to cart
  addItem: (service) => {
    // Track service added event
    Sentry.captureMessage("service_added", {
      level: "info",
      tags: { action: "cart" },
      extra: {
        serviceId: service.id,
        serviceName: service.name,
        price: service.price,
      },
    });

    set((state) => {
      const existingItem = state.items.find(
        (item) => item.service.id === service.id
      );

      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.service.id === service.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      return {
        items: [...state.items, { service, quantity: 1 }],
      };
    });
  },

  // Remove service from cart
  removeItem: (serviceId) => {
    set((state) => ({
      items: state.items.filter((item) => item.service.id !== serviceId),
    }));
  },

  // Update quantity
  updateQuantity: (serviceId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(serviceId);
      return;
    }

    set((state) => ({
      items: state.items.map((item) =>
        item.service.id === serviceId ? { ...item, quantity } : item
      ),
    }));
  },

  // Set branch info (clears staff if branch changes)
  setBranch: (branchId, branchName) => {
    const currentBranchId = get().branchId;
    // Clear staff selection if switching to a different branch
    if (currentBranchId !== null && currentBranchId !== branchId) {
      set({ branchId, branchName, staffId: null, staffName: null });
    } else {
      set({ branchId, branchName });
    }
  },

  // Set staff info
  setStaff: (staffId, staffName) => {
    set({ staffId, staffName });
  },

  // Set date/time
  setDateTime: (dateTime) => {
    set({ dateTime });
  },

  // Set promo code
  setPromo: (code, discount) => {
    set({ promoCode: code, promoDiscount: discount });
  },

  // Clear cart
  clearCart: () => {
    set({
      items: [],
      branchId: null,
      branchName: null,
      staffId: null,
      staffName: null,
      dateTime: null,
      promoCode: null,
      promoDiscount: 0,
    });
  },
}));

// Reactive selector hooks - these compute values from items and update reactively
export const useCartItems = () => useCartStore((state) => state.items);

export const useCartTotalPrice = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.service.price * item.quantity, 0)
  );

export const useCartTotalDuration = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.service.duration * item.quantity, 0)
  );

export const useCartTotalItems = () =>
  useCartStore((state) =>
    state.items.reduce((sum, item) => sum + item.quantity, 0)
  );

export const useCartDiscount = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.service.price * item.quantity,
      0
    );
    return Math.round((subtotal * state.promoDiscount) / 100);
  });

export const useCartFinalPrice = () =>
  useCartStore((state) => {
    const subtotal = state.items.reduce(
      (sum, item) => sum + item.service.price * item.quantity,
      0
    );
    const discount = Math.round((subtotal * state.promoDiscount) / 100);
    return subtotal - discount;
  });

// Legacy aliases for backward compatibility
export const useCartTotal = useCartTotalPrice;
export const useCartItemCount = useCartTotalItems;
