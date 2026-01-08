/**
 * API Client Tests
 * Tests for axios client configuration and helper functions
 */
import * as SecureStore from "expo-secure-store";
import {
  hasValidToken,
  saveAuthData,
  clearAuthData,
  getStoredAuthData,
} from "../client";
import { STORAGE_KEYS } from "../../constants/config";
import { mockUser, mockToken } from "../../__tests__/test-utils";

// Mock SecureStore is already configured in jest.setup.js
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

describe("API Client Helper Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("hasValidToken", () => {
    it("should return true when token exists", async () => {
      mockedSecureStore.getItemAsync.mockResolvedValueOnce(mockToken);

      const result = await hasValidToken();

      expect(result).toBe(true);
      expect(mockedSecureStore.getItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN
      );
    });

    it("should return false when token is null", async () => {
      mockedSecureStore.getItemAsync.mockResolvedValueOnce(null);

      const result = await hasValidToken();

      expect(result).toBe(false);
    });

    it("should return false when token is empty string", async () => {
      mockedSecureStore.getItemAsync.mockResolvedValueOnce("");

      const result = await hasValidToken();

      expect(result).toBe(false);
    });

    it("should return false when SecureStore throws error", async () => {
      mockedSecureStore.getItemAsync.mockRejectedValueOnce(
        new Error("SecureStore not available")
      );

      const result = await hasValidToken();

      expect(result).toBe(false);
    });
  });

  describe("saveAuthData", () => {
    it("should save token and user data to SecureStore", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      await saveAuthData(mockToken, mockUser);

      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledTimes(2);
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN,
        mockToken
      );
      expect(mockedSecureStore.setItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA,
        JSON.stringify(mockUser)
      );
    });

    it("should handle SecureStore errors gracefully", async () => {
      mockedSecureStore.setItemAsync.mockRejectedValue(
        new Error("SecureStore not available")
      );

      // Should not throw
      await expect(saveAuthData(mockToken, mockUser)).resolves.not.toThrow();
    });
  });

  describe("clearAuthData", () => {
    it("should delete token and user data from SecureStore", async () => {
      mockedSecureStore.deleteItemAsync.mockResolvedValue(undefined);

      await clearAuthData();

      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledTimes(2);
      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.AUTH_TOKEN
      );
      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalledWith(
        STORAGE_KEYS.USER_DATA
      );
    });

    it("should handle SecureStore errors gracefully", async () => {
      mockedSecureStore.deleteItemAsync.mockRejectedValue(
        new Error("SecureStore not available")
      );

      // Should not throw
      await expect(clearAuthData()).resolves.not.toThrow();
    });
  });

  describe("getStoredAuthData", () => {
    it("should return token and user when both exist", async () => {
      mockedSecureStore.getItemAsync
        .mockResolvedValueOnce(mockToken) // First call for token
        .mockResolvedValueOnce(JSON.stringify(mockUser)); // Second call for user

      const result = await getStoredAuthData();

      expect(result.token).toBe(mockToken);
      expect(result.user).toEqual(mockUser);
    });

    it("should return null user when user data is missing", async () => {
      mockedSecureStore.getItemAsync
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(null);

      const result = await getStoredAuthData();

      expect(result.token).toBe(mockToken);
      expect(result.user).toBeNull();
    });

    it("should return null token when token is missing", async () => {
      mockedSecureStore.getItemAsync
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(JSON.stringify(mockUser));

      const result = await getStoredAuthData();

      expect(result.token).toBeNull();
    });

    it("should return both null when SecureStore throws error", async () => {
      mockedSecureStore.getItemAsync.mockRejectedValue(
        new Error("SecureStore not available")
      );

      const result = await getStoredAuthData();

      expect(result.token).toBeNull();
      expect(result.user).toBeNull();
    });
  });
});
