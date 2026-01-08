/**
 * Cart Store Tests
 */
import { useCartStore } from "../cart-store";
import type { Service } from "../../types";

// Mock service for testing
const mockService: Service = {
  id: 1,
  name: "Cắt tóc nam",
  price: 100000,
  duration: 30,
};

const mockService2: Service = {
  id: 2,
  name: "Gội đầu",
  price: 50000,
  duration: 15,
};

describe("Cart Store", () => {
  // Reset store before each test
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  describe("addItem", () => {
    it("should add new item to cart", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockService);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].service.id).toBe(1);
      expect(items[0].quantity).toBe(1);
    });

    it("should increment quantity for existing item", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockService);
      addItem(mockService);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });

    it("should add multiple different items", () => {
      const { addItem } = useCartStore.getState();
      addItem(mockService);
      addItem(mockService2);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("should remove item from cart", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockService);
      addItem(mockService2);

      removeItem(mockService.id);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
      expect(items[0].service.id).toBe(2);
    });

    it("should handle removing non-existent item", () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockService);

      removeItem(999);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(1);
    });
  });

  describe("updateQuantity", () => {
    it("should update item quantity", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockService);

      updateQuantity(mockService.id, 5);

      const { items } = useCartStore.getState();
      expect(items[0].quantity).toBe(5);
    });

    it("should remove item when quantity is 0", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockService);

      updateQuantity(mockService.id, 0);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });

    it("should remove item when quantity is negative", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockService);

      updateQuantity(mockService.id, -1);

      const { items } = useCartStore.getState();
      expect(items).toHaveLength(0);
    });
  });

  describe("computed values", () => {
    it("should calculate totalPrice correctly from items", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockService); // 100000
      addItem(mockService2); // 50000
      updateQuantity(mockService.id, 2); // 200000

      const { items } = useCartStore.getState();
      const totalPrice = items.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      );
      expect(totalPrice).toBe(250000);
    });

    it("should calculate totalDuration correctly from items", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockService); // 30 min
      addItem(mockService2); // 15 min
      updateQuantity(mockService.id, 2); // 60 min

      const { items } = useCartStore.getState();
      const totalDuration = items.reduce(
        (sum, item) => sum + item.service.duration * item.quantity,
        0
      );
      expect(totalDuration).toBe(75);
    });

    it("should calculate totalItems correctly from items", () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockService);
      addItem(mockService2);
      updateQuantity(mockService.id, 3);

      const { items } = useCartStore.getState();
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      expect(totalItems).toBe(4);
    });
  });

  describe("branch and staff", () => {
    it("should set branch info", () => {
      const { setBranch } = useCartStore.getState();
      setBranch(1, "BarberQueue Q1");

      const { branchId, branchName } = useCartStore.getState();
      expect(branchId).toBe(1);
      expect(branchName).toBe("BarberQueue Q1");
    });

    it("should set staff info", () => {
      const { setStaff } = useCartStore.getState();
      setStaff(5, "Nguyễn Văn A");

      const { staffId, staffName } = useCartStore.getState();
      expect(staffId).toBe(5);
      expect(staffName).toBe("Nguyễn Văn A");
    });

    it("should set dateTime", () => {
      const { setDateTime } = useCartStore.getState();
      setDateTime("2024-12-25T14:00:00");

      const { dateTime } = useCartStore.getState();
      expect(dateTime).toBe("2024-12-25T14:00:00");
    });
  });

  describe("clearCart", () => {
    it("should clear all cart data", () => {
      const { addItem, setBranch, setStaff, setDateTime, clearCart } =
        useCartStore.getState();

      addItem(mockService);
      setBranch(1, "Shop");
      setStaff(1, "Staff");
      setDateTime("2024-12-25");

      clearCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(state.branchId).toBeNull();
      expect(state.branchName).toBeNull();
      expect(state.staffId).toBeNull();
      expect(state.staffName).toBeNull();
      expect(state.dateTime).toBeNull();
    });
  });
});
