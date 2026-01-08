/**
 * useLocation Hook
 * Gets and manages user's current GPS location for branch search
 */
import { useState, useEffect } from "react";
import * as Location from "expo-location";

const LOCATION_TIMEOUT_MS = 10000; // 10s timeout

// Default fallback (Ho Chi Minh City center)
const DEFAULT_LOCATION = {
  latitude: 10.7769,
  longitude: 106.7009,
};

const DEFAULT_LOCATION_NAME = "TP. Hồ Chí Minh";

interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  };
  locationName: string | null;
  isLoading: boolean;
  error: string | null;
  permissionStatus: Location.PermissionStatus | null;
}

/**
 * Wraps a promise with a timeout
 */
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error("Location timeout")), ms)
    ),
  ]);
};

/**
 * Hook to get user's current location with reverse geocoding
 * Falls back to HCM center if permission denied or error
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: DEFAULT_LOCATION,
    locationName: null,
    isLoading: true,
    error: null,
    permissionStatus: null,
  });

  const requestLocation = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      // Request foreground permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      setState((prev) => ({ ...prev, permissionStatus: status }));

      if (status !== "granted") {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: "Permission denied",
          locationName: DEFAULT_LOCATION_NAME,
        }));
        return;
      }

      // Get current position with timeout to prevent hanging
      const location = await withTimeout(
        Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        }),
        LOCATION_TIMEOUT_MS
      );

      const coords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      // Reverse geocode for display name
      let locationName: string | null = null;
      try {
        const [address] = await Location.reverseGeocodeAsync(coords);
        if (address) {
          const district = address.district || address.subregion;
          const city = address.city || address.region;
          locationName =
            district && city ? `${district}, ${city}` : city || district || null;
        }
      } catch {
        // Reverse geocoding failed, use coords as fallback
        locationName = `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      }

      setState({
        coords,
        locationName,
        isLoading: false,
        error: null,
        permissionStatus: status,
      });
    } catch (err) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to get location",
        locationName: DEFAULT_LOCATION_NAME,
      }));
    }
  };

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return {
    ...state,
    refresh: requestLocation,
    isUsingDefault:
      state.coords.latitude === DEFAULT_LOCATION.latitude &&
      state.coords.longitude === DEFAULT_LOCATION.longitude,
  };
}
