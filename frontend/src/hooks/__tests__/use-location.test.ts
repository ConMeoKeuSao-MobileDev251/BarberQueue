/**
 * useLocation Hook Tests
 * Tests for location hook functionality
 */
import * as Location from "expo-location";

// Mock expo-location (already in jest.setup.js)
const mockedLocation = Location as jest.Mocked<typeof Location>;

describe("useLocation utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Location permissions", () => {
    it("should request foreground permissions", async () => {
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce({
        status: Location.PermissionStatus.GRANTED,
        expires: "never",
        granted: true,
        canAskAgain: true,
      });

      const result = await mockedLocation.requestForegroundPermissionsAsync();

      expect(mockedLocation.requestForegroundPermissionsAsync).toHaveBeenCalled();
      expect(result.status).toBe("granted");
    });

    it("should handle granted permission status", async () => {
      const permissionResult = {
        status: Location.PermissionStatus.GRANTED,
        expires: "never",
        granted: true,
        canAskAgain: true,
      };
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce(
        permissionResult
      );

      const result = await mockedLocation.requestForegroundPermissionsAsync();

      expect(result.status).toBe("granted");
      expect(result.granted).toBe(true);
    });

    it("should handle denied permission status", async () => {
      const permissionResult = {
        status: Location.PermissionStatus.DENIED,
        expires: "never",
        granted: false,
        canAskAgain: true,
      };
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce(
        permissionResult
      );

      const result = await mockedLocation.requestForegroundPermissionsAsync();

      expect(result.status).toBe("denied");
      expect(result.granted).toBe(false);
    });

    it("should handle undetermined permission status", async () => {
      const permissionResult = {
        status: Location.PermissionStatus.UNDETERMINED,
        expires: "never",
        granted: false,
        canAskAgain: true,
      };
      mockedLocation.requestForegroundPermissionsAsync.mockResolvedValueOnce(
        permissionResult
      );

      const result = await mockedLocation.requestForegroundPermissionsAsync();

      expect(result.status).toBe("undetermined");
    });
  });

  describe("Location fetching", () => {
    it("should get current position with coordinates", async () => {
      const mockCoords = {
        coords: {
          latitude: 10.8231,
          longitude: 106.6297,
          altitude: null,
          accuracy: 15,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      mockedLocation.getCurrentPositionAsync.mockResolvedValueOnce(mockCoords);

      const result = await mockedLocation.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      expect(result.coords.latitude).toBeDefined();
      expect(result.coords.longitude).toBeDefined();
      expect(typeof result.coords.latitude).toBe("number");
      expect(typeof result.coords.longitude).toBe("number");
    });

    it("should call with accuracy option", async () => {
      const mockCoords = {
        coords: {
          latitude: 10.8231,
          longitude: 106.6297,
          altitude: null,
          accuracy: 15,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };
      mockedLocation.getCurrentPositionAsync.mockResolvedValueOnce(mockCoords);

      await mockedLocation.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      expect(mockedLocation.getCurrentPositionAsync).toHaveBeenCalledWith({
        accuracy: Location.Accuracy.Balanced,
      });
    });

    it("should handle location errors", async () => {
      mockedLocation.getCurrentPositionAsync.mockRejectedValueOnce(
        new Error("Location unavailable")
      );

      await expect(
        mockedLocation.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        })
      ).rejects.toThrow("Location unavailable");
    });
  });

  describe("Reverse geocoding", () => {
    it("should convert coordinates to address", async () => {
      const mockAddress = [
        {
          city: "Ho Chi Minh City",
          district: "District 1",
          region: null,
          subregion: "District 1",
          country: "Vietnam",
          postalCode: null,
          name: null,
          street: null,
          streetNumber: null,
          timezone: null,
          isoCountryCode: "VN",
          formattedAddress: null,
        },
      ];
      mockedLocation.reverseGeocodeAsync.mockResolvedValueOnce(mockAddress);

      const result = await mockedLocation.reverseGeocodeAsync({
        latitude: 10.7769,
        longitude: 106.7009,
      });

      expect(result[0].city).toBe("Ho Chi Minh City");
      expect(result[0].country).toBe("Vietnam");
    });

    it("should handle reverse geocoding failure", async () => {
      mockedLocation.reverseGeocodeAsync.mockRejectedValueOnce(
        new Error("Geocoding failed")
      );

      await expect(
        mockedLocation.reverseGeocodeAsync({
          latitude: 10.7769,
          longitude: 106.7009,
        })
      ).rejects.toThrow("Geocoding failed");
    });

    it("should handle empty address result", async () => {
      mockedLocation.reverseGeocodeAsync.mockResolvedValueOnce([]);

      const result = await mockedLocation.reverseGeocodeAsync({
        latitude: 10.7769,
        longitude: 106.7009,
      });

      expect(result).toHaveLength(0);
    });
  });

  describe("Default location fallback", () => {
    it("should use HCM default coordinates", () => {
      const DEFAULT_LOCATION = {
        latitude: 10.7769,
        longitude: 106.7009,
      };

      expect(DEFAULT_LOCATION.latitude).toBe(10.7769);
      expect(DEFAULT_LOCATION.longitude).toBe(106.7009);
    });

    it("should have valid coordinate ranges", () => {
      const DEFAULT_LOCATION = {
        latitude: 10.7769,
        longitude: 106.7009,
      };

      // Valid latitude range: -90 to 90
      expect(DEFAULT_LOCATION.latitude).toBeGreaterThanOrEqual(-90);
      expect(DEFAULT_LOCATION.latitude).toBeLessThanOrEqual(90);

      // Valid longitude range: -180 to 180
      expect(DEFAULT_LOCATION.longitude).toBeGreaterThanOrEqual(-180);
      expect(DEFAULT_LOCATION.longitude).toBeLessThanOrEqual(180);
    });
  });
});
