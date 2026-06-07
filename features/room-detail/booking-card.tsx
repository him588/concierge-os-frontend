import {
  CalendarDays,
  Clock,
  Mail,
  Phone,
  Hash,
  ChevronDown,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { RoomBookings, RoomBookingStatus } from "./types/types";
import { bookingStatusConfig } from "./types/const";
import { useUpdateBookingStatus } from "./hooks/use-rooms";

interface BookingCardProps {
  booking: RoomBookings;
  onStatusChange?: (bookingId: string, newStatus: RoomBookingStatus) => void;
}

function validActions(status: RoomBookingStatus): RoomBookingStatus[] {
  switch (status) {
    case RoomBookingStatus.PENDING:
      return [RoomBookingStatus.CONFIRMED, RoomBookingStatus.CANCELLED];
    case RoomBookingStatus.CONFIRMED:
      return [RoomBookingStatus.CHECKED_IN, RoomBookingStatus.CANCELLED];
    case RoomBookingStatus.CHECKED_IN:
      return [RoomBookingStatus.CHECKED_OUT];
    case RoomBookingStatus.CHECKED_OUT:
    case RoomBookingStatus.CANCELLED:
      return [];
    default:
      return [];
  }
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatAmount(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function shortId(id: string) {
  return `#${id.slice(-6).toUpperCase()}`;
}

export function BookingCard({ booking, onStatusChange }: BookingCardProps) {
  const [currentStatus, setCurrentStatus] = useState<RoomBookingStatus>(
    booking.status,
  );
  const [open, setOpen] = useState(false);
  const badgeRef = useRef<HTMLDivElement>(null);
  const { mutate: updateStatus } = useUpdateBookingStatus();

  const cfg = bookingStatusConfig[currentStatus];
  const nextStatuses = validActions(currentStatus);
  const isTerminal = nextStatuses.length === 0;

  // Close on outside click
  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (badgeRef.current && !badgeRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, [open]);

  function handleBadgeClick(e: React.MouseEvent) {
    e.stopPropagation();
    if (isTerminal) return;
    setOpen((v) => !v);
  }

  function handleSelect(e: React.MouseEvent, status: RoomBookingStatus) {
    e.stopPropagation();
    setOpen(false);
    setCurrentStatus(status);
    onStatusChange?.(booking.bookingId, status);
    updateStatus({ id: booking.bookingId, status });
  }

  return (
    <article
      className={`
        group relative bg-white border border-stone-100 rounded-2xl p-4
        hover:border-stone-200 hover:shadow-md hover:shadow-stone-100/80
        transition-all duration-200 cursor-pointer overflow-visible
      `}
    >
      {/* Left accent stripe */}
      <span
        className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full transition-colors duration-300 ${cfg?.bg ?? "bg-amber-100"}`}
      />

      {/* ── Row 1: guest + status badge + amount ── */}
      <div className="flex items-start justify-between gap-3 pl-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-stone-800 font-jakarta truncate leading-tight">
            {booking.guestName}
          </p>
          <div className="flex items-center gap-1 mt-0.5">
            <Hash size={10} className="text-stone-300 shrink-0" />
            <span className="text-[10px] text-stone-400 font-mono tracking-wide">
              {shortId(booking.bookingId)}
            </span>
          </div>
        </div>

        <div className="flex flex-col items-end gap-1.5 shrink-0">
          {/* Clickable status badge + dropdown */}
          <div className="relative" ref={badgeRef}>
            <button
              onClick={handleBadgeClick}
              disabled={isTerminal}
              title={isTerminal ? "No further transitions" : "Change status"}
              className={`
                group/badge inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5
                rounded-full border uppercase tracking-wide
                transition-all duration-200
                ${
                  isTerminal
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:scale-105 hover:shadow-sm active:scale-95 cursor-pointer"
                }
                ${cfg ? `${cfg.bg} ${cfg.text} ${cfg.border}` : "bg-stone-50 text-stone-500 border-stone-200"}
              `}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${cfg?.dot ?? "bg-stone-400"}`}
              />
              {currentStatus}
              {!isTerminal && (
                <ChevronDown
                  size={9}
                  className={`transition-transform duration-200 -mr-0.5 ${open ? "rotate-180" : ""}`}
                />
              )}
            </button>

            {/* Dropdown — only valid next statuses */}
            {open && (
              <div className="absolute right-0 top-[calc(100%+6px)] z-50 min-w-[148px] bg-white border border-stone-200 rounded-xl shadow-lg shadow-stone-200/60 py-1 overflow-hidden">
                {/* Arrow pointer */}
                <div className="absolute -top-[5px] right-3 w-2.5 h-2.5 bg-white border-l border-t border-stone-200 rotate-45" />

                <p className="px-3 pt-1.5 pb-1 text-[9px] uppercase tracking-widest text-stone-400 font-semibold">
                  Move to
                </p>

                {nextStatuses.map((status) => {
                  const c = bookingStatusConfig[status];
                  return (
                    <button
                      key={status}
                      onClick={(e) => handleSelect(e, status)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-left text-[11px] font-semibold uppercase tracking-wide text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer"
                    >
                      <span
                        className={`w-2 h-2 rounded-full shrink-0 ${c?.dot ?? "bg-stone-300"}`}
                      />
                      {status}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Amount */}
          <p className="text-sm font-bold text-stone-800 font-jakarta">
            {formatAmount(booking.totalAmount)}
          </p>
        </div>
      </div>

      {/* ── Row 2: contact chips ── */}
      <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 pl-3">
        <span className="flex items-center gap-1 text-[11px] text-stone-500 truncate max-w-[160px]">
          <Mail size={10} className="text-stone-300 shrink-0" />
          {booking.guestEmail}
        </span>
        <span className="flex items-center gap-1 text-[11px] text-stone-500">
          <Phone size={10} className="text-stone-300 shrink-0" />
          {booking.guestPhone}
        </span>
      </div>

      {/* ── Divider ── */}
      <div className="border-t border-dashed border-stone-100 mt-3 mb-3" />

      {/* ── Row 3: dates + nights ── */}
      <div className="flex items-center gap-3 pl-3 flex-wrap">
        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
            <CalendarDays size={11} className="text-emerald-500" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 leading-none">
              Check-in
            </p>
            <p className="text-xs font-medium text-stone-700 mt-0.5">
              {formatDate(booking.checkIn)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-0.5 text-stone-300 text-xs">
          <span className="w-6 h-px bg-stone-200 block" />
          <span className="text-[9px] text-stone-400">
            {booking.totalNights}n
          </span>
          <span className="w-6 h-px bg-stone-200 block" />
        </div>

        <div className="flex items-center gap-1.5">
          <div className="w-6 h-6 rounded-lg bg-rose-50 flex items-center justify-center shrink-0">
            <CalendarDays size={11} className="text-rose-400" />
          </div>
          <div>
            <p className="text-[9px] uppercase tracking-widest text-stone-400 leading-none">
              Check-out
            </p>
            <p className="text-xs font-medium text-stone-700 mt-0.5">
              {formatDate(booking.checkOut)}
            </p>
          </div>
        </div>

        <div className="ml-auto flex items-center gap-1 bg-stone-50 border border-stone-100 rounded-full px-2 py-1">
          <Clock size={9} className="text-stone-400" />
          <span className="text-[10px] font-medium text-stone-500">
            {booking.totalNights} nights
          </span>
        </div>
      </div>
    </article>
  );
}
