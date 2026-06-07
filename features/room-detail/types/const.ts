import { FilterType, RoomBookingStatus } from "./types";

export const bookingStatusConfig: Record<
  RoomBookingStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  [RoomBookingStatus.PENDING]: {
    label: "Pending",
    bg: "bg-yellow-50",
    text: "text-yellow-700",
    border: "border-yellow-200",
    dot: "bg-yellow-300",
  },
  [RoomBookingStatus.CONFIRMED]: {
    label: "Confirmed",
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
    dot: "bg-blue-300",
  },
  [RoomBookingStatus.CHECKED_IN]: {
    label: "Checked in",
    bg: "bg-green-50",
    text: "text-green-700",
    border: "border-green-200",
    dot: "bg-green-300",
  },
  [RoomBookingStatus.CHECKED_OUT]: {
    label: "Checked out",
    bg: "bg-gray-50",
    text: "text-gray-700",
    border: "border-gray-200",
    dot: "bg-gray-300",
  },
  [RoomBookingStatus.CANCELLED]: {
    label: "Cancelled",
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    dot: "bg-red-300",
  },
};

export const Filters: FilterType[] = [
  {
    type: "All",
    value: "",
  },
  {
    type: "Confirmed",
    value: RoomBookingStatus.CONFIRMED,
  },
  {
    type: "Pending",
    value: RoomBookingStatus.PENDING,
  },
  {
    type: "Cancelled",
    value: RoomBookingStatus.CANCELLED,
  },
  {
    type: "Check-In",
    value: RoomBookingStatus.CHECKED_IN,
  },
  {
    type: "Check-Out",
    value: RoomBookingStatus.CHECKED_OUT,
  },
];
