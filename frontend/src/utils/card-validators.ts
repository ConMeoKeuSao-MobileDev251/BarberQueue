/**
 * Card Validation Utilities
 * Pure functions for credit card validation and formatting
 */

/**
 * Format card number with spaces every 4 digits
 * @example "1234567812345678" -> "1234 5678 1234 5678"
 */
export function formatCardNumber(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  const groups = cleaned.match(/.{1,4}/g);
  return groups ? groups.join(" ") : cleaned;
}

/**
 * Format expiry date as MM/YY
 * @example "1225" -> "12/25"
 */
export function formatExpiry(value: string): string {
  const cleaned = value.replace(/\D/g, "");
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
  }
  return cleaned;
}

/**
 * Validate card number (16 digits)
 */
export function validateCardNumber(value: string): boolean {
  const cleaned = value.replace(/\s/g, "");
  return cleaned.length === 16 && /^\d+$/.test(cleaned);
}

/**
 * Validate expiry date (MM/YY format, month 1-12, year >= 24)
 */
export function validateExpiry(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})$/);
  if (!match) return false;
  const month = parseInt(match[1], 10);
  const year = parseInt(match[2], 10);
  return month >= 1 && month <= 12 && year >= 24;
}

/**
 * Validate CVV (3-4 digits)
 */
export function validateCvv(value: string): boolean {
  return value.length >= 3 && value.length <= 4 && /^\d+$/.test(value);
}

/**
 * Detect card type from number prefix
 */
export function getCardType(number: string): "Visa" | "Mastercard" | "Amex" | "" {
  const cleaned = number.replace(/\s/g, "");
  if (cleaned.startsWith("4")) return "Visa";
  if (cleaned.startsWith("5")) return "Mastercard";
  if (cleaned.startsWith("34") || cleaned.startsWith("37")) return "Amex";
  return "";
}
