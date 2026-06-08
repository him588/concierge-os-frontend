"use client";

import Pagination from "@/components/common/pagination";
import { useState } from "react";
import { useGetBookings } from "../hooks/use-api";
import { RoomBookingStatus } from "@/features/room-detail/types/types";
import { ServiceBookings } from "../types/types";
import ServiceBookingCard from "./booking-card";

type RequestStatus =
  | "all"
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled";

const filters: RequestStatus[] = [
  "all",
  "pending",
  "confirmed",
  "completed",
  "cancelled",
];

// ── Skeleton ────────────────────────────────────────────────────────────────
function ServiceBookingCardSkeleton({ index = 0 }: { index?: number }) {
  return (
    <div
      className="bg-white border border-stone-100 rounded-2xl shadow-sm p-4 sm:p-5 mb-3 animate-pulse"
      style={{
        animation: "fadeUp 0.4s ease forwards",
        animationDelay: `${index * 0.08}s`,
        opacity: 0,
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-4">
        <div className="flex-1 min-w-0">
          <div className="w-40 h-5 bg-stone-200 rounded mb-2" />
          <div className="w-52 h-3 bg-stone-200 rounded" />
        </div>
        <div className="w-24 h-6 bg-stone-200 rounded-full flex-shrink-0" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4 mb-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i}>
            <div className="w-full h-3 bg-stone-200 rounded mb-1" />
            <div className="w-3/4 h-4 bg-stone-200 rounded" />
          </div>
        ))}
      </div>

      {/* Guest row */}
      <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 mb-4">
        <div className="w-7 h-7 rounded-full bg-stone-200 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="w-28 h-3 bg-stone-200 rounded mb-1" />
          <div className="w-40 h-2.5 bg-stone-200 rounded" />
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3.5 border-t border-stone-100">
        <div>
          <div className="w-16 h-3 bg-stone-200 rounded mb-1" />
          <div className="w-24 h-6 bg-stone-200 rounded" />
        </div>
        <div className="w-20 h-3 bg-stone-200 rounded" />
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ status }: { status: RequestStatus }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-4xl mb-3">🛎️</p>
      <p
        className="text-lg text-stone-700 mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        No service bookings
      </p>
      <p className="text-xs text-stone-400">
        {status === "all"
          ? "Service requests will appear here once guests book."
          : `No ${status} requests at the moment.`}
      </p>
    </div>
  );
}

// ── Error state ──────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <p className="text-4xl mb-3">⚠️</p>
      <p
        className="text-lg text-stone-700 mb-1"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Something went wrong
      </p>
      <p className="text-xs text-stone-400 mb-4">
        Failed to load service bookings.
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl text-xs font-semibold border border-stone-200 text-stone-500 hover:border-amber-300 hover:text-amber-600 hover:bg-amber-50 transition-all cursor-pointer"
      >
        Try again
      </button>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
function RecentServices() {
  const [activeStatus, setActiveStatus] = useState<RequestStatus>("all");
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filter changes
  function handleFilterChange(status: RequestStatus) {
    setActiveStatus(status);
    setCurrentPage(1);
  }

  const {
    data: serviceBookings,
    isLoading,
    isError,
    refetch,
  } = useGetBookings({
    pageSize: 10,
    offset: (currentPage - 1) * 10,
    status:
      activeStatus === "all" ? undefined : (activeStatus as RoomBookingStatus),
  });

  const bookingsList: ServiceBookings[] = serviceBookings?.data.bookings || [];
  const totalPages = serviceBookings?.data.totalPages || 1;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <p
          className="text-2xl text-stone-800"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Recent Services
        </p>

        {/* Status filters */}
        <div className="flex gap-1.5 flex-wrap">
          {filters.map((status) => (
            <button
              key={status}
              onClick={() => handleFilterChange(status)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-medium tracking-wide transition-all duration-200 active:scale-95 cursor-pointer capitalize
                ${
                  activeStatus === status
                    ? "bg-amber-500 text-white shadow-sm"
                    : "bg-stone-100 text-stone-500 hover:bg-amber-50 hover:text-amber-600 border border-transparent hover:border-amber-200"
                }`}
            >
              {status === "all" ? "All" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <>
          {[0, 1, 2].map((i) => (
            <ServiceBookingCardSkeleton key={i} index={i} />
          ))}
        </>
      ) : isError ? (
        <ErrorState onRetry={refetch} />
      ) : bookingsList.length === 0 ? (
        <EmptyState status={activeStatus} />
      ) : (
        <>
          {bookingsList.map((booking, i) => (
            <ServiceBookingCard booking={booking} key={booking.id} index={i} />
          ))}

          {totalPages > 1 && (
            <div className=" mt-2">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalPages={totalPages}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default RecentServices;
