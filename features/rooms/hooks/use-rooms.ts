import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getRoomTypes,
  createRoomType,
  getRooms,
  getRoomStatus,
  createRoom,
  bookRoom,
  bookRoomById,
} from "@/features/rooms/services/services";
import {
  BookRoomPlayload,
  CreateRoomTypePayload,
} from "@/features/rooms/types/types";

export const useGetRoomTypes = () => {
  return useQuery({
    queryKey: ["room-types"],
    queryFn: () => getRoomTypes(),
  });
};

export const useCreateRoomType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roomType: CreateRoomTypePayload) => createRoomType(roomType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["room-types"] });
    },
  });
};

// Hook - Fixed: Include parameters in queryKey
export const useGetRooms = (
  hotelId?: string,
  categoryId?: string,
  pageSize?: number,
  pageNumber?: number,
) => {
  return useQuery({
    queryKey: ["rooms", hotelId, categoryId, pageSize, pageNumber], // Fixed: dynamic query key
    queryFn: () => getRooms(hotelId, categoryId, pageSize, pageNumber),
    placeholderData: (prev) => prev,
  });
};

export const useRoomBooking = () => {
  return useQuery({
    queryKey: ["room-status"],
    queryFn: () => getRoomStatus(),
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (formData: FormData) => createRoom(formData),
    onSuccess: (data, Variable: FormData) => {
      queryClient.invalidateQueries({ queryKey: ["rooms"] });
      queryClient.invalidateQueries({
        queryKey: ["roomType", Variable.get("categoryId")],
      });
      queryClient.invalidateQueries({
        queryKey: ["room-status", Variable.get("categoryId")],
      });
    },
  });
};

export const useBookRoom = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (bookingData: BookRoomPlayload) => bookRoom(bookingData),
    onSuccess: (data, Variable: BookRoomPlayload) => {
      queryClient.invalidateQueries({ queryKey: ["room-status"] });
      queryClient.invalidateQueries({
        queryKey: ["room-status", Variable.categoryId],
      });
    },
  });
};

export const useBookRoomById = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (bookingData: BookRoomPlayload) => bookRoomById(bookingData),
    onSuccess: (data, bookingData) => {
      queryClient.invalidateQueries({ queryKey: ["room-status"] });
      queryClient.invalidateQueries({
        queryKey: ["bookings", bookingData.roomId],
      });
    },
  });
};
