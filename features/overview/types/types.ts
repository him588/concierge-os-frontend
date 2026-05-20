export interface LatestBookings {
  name: string;
  roomType: string;
  guests: string;
  totalAmount: string;
  bookingStatus: "confirmed" | "pending";
  date: string;
}
