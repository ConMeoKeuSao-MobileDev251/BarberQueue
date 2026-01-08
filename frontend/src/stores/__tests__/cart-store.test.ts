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

    it("should also clear promo code and discount", () => {
      const { addItem, setPromo, clearCart } = useCartStore.getState();

      addItem(mockService);
      setPromo("SAVE20", 20);

      clearCart();

      const state = useCartStore.getState();
      expect(state.promoCode).toBeNull();
      expect(state.promoDiscount).toBe(0);
    });
  });

  describe("setBranch staff clearing", () => {
    it("should clear staff when switching to different branch", () => {
      const { setBranch, setStaff } = useCartStore.getState();

      setBranch(1, "Branch 1");
      setStaff(10, "Staff A");

      // Switch to different branch
      setBranch(2, "Branch 2");

      const { staffId, staffName } = useCartStore.getState();
      expect(staffId).toBeNull();
      expect(staffName).toBeNull();
    });

    it("should keep staff when setting same branch", () => {
      const { setBranch, setStaff } = useCartStore.getState();

      setBranch(1, "Branch 1");
      setStaff(10, "Staff A");

      // Set same branch again
      setBranch(1, "Branch 1 Updated");

      const { staffId, staffName } = useCartStore.getState();
      expect(staffId).toBe(10);
      expect(staffName).toBe("Staff A");
    });

    it("should not clear staff when setting first branch", () => {
      const { setBranch, setStaff } = useCartStore.getState();

      // Set staff before branch (edge case)
      setStaff(10, "Staff A");
      setBranch(1, "Branch 1");

      // Staff should remain since branchId was null before
      const { staffId } = useCartStore.getState();
      expect(staffId).toBe(10);
    });
  });

  describe("promo code", () => {
    it("should set promo code and discount", () => {
      const { setPromo } = useCartStore.getState();

      setPromo("SAVE20", 20);

      const { promoCode, promoDiscount } = useCartStore.getState();
      expect(promoCode).toBe("SAVE20");
      expect(promoDiscount).toBe(20);
    });

    it("should clear promo code when set to null", () => {
      const { setPromo } = useCartStore.getState();

      setPromo("SAVE20", 20);
      setPromo(null, 0);

      const { promoCode, promoDiscount } = useCartStore.getState();
      expect(promoCode).toBeNull();
      expect(promoDiscount).toBe(0);
    });

    it("should update promo code", () => {
      const { setPromo } = useCartStore.getState();

      setPromo("SAVE10", 10);
      setPromo("SAVE30", 30);

      const { promoCode, promoDiscount } = useCartStore.getState();
      expect(promoCode).toBe("SAVE30");
      expect(promoDiscount).toBe(30);
    });
  });

  describe("discount calculations", () => {
    it("should calculate discount amount correctly", () => {
      const { addItem, setPromo } = useCartStore.getState();

      addItem(mockService); // 100000
      addItem(mockService2); // 50000
      setPromo("SAVE20", 20); // 20% off

      const { items, promoDiscount } = useCartStore.getState();
      const subtotal = items.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      );
      const discount = Math.round((subtotal * promoDiscount) / 100);

      expect(subtotal).toBe(150000);
      expect(discount).toBe(30000); // 20% of 150000
    });

    it("should calculate final price with discount", () => {
      const { addItem, setPromo } = useCartStore.getState();

      addItem(mockService); // 100000
      setPromo("SAVE50", 50); // 50% off

      const { items, promoDiscount } = useCartStore.getState();
      const subtotal = items.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      );
      const discount = Math.round((subtotal * promoDiscount) / 100);
      const finalPrice = subtotal - discount;

      expect(finalPrice).toBe(50000); // 100000 - 50000
    });

    it("should return 0 discount when no promo", () => {
      const { addItem } = useCartStore.getState();

      addItem(mockService);

      const { items, promoDiscount } = useCartStore.getState();
      const subtotal = items.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      );
      const discount = Math.round((subtotal * promoDiscount) / 100);

      expect(discount).toBe(0);
    });

    it("should handle 100% discount", () => {
      const { addItem, setPromo } = useCartStore.getState();

      addItem(mockService);
      setPromo("FREE100", 100);

      const { items, promoDiscount } = useCartStore.getState();
      const subtotal = items.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      );
      const discount = Math.round((subtotal * promoDiscount) / 100);
      const finalPrice = subtotal - discount;

      expect(finalPrice).toBe(0);
    });

    it("should calculate discount with multiple quantities", () => {
      const { addItem, updateQuantity, setPromo } = useCartStore.getState();

      addItem(mockService); // 100000
      updateQuantity(mockService.id, 3); // 300000 total
      setPromo("SAVE10", 10);

      const { items, promoDiscount } = useCartStore.getState();
      const subtotal = items.reduce(
        (sum, item) => sum + item.service.price * item.quantity,
        0
      );
      const discount = Math.round((subtotal * promoDiscount) / 100);

      expect(subtotal).toBe(300000);
      expect(discount).toBe(30000); // 10% of 300000
    });
  });
});
