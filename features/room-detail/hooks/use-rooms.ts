import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getBookingsCount,
  getRoomBookings,
  getRoomDetails,
  updateRoomBookingStatus,
  updateRoomStatus,
} from "../service/service";
import { RoomBookingParams, RoomBookingStatus } from "../types/types";

export function useRoomDetails(id: string) {
  return useQuery({
    queryKey: ["room", id],
    queryFn: () => getRoomDetails(id),
  });
}

export function useRoomBookingsCount(id: string) {
  return useQuery({
    queryKey: ["booking-count", id],
    queryFn: () => getBookingsCount(id),
  });
}

export function useUpdateRoomStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      roomId,
      status,
    }: {
      roomId: string;
      status: "available" | "maintenance";
    }) => updateRoomStatus(roomId, status),
    onSuccess: (data, variable) => {
      queryClient.invalidateQueries({ queryKey: ["room-status"] });
      queryClient.invalidateQueries({ queryKey: ["room", variable.roomId] });
    },
  });
}

export function useGetDynamicRoomBookings(params: RoomBookingParams) {
  return useQuery({
    queryKey: [
      "bookings",
      params.roomId,
      params.status,
      params.offset,
      params.pageSize,
    ],
    queryFn: () => getRoomBookings(params),
  });
}

export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (updateBookingParams: {
      id: string;
      status: RoomBookingStatus;
    }) => updateRoomBookingStatus(updateBookingParams),
    onSuccess(data, variables) {
      queryClient.invalidateQueries({ queryKey: ["bookings", variables.id] });
    },
  });
}
