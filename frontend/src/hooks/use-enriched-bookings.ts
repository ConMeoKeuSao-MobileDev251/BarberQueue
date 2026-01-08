/**
 * Hook to enrich booking data with branch and staff details
 * Fetches all branches once, then staff by branchId, then merges into bookings
 */
import { useQuery, useQueries } from "@tanstack/react-query";
import { useMemo } from "react";
import { branchesApi } from "@/src/api/branches";
import type { Booking, Branch, User } from "@/src/types";

export interface EnrichedBooking extends Booking {
  branch?: Branch;
  staffUser?: User;
}

export function useEnrichedBookings(bookings: Booking[] | undefined) {
  // 1. Fetch ALL branches (single call, cached 10 min)
  const { data: allBranches = [], isLoading: branchesLoading } = useQuery({
    queryKey: ["branches", "all"],
    queryFn: () => branchesApi.getAll(),
    staleTime: 10 * 60 * 1000,
  });

  // 2. Build branch lookup map
  const branchMap = useMemo(
    () => new Map<number, Branch>(allBranches.map((b) => [b.id, b])),
    [allBranches]
  );

  // 3. Extract unique branchIds from bookings
  const branchIds = useMemo(
    () => [...new Set(bookings?.map((b) => b.branchId) || [])],
    [bookings]
  );

  // 4. Fetch staff for each branch (via availability endpoint)
  const staffQueries = useQueries({
    queries: branchIds.map((branchId) => ({
      queryKey: ["branch-staff", branchId],
      queryFn: () => branchesApi.getStaffByBranch(branchId),
      staleTime: 5 * 60 * 1000,
      enabled: branchId > 0,
    })),
  });

  // 5. Build staff lookup map (combine all staff from all branches)
  const staffMap = useMemo(() => {
    const map = new Map<number, User>();
    staffQueries.forEach((q) => {
      if (q.data) {
        q.data.forEach((staff) => map.set(staff.id, staff));
      }
    });
    return map;
  }, [staffQueries]);

  // 6. Enrich bookings with branch and staff data
  const enrichedBookings: EnrichedBooking[] = useMemo(
    () =>
      (bookings || []).map((booking) => ({
        ...booking,
        branch: branchMap.get(booking.branchId),
        staffUser: staffMap.get(booking.staffId),
      })),
    [bookings, branchMap, staffMap]
  );

  const isLoading = branchesLoading || staffQueries.some((q) => q.isLoading);

  return { enrichedBookings, isLoading };
}
