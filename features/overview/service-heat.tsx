"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Line,
  LineChart,
} from "recharts";
import { Timeframe, useServiceBookings } from "./hooks/hooks";

type Filter = "Week" | "Month" | "Year";

function ChartSkeleton() {
  const bars = [40, 65, 50, 80, 60, 90, 55];
  return (
    <div className="w-full h-[220px] flex items-end gap-[5px] px-1 pb-5 relative overflow-hidden">
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

function EmptyState({ filter }: { filter: Filter }) {
  return (
    <div className="w-full h-[220px] flex flex-col items-center justify-center gap-3 select-none">
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

// ── Tooltip ───────────────────────────────────────────────────────────────────

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="font-jakarta bg-white border border-stone-100 rounded-2xl px-4 py-3 shadow-xl shadow-stone-200/60 text-xs">
      <p className="text-stone-400 mb-2 uppercase tracking-widest text-[9px]">
        {label}
      </p>
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
        <span className="text-stone-500">Bookings</span>
        <span className="ml-auto font-semibold text-stone-800 pl-4">
          {payload[0].value}
        </span>
      </div>
    </div>
  );
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ServicesBookingChart() {
  const [filter, setFilter] = useState<Filter>("Week");
  const { isLoading, data: serviceBookings } = useServiceBookings(
    filter.toLowerCase() as Timeframe,
  );

  const data = serviceBookings?.data?.data || [];
  const total = data.reduce(
    (acc: number, d: { bookings: number }) => acc + d.bookings,
    0,
  );
  const isEmpty = !isLoading && data.length === 0;

  useEffect(() => {
    console.log("service bookings", serviceBookings?.data);
  }, [serviceBookings]);

  return (
    <div className="bg-white w-full h-full overflow-hidden border border-stone-100 rounded-2xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <div>
          <p className="font-playfair text-stone-800 text-lg leading-snug">
            Services Load
          </p>
          <p className="font-jakarta text-xs text-stone-400 mt-0.5">
            Total bookings over time
          </p>
        </div>

        {/* Total pill */}
        <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
          <span className="font-jakarta text-xs text-amber-700">
            {total} Bookings
          </span>
        </div>
      </div>

      {/* Filter */}
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

      {/* Chart */}
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
              dataKey="bookings"
              stroke="#f59e0b"
              strokeWidth={2.5}
              dot={{ fill: "#f59e0b", r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#f59e0b", strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
