/**
 * Reviews API Tests
 * Tests for review-related API functions
 */
import { reviewsApi } from "../reviews";
import { apiClient } from "../client";
import {
  createMockAxiosResponse,
  createMockAxiosError,
} from "../../__tests__/test-utils";
import type { Review, ReviewListResponse } from "../../types";

// Mock the apiClient
jest.mock("../client", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
  },
}));

const mockedApiClient = apiClient as jest.Mocked<typeof apiClient>;

const mockReview: Review = {
  id: 1,
  rating: 5,
  comment: "Great haircut!",
  bookingId: 1,
  clientId: 1,
  branchId: 1,
  createdAt: "2024-01-01T00:00:00Z",
};

const mockReviewResponse: ReviewListResponse = {
  data: [mockReview],
  total: 1,
  page: 1,
  limit: 10,
};

describe("Reviews API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("create", () => {
    const createData = {
      rating: 5,
      comment: "Excellent service!",
      bookingId: 1,
    };

    it("should call POST /review", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockReview)
      );

      await reviewsApi.create(createData);

      expect(mockedApiClient.post).toHaveBeenCalledWith("/review", createData);
    });

    it("should return created review", async () => {
      mockedApiClient.post.mockResolvedValueOnce(
        createMockAxiosResponse(mockReview)
      );

      const result = await reviewsApi.create(createData);

      expect(result.rating).toBe(mockReview.rating);
      expect(result.id).toBeDefined();
    });

    it("should throw on invalid rating", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Rating must be between 1 and 5")
      );

      await expect(reviewsApi.create(createData)).rejects.toThrow();
    });

    it("should throw on already reviewed", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(409, "Booking already reviewed")
      );

      await expect(reviewsApi.create(createData)).rejects.toThrow();
    });

    it("should throw on booking not completed", async () => {
      mockedApiClient.post.mockRejectedValueOnce(
        createMockAxiosError(400, "Can only review completed bookings")
      );

      await expect(reviewsApi.create(createData)).rejects.toThrow();
    });
  });

  describe("getByBranchId", () => {
    const branchId = 1;

    it("should call GET /review/branch/:branchId without params", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockReviewResponse)
      );

      await reviewsApi.getByBranchId(branchId);

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/review/branch/${branchId}`,
        { params: undefined }
      );
    });

    it("should call GET /review/branch/:branchId with pagination", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockReviewResponse)
      );

      await reviewsApi.getByBranchId(branchId, { page: 2, limit: 5 });

      expect(mockedApiClient.get).toHaveBeenCalledWith(
        `/review/branch/${branchId}`,
        { params: { page: 2, limit: 5 } }
      );
    });

    it("should return review list response", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse(mockReviewResponse)
      );

      const result = await reviewsApi.getByBranchId(branchId);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
    });

    it("should return empty when no reviews", async () => {
      mockedApiClient.get.mockResolvedValueOnce(
        createMockAxiosResponse({ data: [], total: 0, page: 1, limit: 10 })
      );

      const result = await reviewsApi.getByBranchId(branchId);

      expect(result.data).toHaveLength(0);
    });

    it("should throw on branch not found", async () => {
      mockedApiClient.get.mockRejectedValueOnce(
        createMockAxiosError(404, "Branch not found")
      );

      await expect(reviewsApi.getByBranchId(999)).rejects.toThrow();
    });
  });
});
