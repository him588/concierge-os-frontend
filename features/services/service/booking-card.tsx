import { useState } from "react";
import { ServiceBookings, ServiceBookingStatus } from "../types/types";

type Props = {
  booking: ServiceBookings;
  index?: number;
  onStatusChange?: (id: string, status: ServiceBookingStatus) => Promise<void>;
};

const statusStyles: Record<ServiceBookingStatus, string> = {
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  confirmed: "bg-blue-50 text-blue-600 border border-blue-200",
  in_progress: "bg-purple-50 text-purple-600 border border-purple-200",
  completed: "bg-green-50 text-green-600 border border-green-200",
  cancelled: "bg-red-50 text-red-500 border border-red-100",
};

const statusLabel: Record<ServiceBookingStatus, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  in_progress: "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
};

const nextStatuses: Record<ServiceBookingStatus, ServiceBookingStatus[]> = {
  pending: [ServiceBookingStatus.CONFIRMED, ServiceBookingStatus.CANCELLED],
  confirmed: [ServiceBookingStatus.IN_PROGRESS, ServiceBookingStatus.CANCELLED],
  in_progress: [ServiceBookingStatus.COMPLETED, ServiceBookingStatus.CANCELLED],
  completed: [],
  cancelled: [],
};

const fmt = (dateString: string) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

export function ServiceBookingCard({
  booking,
  index = 0,
  onStatusChange,
}: Props) {
  const [status, setStatus] = useState<ServiceBookingStatus>(booking.status);
  const [loading, setLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const available = nextStatuses[status];

  async function handleStatusChange(next: ServiceBookingStatus) {
    setShowMenu(false);
    if (!onStatusChange) {
      setStatus(next);
      return;
    }
    setLoading(true);
    try {
      await onStatusChange(booking.id, next);
      setStatus(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div
        className="bg-white border border-stone-100 rounded-2xl shadow-sm p-4 sm:p-5 mb-3 relative"
        style={{
          animation: "fadeUp 0.4s ease forwards",
          animationDelay: `${index * 0.08}s`,
          opacity: 0,
        }}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-4">
          <div className="min-w-0 flex-1">
            <p
              className="text-base sm:text-lg text-stone-900 truncate"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {booking.serviceName}
            </p>
            <p className="text-xs text-stone-400 mt-0.5 truncate">
              {booking.serviceItemName} · #
              {booking.id.slice(0, 8).toUpperCase()}
            </p>
          </div>

          {/* Status badge + dropdown */}
          <div className="relative flex-shrink-0">
            <button
              onClick={() => available.length > 0 && setShowMenu((p) => !p)}
              disabled={loading || available.length === 0}
              className={`text-[10px] tracking-wider uppercase px-2.5 py-1.5 rounded-full font-semibold flex items-center gap-1.5 transition-all ${statusStyles[status]} ${available.length > 0 ? "cursor-pointer hover:opacity-80" : "cursor-default"}`}
            >
              {loading && (
                <span className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
              )}
              {statusLabel[status]}
              {available.length > 0 && !loading && (
                <span className="opacity-60">▾</span>
              )}
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 top-full mt-1.5 z-20 bg-white border border-stone-100 rounded-xl shadow-lg overflow-hidden min-w-[140px]">
                  {available.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s)}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-600 hover:bg-amber-50 hover:text-amber-600 transition-colors cursor-pointer"
                    >
                      {statusLabel[s]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-3 gap-y-4 mb-4">
          {(
            [
              ["Service", booking.serviceName],
              ["Item", booking.serviceItemName],
              ["Room", `${booking.roomNumber} · Floor ${booking.roomFloor}`],
              ["Quantity", booking.quantity.toString()],
            ] as [string, string][]
          ).map(([label, val]) => (
            <div key={label}>
              <p className="text-[10px] tracking-wide uppercase text-stone-400 mb-0.5">
                {label}
              </p>
              <p className="text-sm text-stone-700 font-medium truncate">
                {val}
              </p>
            </div>
          ))}
        </div>

        {/* Guest row */}
        <div className="flex items-center gap-3 bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 mb-4">
          <div
            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white flex-shrink-0"
            style={{ background: "linear-gradient(135deg, #fbbf24, #d97706)" }}
          >
            {booking.guestName.slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-stone-700 truncate">
              {booking.guestName}
            </p>
            <p className="text-[10px] text-stone-400 truncate">
              {booking.guestEmail}
            </p>
          </div>
          {booking.staffName && (
            <div className="ml-auto text-right min-w-0">
              <p className="text-[10px] text-stone-400">Assigned to</p>
              <p className="text-xs font-medium text-stone-600 truncate">
                {booking.staffName}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-3.5 border-t border-stone-100">
          <div>
            <p className="text-[10px] text-stone-400">Amount</p>
            <p
              className="text-lg sm:text-xl text-stone-800"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              ₹
              {(booking.serviceItemPrice * booking.quantity).toLocaleString(
                "en-IN",
              )}
            </p>
          </div>
          <p className="text-[10px] text-stone-400">{fmt(booking.createdAt)}</p>
        </div>
      </div>
    </>
  );
}

export default ServiceBookingCard;
