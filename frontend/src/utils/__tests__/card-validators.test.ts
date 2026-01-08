/**
 * Card Validators Tests
 */
import {
  formatCardNumber,
  formatExpiry,
  validateCardNumber,
  validateExpiry,
  validateCvv,
  getCardType,
} from "../card-validators";

describe("formatCardNumber", () => {
  it("should format 16 digits with spaces", () => {
    expect(formatCardNumber("1234567890123456")).toBe("1234 5678 9012 3456");
  });

  it("should handle partial input", () => {
    expect(formatCardNumber("1234")).toBe("1234");
    expect(formatCardNumber("12345678")).toBe("1234 5678");
  });

  it("should remove non-digit characters", () => {
    expect(formatCardNumber("1234-5678-9012-3456")).toBe("1234 5678 9012 3456");
    expect(formatCardNumber("1234 5678 9012 3456")).toBe("1234 5678 9012 3456");
  });

  it("should handle empty string", () => {
    expect(formatCardNumber("")).toBe("");
  });
});

describe("formatExpiry", () => {
  it("should format as MM/YY", () => {
    expect(formatExpiry("1225")).toBe("12/25");
  });

  it("should handle partial input", () => {
    expect(formatExpiry("1")).toBe("1");
    expect(formatExpiry("12")).toBe("12/");
    expect(formatExpiry("123")).toBe("12/3");
  });

  it("should remove non-digit characters", () => {
    expect(formatExpiry("12/25")).toBe("12/25");
  });

  it("should handle empty string", () => {
    expect(formatExpiry("")).toBe("");
  });
});

describe("validateCardNumber", () => {
  it("should accept valid 16-digit card number", () => {
    expect(validateCardNumber("1234567890123456")).toBe(true);
    expect(validateCardNumber("1234 5678 9012 3456")).toBe(true);
  });

  it("should reject too short numbers", () => {
    expect(validateCardNumber("123456789012345")).toBe(false);
    expect(validateCardNumber("1234")).toBe(false);
  });

  it("should reject too long numbers", () => {
    expect(validateCardNumber("12345678901234567")).toBe(false);
  });

  it("should reject non-digit characters", () => {
    expect(validateCardNumber("1234abcd56781234")).toBe(false);
  });

  it("should handle empty string", () => {
    expect(validateCardNumber("")).toBe(false);
  });
});

describe("validateExpiry", () => {
  it("should accept valid MM/YY format", () => {
    expect(validateExpiry("12/25")).toBe(true);
    expect(validateExpiry("01/30")).toBe(true);
  });

  it("should reject invalid month", () => {
    expect(validateExpiry("00/25")).toBe(false);
    expect(validateExpiry("13/25")).toBe(false);
  });

  it("should reject past years (before 24)", () => {
    expect(validateExpiry("12/23")).toBe(false);
    expect(validateExpiry("12/20")).toBe(false);
  });

  it("should reject invalid format", () => {
    expect(validateExpiry("1225")).toBe(false);
    expect(validateExpiry("12-25")).toBe(false);
    expect(validateExpiry("12/2")).toBe(false);
  });

  it("should handle empty string", () => {
    expect(validateExpiry("")).toBe(false);
  });
});

describe("validateCvv", () => {
  it("should accept 3-digit CVV", () => {
    expect(validateCvv("123")).toBe(true);
    expect(validateCvv("000")).toBe(true);
  });

  it("should accept 4-digit CVV (Amex)", () => {
    expect(validateCvv("1234")).toBe(true);
  });

  it("should reject too short CVV", () => {
    expect(validateCvv("12")).toBe(false);
    expect(validateCvv("1")).toBe(false);
  });

  it("should reject too long CVV", () => {
    expect(validateCvv("12345")).toBe(false);
  });

  it("should reject non-digit characters", () => {
    expect(validateCvv("12a")).toBe(false);
    expect(validateCvv("abc")).toBe(false);
  });

  it("should handle empty string", () => {
    expect(validateCvv("")).toBe(false);
  });
});

describe("getCardType", () => {
  it("should detect Visa cards (starts with 4)", () => {
    expect(getCardType("4111111111111111")).toBe("Visa");
    expect(getCardType("4000 0000 0000 0000")).toBe("Visa");
  });

  it("should detect Mastercard (starts with 5)", () => {
    expect(getCardType("5111111111111111")).toBe("Mastercard");
    expect(getCardType("5500 0000 0000 0000")).toBe("Mastercard");
  });

  it("should detect Amex (starts with 34 or 37)", () => {
    expect(getCardType("3411111111111111")).toBe("Amex");
    expect(getCardType("3711111111111111")).toBe("Amex");
  });

  it("should return empty for unknown card types", () => {
    expect(getCardType("6011111111111111")).toBe("");
    expect(getCardType("1234567890123456")).toBe("");
  });

  it("should handle empty string", () => {
    expect(getCardType("")).toBe("");
  });
});
