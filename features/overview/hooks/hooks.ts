import { getUserDetails } from "@/components/api/service";
import { useQuery } from "@tanstack/react-query";
import {
  getOverview,
  bookingCount,
  serviceBookings,
  getLatestBookings,
} from "@/features/overview/services/services";

export type Timeframe = "week" | "month" | "year";

export function useUserDetails(isEnabled: boolean) {
  return useQuery({
    queryKey: ["userDetails"],
    queryFn: () => getUserDetails(),
    enabled: isEnabled,
  });
}

export function useOverview(timeframe: "today" | "week" | "month" | "year") {
  return useQuery({
    queryKey: ["overview", timeframe],
    queryFn: () => getOverview(timeframe),
  });
}

export function useBookingCount(timeframe: Timeframe) {
  return useQuery({
    queryKey: ["bookingCount", timeframe],
    queryFn: () => bookingCount(timeframe),
  });
}

export function useServiceBookings(timeframe: Timeframe) {
  return useQuery({
    queryKey: ["serviceBookings", timeframe],
    queryFn: () => serviceBookings(timeframe),
  });
}

export function useLatestBookings() {
  return useQuery({
    queryKey: ["latestBookings"],
    queryFn: () => getLatestBookings(),
  });
}
