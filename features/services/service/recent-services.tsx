/* eslint-disable @next/next/no-img-element */
"use client";

import Pagination from "@/components/common/pagination";
import React, { useMemo, useState } from "react";

type RequestStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

interface FrontendBooking {
  id: string;
  serviceName: string;
  serviceItemName: string;
  guestName: string;
  roomNumber?: string;
  quantity: number;
  totalAmount: number;
  assignedStaff?: string;
  status: Exclude<RequestStatus, "all">;
  requestedAt: string;
}

const INITIAL_DATA: FrontendBooking[] = [
  {
    id: "b1",
    serviceName: "Room Cleaning",
    serviceItemName: "Deep Cleaning",
    guestName: "John Doe",
    roomNumber: "203",
    quantity: 1,
    totalAmount: 500,
    assignedStaff: "Ramesh",
    status: "pending",
    requestedAt: "2026-01-15T10:30:00Z",
  },
  {
    id: "b2",
    serviceName: "Laundry Service",
    serviceItemName: "Express Wash",
    guestName: "Sarah Smith",
    roomNumber: "118",
    quantity: 3,
    totalAmount: 750,
    assignedStaff: "Amit",
    status: "confirmed",
    requestedAt: "2026-01-15T09:15:00Z",
  },
  {
    id: "b3",
    serviceName: "Breakfast",
    serviceItemName: "Buffet",
    guestName: "Emily Wilson",
    roomNumber: "305",
    quantity: 2,
    totalAmount: 600,
    status: "completed",
    requestedAt: "2026-01-14T07:30:00Z",
  },
  {
    id: "b4",
    serviceName: "Spa Service",
    serviceItemName: "Full Body Massage",
    guestName: "Daniel Lee",
    quantity: 1,
    totalAmount: 2500,
    status: "cancelled",
    requestedAt: "2026-01-13T16:10:00Z",
  },
];

const statusStyles: Record<
  Exclude<RequestStatus, "all">,
  { badge: string; strip: string }
> = {
  pending: {
    badge: "bg-yellow-100 text-yellow-700",
    strip: "bg-yellow-400",
  },
  confirmed: {
    badge: "bg-blue-100 text-blue-700",
    strip: "bg-blue-400",
  },
  completed: {
    badge: "bg-green-100 text-green-700",
    strip: "bg-green-400",
  },
  cancelled: {
    badge: "bg-red-100 text-red-700",
    strip: "bg-red-400",
  },
};

function RecentServices() {
  const filters: RequestStatus[] = [
    "all",
    "pending",
    "confirmed",
    "completed",
    "cancelled",
  ];

  const [bookings, setBookings] = useState<FrontendBooking[]>(INITIAL_DATA);

  const [activeStatus, setActiveStatus] = useState<RequestStatus>("all");
  const [currentPage, setCurrentPage] = useState(20);

  const filteredBookings = useMemo(() => {
    if (activeStatus === "all") return bookings;
    return bookings.filter((b) => b.status === activeStatus);
  }, [bookings, activeStatus]);

  const handleStatusChange = (
    id: string,
    newStatus: Exclude<RequestStatus, "all">,
  ) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: newStatus } : b)),
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[1.5rem] font-semibold text-[#151a2c]">
          Recent Services
        </p>

        {/* Status Filters */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((status) => (
            <button
              key={status}
              onClick={() => setActiveStatus(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium
                transition-all duration-200 active:scale-95
                ${
                  activeStatus === status
                    ? "bg-[#151a2c] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
            >
              {status === "all"
                ? "All"
                : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Cards */}
      <div className="mt-6 space-y-3">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="group relative cursor-pointer  rounded-xl border border-black/5
                       p-4 bg-white transition
                       hover:shadow-md hover:-translate-y-0.5"
          >
            {/* Status Strip */}
            <div
              className={`absolute left-0 top-0 h-full w-[4px] rounded-l-xl
                ${statusStyles[booking.status].strip}`}
            />

            {/* Content */}
            <div className="flex items-start justify-between pl-2">
              {/* Left */}
              <div>
                <p className="font-medium text-[#151a2c]">
                  {booking.serviceName}
                  <span className="text-gray-400 font-normal">
                    {" "}
                    • {booking.serviceItemName}
                  </span>
                </p>

                <p className="text-sm text-gray-500">
                  {booking.guestName}
                  {booking.roomNumber && ` • Room ${booking.roomNumber}`}
                </p>

                {booking.assignedStaff && (
                  <p className="text-xs text-gray-400">
                    Assigned to {booking.assignedStaff}
                  </p>
                )}

                {/* Inline Actions (Pending only) */}
                {booking.status === "pending" && (
                  <div
                    className="mt-1 flex gap-2 text-xs opacity-70
                               group-hover:opacity-100 transition"
                  >
                    <button
                      onClick={() =>
                        handleStatusChange(booking.id, "confirmed")
                      }
                      className="text-blue-600 hover:underline"
                    >
                      Confirm
                    </button>
                    <span className="text-gray-300">·</span>
                    <button
                      onClick={() =>
                        handleStatusChange(booking.id, "cancelled")
                      }
                      className="text-red-600 hover:underline"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Right */}
              <div className="text-right flex flex-col items-end gap-1">
                <p className="font-semibold text-[#151a2c]">
                  ₹{booking.totalAmount}
                </p>

                <span
                  className={`text-xs px-2 py-[2px] rounded-full font-medium
                    ${statusStyles[booking.status].badge}`}
                >
                  {booking.status}
                </span>
              </div>
            </div>
          </div>
        ))}

        {filteredBookings.length === 0 && (
          <div className=" flex flex-col gap-[1.5rem] itmes-center justify-center">
            <img
              src="https://cdn.dribbble.com/userupload/7051469/file/original-bb6f16ce2c8ea76a86409476f8ea051f.png?resize=1600x1177&vertical=center"
              alt=""
              className="h-[350px] object-cover"
            />
            <p className="text-sm text-gray-500 text-center font-semibold text-[30px] ">
              No services found.
            </p>
            <p className=" text-center -mt-[1.8rem] text-[#fd7063] ">
              Currenty you dont have any service. we will update you soon.
            </p>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={20}
          className="justify-end"
        />
      </div>
    </div>
  );
}

export default RecentServices;
