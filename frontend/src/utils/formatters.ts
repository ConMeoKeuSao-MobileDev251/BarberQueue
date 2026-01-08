/**
 * Formatting Utilities
 * Pure functions for formatting values
 */

/**
 * Format price in Vietnamese dong
 * @example 150000 -> "150.000đ"
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("vi-VN").format(amount) + "đ";
}

/**
 * Format duration in minutes to human-readable string
 * @example 90 -> "1h30p"
 * @example 45 -> "45 phút"
 * @example 60 -> "1 giờ"
 */
export function formatDuration(mins: number): string {
  if (mins < 60) return `${mins} phút`;
  const hours = Math.floor(mins / 60);
  const remainingMins = mins % 60;
  return remainingMins > 0 ? `${hours}h${remainingMins}p` : `${hours} giờ`;
}

/**
 * Format date to Vietnamese short format
 * @example new Date("2024-12-25") -> "25/12"
 */
export function formatDateShort(date: Date): string {
  return `${date.getDate()}/${date.getMonth() + 1}`;
}

/**
 * Format date to Vietnamese long format with weekday
 * @example new Date("2024-12-25") -> "T4, 25/12/2024"
 */
export function formatDateLong(date: Date): string {
  const weekdays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
  const day = weekdays[date.getDay()];
  return `${day}, ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
}

/**
 * Format time from Date object
 * @example new Date("2024-12-25T14:30:00") -> "14:30"
 */
export function formatTime(date: Date): string {
  return date.toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}
