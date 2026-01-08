/**
 * Formatters Tests
 * Complete test coverage for formatting utilities
 */
import {
  formatPrice,
  formatDuration,
  formatDateShort,
  formatDateLong,
  formatTime,
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

  it("should handle very large amounts", () => {
    expect(formatPrice(999999999)).toBe("999.999.999đ");
  });

  it("should handle decimal amounts", () => {
    // Intl.NumberFormat behavior varies by locale
    const result = formatPrice(150000.5);
    expect(result).toContain("đ");
    expect(result).toMatch(/150/);
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

  it("should handle single digit minutes", () => {
    expect(formatDuration(5)).toBe("5 phút");
    expect(formatDuration(1)).toBe("1 phút");
  });

  it("should handle large durations", () => {
    expect(formatDuration(180)).toBe("3 giờ");
    expect(formatDuration(195)).toBe("3h15p");
  });

  it("should handle 59 minutes correctly", () => {
    expect(formatDuration(59)).toBe("59 phút");
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

  it("should handle last day of month", () => {
    const date = new Date("2024-12-31");
    expect(formatDateShort(date)).toBe("31/12");
  });

  it("should handle first day of year", () => {
    const date = new Date("2024-01-01");
    expect(formatDateShort(date)).toBe("1/1");
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

  it("should handle Tuesday", () => {
    // December 24, 2024 is Tuesday (T3)
    const date = new Date("2024-12-24");
    expect(formatDateLong(date)).toBe("T3, 24/12/2024");
  });

  it("should handle Thursday", () => {
    // December 26, 2024 is Thursday (T5)
    const date = new Date("2024-12-26");
    expect(formatDateLong(date)).toBe("T5, 26/12/2024");
  });

  it("should handle Friday", () => {
    // December 27, 2024 is Friday (T6)
    const date = new Date("2024-12-27");
    expect(formatDateLong(date)).toBe("T6, 27/12/2024");
  });

  it("should handle Saturday", () => {
    // December 28, 2024 is Saturday (T7)
    const date = new Date("2024-12-28");
    expect(formatDateLong(date)).toBe("T7, 28/12/2024");
  });
});

describe("formatTime", () => {
  it("should format time as HH:mm", () => {
    const date = new Date("2024-12-25T14:30:00");
    const result = formatTime(date);
    // Result depends on locale, but should contain hour and minute
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("should handle midnight", () => {
    const date = new Date("2024-12-25T00:00:00");
    const result = formatTime(date);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("should handle noon", () => {
    const date = new Date("2024-12-25T12:00:00");
    const result = formatTime(date);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });

  it("should handle late evening", () => {
    const date = new Date("2024-12-25T23:59:00");
    const result = formatTime(date);
    expect(result).toMatch(/\d{1,2}:\d{2}/);
  });
});
