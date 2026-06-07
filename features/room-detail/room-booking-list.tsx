"use client";

import { useEffect, useState } from "react";
import { CalendarX, Plus, ChevronLeft, ChevronRight } from "lucide-react";
import SearchBar from "@/components/common/search-bar";
import {
  RoomBookings,
  RoomBookingsListProps,
  RoomBookingStatus,
} from "./types/types";
import { useRoomsContext } from "@/context/room-context";
import { bookingStatusConfig, Filters } from "./types/const";
import { useGetDynamicRoomBookings } from "./hooks/use-rooms";
import { BookingCard } from "./booking-card";

export function RoomBookingsList({
  roomId,
  roomNumber,
}: RoomBookingsListProps) {
  const [selectedFilter, setSelectedFilter] = useState(Filters[0]);
  const [search, setSearch] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");

  const { setActiveRoom, setCurrentModal } = useRoomsContext();
  const [currentPage, setCurrentPage] = useState(1);
  const { data: bookings } = useGetDynamicRoomBookings({
    pageSize: 10,
    offset: (currentPage - 1) * 10,
    search: debouncedInput,
    roomId: roomId,
    status: selectedFilter.value,
  });

  function handleNewBooking() {
    setCurrentModal("BookRoom");
    setActiveRoom({
      activeRoomNumber: roomNumber,
      activeRoomId: roomId,
    });
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedInput(search);
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

  const filterBookings: RoomBookings[] = bookings?.data.bookings || [];
  const totalPages = bookings?.data.totalPages || 1;
  const isEmpty = filterBookings.length === 0;

  return (
    <section className="space-y-4">
      {/* ── Section header ── */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 font-jakarta">
            Bookings
          </p>
        </div>
        <button
          onClick={handleNewBooking}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-sm shadow-amber-100 hover:opacity-90 transition-all border-0"
        >
          <Plus size={12} />
          New booking
        </button>
      </div>

      {/* ── Search + filter ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar
          placeholder="Search guest name, email…"
          value={search}
          onChange={setSearch}
          width="w-full sm:w-72"
        />

        {/* Filter tabs */}
        <div className="flex flex-wrap gap-1.5">
          {Filters.map((f) => {
            const active = selectedFilter.value === f.value;
            const cfg =
              f.value !== "" &&
              bookingStatusConfig[f.value as RoomBookingStatus]
                ? bookingStatusConfig[f.value as RoomBookingStatus]
                : null;
            return (
              <button
                key={f.value}
                onClick={() => {
                  setSelectedFilter(f);
                  setCurrentPage(1);
                }}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                  ${
                    active
                      ? cfg
                        ? `${cfg.bg} ${cfg.text} ${cfg.border}`
                        : "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-300"
                  }`}
              >
                {f.type}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Booking cards / empty state ── */}
      {isEmpty ? (
        <div className="bg-white border border-dashed border-stone-200 rounded-2xl py-14 flex flex-col items-center gap-3">
          <CalendarX size={28} className="text-stone-300" />
          <p className="text-sm text-stone-400">No bookings found</p>
          {search && (
            <button
              onClick={() => setSearch("")}
              className="text-xs text-amber-600 hover:text-amber-700 transition-colors"
            >
              Clear search
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filterBookings.map((booking) => (
            <BookingCard key={booking.bookingId} booking={booking} />
          ))}
        </div>
      )}

      {/* ── Pagination ── */}
      {!isEmpty && totalPages > 1 && (
        <div className="flex items-center justify-between pt-1">
          <p className="text-[11px] text-stone-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={13} />
            </button>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="w-7 h-7 rounded-lg border border-stone-200 flex items-center justify-center text-stone-500 hover:border-stone-300 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={13} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
