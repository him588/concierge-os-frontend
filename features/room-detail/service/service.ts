import apiClient from "@/components/api/service-provider";
import { RoomBookingParams, RoomBookingStatus } from "../types/types";

export function getRoomDetails(roomId: string) {
  return apiClient.get(`/room/get-room-details/${roomId}`);
}

export function getBookingsCount(roomId: string) {
  return apiClient.get(`/room-bookings/get-booking-count/${roomId}`);
}

export function updateRoomStatus(
  roomId: string,
  status: "available" | "maintenance",
) {
  return apiClient.post(`/room/change-status`, { roomId, status });
}

export function getRoomBookingsByStatus(params: RoomBookingParams = {}) {
  return apiClient.get("/room-bookings", { params });
}

export function getRoomBookings(params: RoomBookingParams) {
  return apiClient.get("/room-bookings/dynamic-bookings", { params });
}

export function updateRoomBookingStatus(updadeBookingParams: {
  id: string;
  status: RoomBookingStatus;
}) {
  const { id, status } = updadeBookingParams;
  return apiClient.put(`/room-bookings/${id}`, { status });
}
