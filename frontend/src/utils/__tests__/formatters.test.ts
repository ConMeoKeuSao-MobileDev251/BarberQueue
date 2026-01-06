/**
 * Formatters Tests
 */
import {
  formatPrice,
  formatDuration,
  formatDateShort,
  formatDateLong,
} from "../formatters";

describe("formatPrice", () => {
  it("should format price in Vietnamese dong", () => {
    expect(formatPrice(150000)).toBe("150.000đ");
    expect(formatPrice(1500000)).toBe("1.500.000đ");
  });

  it("should handle small amounts", () => {
    expect(formatPrice(100)).toBe("100đ");
    expect(formatPrice(1000)).toBe("1.000đ");
  });

  it("should handle zero", () => {
    expect(formatPrice(0)).toBe("0đ");
  });

  it("should handle large amounts", () => {
    expect(formatPrice(10000000)).toBe("10.000.000đ");
  });
});

describe("formatDuration", () => {
  it("should format minutes under 60", () => {
    expect(formatDuration(30)).toBe("30 phút");
    expect(formatDuration(45)).toBe("45 phút");
  });

  it("should format exactly 60 minutes", () => {
    expect(formatDuration(60)).toBe("1 giờ");
  });

  it("should format hours with remaining minutes", () => {
    expect(formatDuration(90)).toBe("1h30p");
    expect(formatDuration(75)).toBe("1h15p");
  });

  it("should format multiple hours", () => {
    expect(formatDuration(120)).toBe("2 giờ");
    expect(formatDuration(150)).toBe("2h30p");
  });

  it("should handle zero", () => {
    expect(formatDuration(0)).toBe("0 phút");
  });
});

describe("formatDateShort", () => {
  it("should format date as dd/mm", () => {
    const date = new Date("2024-12-25");
    expect(formatDateShort(date)).toBe("25/12");
  });

  it("should handle single digit day/month", () => {
    const date = new Date("2024-01-05");
    expect(formatDateShort(date)).toBe("5/1");
  });
});

describe("formatDateLong", () => {
  it("should format with Vietnamese weekday", () => {
    // December 25, 2024 is Wednesday (T4)
    const date = new Date("2024-12-25");
    expect(formatDateLong(date)).toBe("T4, 25/12/2024");
  });

  it("should handle Sunday", () => {
    // December 22, 2024 is Sunday (CN)
    const date = new Date("2024-12-22");
    expect(formatDateLong(date)).toBe("CN, 22/12/2024");
  });

  it("should handle Monday", () => {
    // December 23, 2024 is Monday (T2)
    const date = new Date("2024-12-23");
    expect(formatDateLong(date)).toBe("T2, 23/12/2024");
  });
});
