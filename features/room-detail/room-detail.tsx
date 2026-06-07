"use client";

import { useState } from "react";
import { RoomBookingsList } from "./room-booking-list";
import { RoomHeroCard } from "./room-hero-card";
import { Room, IRoomBooking, RoomBookingStatus } from "./types/types";

interface RoomDetailPageProps {
  id: string;
  room?: Room;
  bookings?: IRoomBooking[];
  onBack?: () => void;
  onEdit?: () => void;
  onNewBooking?: () => void;
  onToggleMaintenance?: () => void;
  onUpdateBookingStatus?: (
    bookingId: string,
    status: RoomBookingStatus,
  ) => void;
}

export default function RoomDetailPage({ id }: RoomDetailPageProps) {
  const [roomNumber, setRoomNumber] = useState("");
  return (
    <div className=" font-jakarta  space-y-8  max-w-5xl mx-auto">
      <RoomHeroCard setRoomNumber={setRoomNumber} roomId={id} />
      <RoomBookingsList roomId={id} roomNumber={roomNumber} />
    </div>
  );
}
