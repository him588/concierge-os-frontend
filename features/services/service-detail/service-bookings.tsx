"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  User,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

interface Booking {
  bookingId: string;
  guestName: string;
  roomNumber?: string;
  date: string;
  time: string;
  status: "confirmed" | "pending" | "cancelled" | "completed";
  duration: number; // in minutes
  notes?: string;
}

// Dummy bookings data
const DUMMY_BOOKINGS: Booking[] = [
  {
    bookingId: "book-1",
    guestName: "Alexandra Thompson",
    roomNumber: "305",
    date: "2024-04-22",
    time: "10:00 AM",
    status: "confirmed",
    duration: 60,
    notes: "Allergic to lavender oil",
  },
  {
    bookingId: "book-2",
    guestName: "Robert Kim",
    roomNumber: "412",
    date: "2024-04-22",
    time: "2:30 PM",
    status: "confirmed",
    duration: 90,
  },
  {
    bookingId: "book-3",
    guestName: "Emma Wilson",
    date: "2024-04-23",
    time: "11:00 AM",
    status: "pending",
    duration: 60,
    notes: "First-time guest",
  },
  {
    bookingId: "book-4",
    guestName: "Michael Chen",
    roomNumber: "208",
    date: "2024-04-20",
    time: "3:00 PM",
    status: "completed",
    duration: 120,
  },
  {
    bookingId: "book-5",
    guestName: "Sophie Anderson",
    roomNumber: "501",
    date: "2024-04-21",
    time: "9:00 AM",
    status: "cancelled",
    duration: 60,
  },
];

function ServiceBookingsSection({ serviceId }: { serviceId: string }) {
  const [bookings, setBookings] = useState<Booking[]>(DUMMY_BOOKINGS);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filteredBookings = bookings.filter(
    (booking) => filterStatus === "all" || booking.status === filterStatus,
  );

  const getStatusConfig = (status: Booking["status"]) => {
    switch (status) {
      case "confirmed":
        return {
          icon: CheckCircle2,
          bg: "bg-emerald-100",
          text: "text-emerald-700",
          label: "Confirmed",
        };
      case "pending":
        return {
          icon: AlertCircle,
          bg: "bg-amber-100",
          text: "text-amber-700",
          label: "Pending",
        };
      case "cancelled":
        return {
          icon: XCircle,
          bg: "bg-red-100",
          text: "text-red-700",
          label: "Cancelled",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          bg: "bg-stone-100",
          text: "text-stone-700",
          label: "Completed",
        };
    }
  };

  const statusCounts = {
    all: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    completed: bookings.filter((b) => b.status === "completed").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-stone-900">
          Service Bookings
        </h3>
        <p className="text-sm text-stone-600 mt-0.5">
          Recent and upcoming appointments
        </p>
      </div>

      {/* Status Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {[
          { value: "all", label: "All" },
          { value: "confirmed", label: "Confirmed" },
          { value: "pending", label: "Pending" },
          { value: "completed", label: "Completed" },
          { value: "cancelled", label: "Cancelled" },
        ].map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterStatus(filter.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filterStatus === filter.value
                ? "bg-amber-500 text-white"
                : "bg-white border border-stone-200 text-stone-700 hover:border-amber-200 hover:text-amber-700"
            }`}
          >
            {filter.label}
            <span className="ml-1.5 opacity-75">
              ({statusCounts[filter.value as keyof typeof statusCounts]})
            </span>
          </button>
        ))}
      </div>

      {/* Bookings List */}
      <div className="grid gap-3">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-stone-200">
            <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-stone-100 flex items-center justify-center">
              <Calendar className="text-stone-400" size={24} />
            </div>
            <p className="text-stone-600 text-sm">No bookings found</p>
            <p className="text-stone-500 text-xs mt-1">
              {filterStatus !== "all"
                ? `No ${filterStatus} bookings`
                : "No bookings for this service"}
            </p>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const statusConfig = getStatusConfig(booking.status);
            const StatusIcon = statusConfig.icon;

            return (
              <div
                key={booking.bookingId}
                className="bg-white rounded-lg border border-stone-200 p-4 hover:border-amber-200 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-stone-900">
                        {booking.guestName}
                      </h4>
                      {booking.roomNumber && (
                        <span className="px-2 py-0.5 text-xs font-medium rounded bg-stone-100 text-stone-700">
                          Room {booking.roomNumber}
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm text-stone-600 mb-3">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} className="text-stone-400" />
                        <span>
                          {new Date(booking.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={14} className="text-stone-400" />
                        <span>
                          {booking.time} ({booking.duration} min)
                        </span>
                      </div>
                    </div>

                    {booking.notes && (
                      <p className="text-xs text-stone-500 italic bg-stone-50 p-2 rounded border border-stone-100">
                        Note: {booking.notes}
                      </p>
                    )}
                  </div>

                  <div
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusConfig.bg} ${statusConfig.text}`}
                  >
                    <StatusIcon size={14} />
                    {statusConfig.label}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ServiceBookingsSection;
