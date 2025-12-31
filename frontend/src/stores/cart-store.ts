/**
 * Cart Store
 * Manages shopping cart state for booking services
 */
import { create } from "zustand";
import type { Service, CartItem } from "../types";

interface CartState {
  // State
  items: CartItem[];
  branchId: number | null;
  branchName: string | null;
  staffId: number | null;
  staffName: string | null;
  dateTime: string | null;

  // Computed getters
  readonly totalPrice: number;
  readonly totalDuration: number;
  readonly totalItems: number;

  // Actions
  addItem: (service: Service) => void;
  removeItem: (serviceId: number) => void;
  updateQuantity: (serviceId: number, quantity: number) => void;
  setBranch: (branchId: number, branchName: string) => void;
  setStaff: (staffId: number | null, staffName: string) => void;
  setDateTime: (dateTime: string) => void;
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

  // Computed getters
  get totalPrice() {
    return get().items.reduce(
      (sum, item) => sum + item.service.price * item.quantity,
      0
    );
  },

  get totalDuration() {
    return get().items.reduce(
      (sum, item) => sum + item.service.duration * item.quantity,
      0
    );
  },

  get totalItems() {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  // Add service to cart
  addItem: (service) => {
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

  // Set branch info
  setBranch: (branchId, branchName) => {
    set({ branchId, branchName });
  },

  // Set staff info
  setStaff: (staffId, staffName) => {
    set({ staffId, staffName });
  },

  // Set date/time
  setDateTime: (dateTime) => {
    set({ dateTime });
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
    });
  },
}));

// Selector hooks
export const useCartItems = () => useCartStore((state) => state.items);
export const useCartTotal = () => useCartStore((state) => state.totalPrice);
export const useCartItemCount = () => useCartStore((state) => state.totalItems);
