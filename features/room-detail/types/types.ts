export interface Room {
  id: string;
  roomTypeId: string;
  hotelId: string;
  roomNumber: string;
  floor: string;
  status: "available" | "maintenance";
  images: string[];
  createdAt: string;
  updatedAt: string;
  roomType?: {
    type: string;
    price: number;
    maxGuest: number;
    color?: string;
    tags?: string[];
  };
}

export enum RoomBookingStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CHECKED_IN = "checked_in",
  CHECKED_OUT = "checked_out",
  CANCELLED = "cancelled",
}

export interface RoomBookingParams {
  offset?: number;
  pageSize?: number;
  status?:
    | "pending"
    | "confirmed"
    | "checked_in"
    | "checked_out"
    | "cancelled"
    | "";
  search?: string;
  roomId?: string;
  roomType?: string;
}

export interface FilterType {
  type: string;
  value: RoomBookingParams["status"];
}

export interface RoomBookings {
  guestName: string;
  guestPhone?: string;
  guestEmail: string;
  checkIn: string;
  checkOut: string;
  status: RoomBookingStatus;
  totalNights: number;
  totalAmount: number;
  bookingId: string;
}

export interface IWidgetUser {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface IRoomBooking {
  _id: string;
  hotelId: string;
  guestId?: string;
  guest?: IWidgetUser;
  roomId: string;
  roomTypeId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestPhone: string;
  guestEmail: string;
  numberOfGuests: number;
  pricePerNight: number;
  totalNights: number;
  totalAmount: number;
  status: RoomBookingStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RoomBookingsListProps {
  roomId: string;
  roomNumber: string;
}
