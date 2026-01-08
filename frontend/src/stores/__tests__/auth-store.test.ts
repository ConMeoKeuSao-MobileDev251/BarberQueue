/**
 * Auth Store Tests
 * Tests for authentication state management
 */
import * as SecureStore from "expo-secure-store";
import { useAuthStore } from "../auth-store";
import { authApi } from "../../api/auth";
import { mockUser, mockToken } from "../../__tests__/test-utils";

// Mock SecureStore (already in jest.setup.js)
const mockedSecureStore = SecureStore as jest.Mocked<typeof SecureStore>;

// Mock authApi
jest.mock("../../api/auth", () => ({
  authApi: {
    logout: jest.fn(),
  },
}));

const mockedAuthApi = authApi as jest.Mocked<typeof authApi>;

// Helper to reset store between tests
const resetStore = () => {
  useAuthStore.setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });
};

describe("Auth Store", () => {
  beforeEach(() => {
    resetStore();
    jest.clearAllMocks();
  });

  describe("initial state", () => {
    it("should have null user", () => {
      const { user } = useAuthStore.getState();
      expect(user).toBeNull();
    });

    it("should have null token", () => {
      const { token } = useAuthStore.getState();
      expect(token).toBeNull();
    });

    it("should not be authenticated", () => {
      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it("should be loading initially", () => {
      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(true);
    });
  });

  describe("setAuth", () => {
    it("should set user and token", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);

      const { user, token } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
      expect(token).toBe(mockToken);
    });

    it("should set isAuthenticated to true", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(true);
    });

    it("should set isLoading to false", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });

    it("should persist token to SecureStore", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);

      expect(mockedSecureStore.setItemAsync).toHaveBeenCalled();
    });
  });

  describe("logout", () => {
    beforeEach(async () => {
      // Set up authenticated state
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);
      mockedAuthApi.logout.mockResolvedValue(undefined);
      mockedSecureStore.deleteItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);
    });

    it("should call authApi.logout", async () => {
      const { logout } = useAuthStore.getState();
      await logout();

      expect(mockedAuthApi.logout).toHaveBeenCalled();
    });

    it("should clear user and token", async () => {
      const { logout } = useAuthStore.getState();
      await logout();

      const { user, token } = useAuthStore.getState();
      expect(user).toBeNull();
      expect(token).toBeNull();
    });

    it("should set isAuthenticated to false", async () => {
      const { logout } = useAuthStore.getState();
      await logout();

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it("should set isLoading to false", async () => {
      const { logout } = useAuthStore.getState();
      await logout();

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });

    it("should continue logout even if API fails", async () => {
      mockedAuthApi.logout.mockRejectedValueOnce(new Error("API Error"));

      const { logout } = useAuthStore.getState();
      await logout();

      const { isAuthenticated } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
    });

    it("should delete token from SecureStore", async () => {
      const { logout } = useAuthStore.getState();
      await logout();

      expect(mockedSecureStore.deleteItemAsync).toHaveBeenCalled();
    });
  });

  describe("setLoading", () => {
    it("should set loading to true", () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(true);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(true);
    });

    it("should set loading to false", () => {
      const { setLoading } = useAuthStore.getState();
      setLoading(false);

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe("setUser", () => {
    it("should update user data", () => {
      const { setUser } = useAuthStore.getState();
      setUser(mockUser);

      const { user } = useAuthStore.getState();
      expect(user).toEqual(mockUser);
    });

    it("should update partial user fields", () => {
      const { setUser } = useAuthStore.getState();
      const updatedUser = { ...mockUser, fullName: "Updated Name" };
      setUser(updatedUser);

      const { user } = useAuthStore.getState();
      expect(user?.fullName).toBe("Updated Name");
    });
  });

  describe("restoreAuth", () => {
    it("should restore token and user from SecureStore", async () => {
      mockedSecureStore.getItemAsync
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(JSON.stringify(mockUser));

      const { restoreAuth } = useAuthStore.getState();
      await restoreAuth();

      const { token, user, isAuthenticated } = useAuthStore.getState();
      expect(token).toBe(mockToken);
      expect(user).toEqual(mockUser);
      expect(isAuthenticated).toBe(true);
    });

    it("should set isLoading to false after restore", async () => {
      mockedSecureStore.getItemAsync
        .mockResolvedValueOnce(mockToken)
        .mockResolvedValueOnce(JSON.stringify(mockUser));

      const { restoreAuth } = useAuthStore.getState();
      await restoreAuth();

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });

    it("should handle missing token gracefully", async () => {
      mockedSecureStore.getItemAsync
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(null);

      const { restoreAuth } = useAuthStore.getState();
      await restoreAuth();

      const { isAuthenticated, isLoading } = useAuthStore.getState();
      expect(isAuthenticated).toBe(false);
      expect(isLoading).toBe(false);
    });

    it("should handle SecureStore error gracefully", async () => {
      mockedSecureStore.getItemAsync.mockRejectedValueOnce(
        new Error("SecureStore error")
      );

      const { restoreAuth } = useAuthStore.getState();
      await restoreAuth();

      const { isLoading } = useAuthStore.getState();
      expect(isLoading).toBe(false);
    });
  });

  describe("selector hooks", () => {
    it("useUser should return user", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);

      const user = useAuthStore.getState().user;
      expect(user).toEqual(mockUser);
    });

    it("useIsAuthenticated should return auth status", async () => {
      mockedSecureStore.setItemAsync.mockResolvedValue(undefined);

      const { setAuth } = useAuthStore.getState();
      await setAuth(mockUser, mockToken);

      const isAuthenticated = useAuthStore.getState().isAuthenticated;
      expect(isAuthenticated).toBe(true);
    });
  });
});
