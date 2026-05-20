import { useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import { Timeframe, useBookingCount } from "./hooks/hooks";
type Filter = "Week" | "Month" | "Year";

function SkeletonPill({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-stone-100 rounded-xl ${className}`} />
  );
}

function ChartSkeleton() {
  // Fake bar heights to mimic a line chart silhouette
  const bars = [40, 65, 50, 80, 60, 90, 55, 75, 45, 70, 85, 60];
  return (
    <div className="w-full h-[220px] flex items-end gap-[5px] px-1 pb-5 relative overflow-hidden">
      {/* Horizontal grid lines */}
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className="absolute left-0 right-0 border-t border-stone-100"
          style={{ bottom: `${20 + i * 50}px` }}
        />
      ))}
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm animate-pulse"
          style={{
            height: `${h}%`,
            background: i % 2 === 0 ? "#fef3c7" : "#f5f5f4",
            animationDelay: `${i * 60}ms`,
          }}
        />
      ))}
    </div>
  );
}

// ── Empty state ────────────────────────────────────────────────────────────────
function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="w-full h-[220px] flex flex-col items-center justify-center gap-3 select-none">
      {/* Icon */}
      <div className="w-12 h-12 rounded-2xl bg-stone-50 border border-stone-100 flex items-center justify-center">
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#d6d3d1"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
        </svg>
      </div>
      <div className="text-center">
        <p className="font-jakarta text-sm font-medium text-stone-400">
          No bookings this {filter.toLowerCase()}
        </p>
        <p className="font-jakarta text-xs text-stone-300 mt-0.5">
          Data will appear once bookings come in
        </p>
      </div>
    </div>
  );
}

export function BookingChart() {
  const [filter, setFilter] = useState<Filter>("Week");
  const { data: bookingData, isLoading } = useBookingCount(
    filter.toLowerCase() as Timeframe,
  );
  const data = bookingData?.data.data || [];
  const isEmpty = !isLoading && data.length === 0;

  const onlineTotal = data.reduce((acc: number, curr: { online: number }) => {
    return curr.online + acc;
  }, 0);
  const walkinTotal = data.reduce((acc: number, curr: { walkin: number }) => {
    return curr.walkin + acc;
  }, 0);

  return (
    <div className="flex-1 min-w-0 bg-white border border-stone-100 rounded-2xl p-6 shadow-sm">
      {/* Chart header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="font-playfair text-stone-800 text-lg leading-snug">
            Booking Sources
          </p>
          <p className="font-jakarta text-xs text-stone-400 mt-0.5">
            Online vs walk-in comparison
          </p>
        </div>

        {/* Summary pills — shimmer while loading, zeroed-out while empty */}
        <div className="flex items-center gap-2 flex-wrap">
          {isLoading ? (
            <>
              <SkeletonPill className="w-24 h-7" />
              <SkeletonPill className="w-24 h-7" />
            </>
          ) : (
            <>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                <span className="font-jakarta text-xs text-amber-700">
                  {onlineTotal} Online
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-stone-50 border border-stone-100 rounded-xl px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-stone-400 flex-shrink-0" />
                <span className="font-jakarta text-xs text-stone-500">
                  {walkinTotal} Walk-in
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex bg-stone-100 rounded-xl p-1 w-fit mb-6">
        {(["Week", "Month", "Year"] as Filter[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            disabled={isLoading}
            className={`font-jakarta text-xs font-medium px-4 py-1.5 rounded-lg transition-all ${
              filter === f
                ? "bg-white text-stone-800 shadow-sm"
                : "text-stone-400 hover:text-stone-600"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {f}
          </button>
        ))}
      </div>

      {isLoading ? (
        <ChartSkeleton />
      ) : isEmpty ? (
        <EmptyState filter={filter} />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart
            data={data}
            margin={{ top: 4, right: 4, left: -24, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f5f5f4"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: 10,
                fill: "#a8a29e",
              }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{
                fontFamily: "Plus Jakarta Sans",
                fontSize: 10,
                fill: "#a8a29e",
              }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="online"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }}
            />
            <Line
              type="monotone"
              dataKey="walkin"
              stroke="#a8a29e"
              strokeWidth={2.5}
              strokeDasharray="5 4"
              dot={{ fill: "#a8a29e", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#a8a29e", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

// ── Tooltip ────────────────────────────────────────────────────────────────────
interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="font-jakarta bg-white border border-stone-100 rounded-2xl px-4 py-3 shadow-xl shadow-stone-200/60 text-xs">
      <p className="text-stone-400 mb-2 uppercase tracking-widest text-[9px]">
        {label}
      </p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 mb-1 last:mb-0">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ background: p.color }}
          />
          <span className="text-stone-500">
            {p.name === "online" ? "Online" : "Walk-in"}
          </span>
          <span className="ml-auto font-semibold text-stone-800 pl-4">
            {p.value}
          </span>
        </div>
      ))}
    </div>
  );
};
