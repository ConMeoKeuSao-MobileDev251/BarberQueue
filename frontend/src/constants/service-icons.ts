/**
 * Service Icon Mapping
 * Maps service names/types to local icon assets
 */

export const SERVICE_ICONS: Record<string, number> = {
  // Vietnamese service names
  "cắt tóc": require("../../assets/icons/haircut-service-icon.png"),
  "rửa mặt": require("../../assets/icons/facewash-service-icon.png"),
  "cao mặt": require("../../assets/icons/trimbeard-service-icon.png"),
  "cạo râu": require("../../assets/icons/trimbeard-service-icon.png"),

  // English fallbacks
  "haircut": require("../../assets/icons/haircut-service-icon.png"),
  "facial": require("../../assets/icons/facewash-service-icon.png"),
  "beard": require("../../assets/icons/trimbeard-service-icon.png"),
  "shave": require("../../assets/icons/trimbeard-service-icon.png"),
};

/**
 * Get service icon by name (case-insensitive match)
 */
export function getServiceIcon(serviceName: string): number | null {
  const normalized = serviceName.toLowerCase().trim();

  // Exact match
  if (SERVICE_ICONS[normalized]) {
    return SERVICE_ICONS[normalized];
  }

  // Partial match (contains keyword)
  for (const [key, icon] of Object.entries(SERVICE_ICONS)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return icon;
    }
  }

  return null;
}
