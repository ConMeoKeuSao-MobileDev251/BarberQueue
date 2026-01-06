/**
 * Reviews API Functions
 */
import { apiClient } from "./client";
import type {
  Review,
  CreateReviewRequest,
  ReviewListResponse,
  PaginationQuery,
} from "../types";

export const reviewsApi = {
  /**
   * Create a review for a completed booking
   * @requires CLIENT role
   */
  create: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>("/review", data);
    return response.data;
  },

  /**
   * Get reviews for a branch (paginated)
   */
  getByBranchId: async (
    branchId: number,
    params?: PaginationQuery
  ): Promise<ReviewListResponse> => {
    const response = await apiClient.get<ReviewListResponse>(
      `/review/branch/${branchId}`,
      { params }
    );
    return response.data;
  },
};
