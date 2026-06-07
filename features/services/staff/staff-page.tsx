"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import SearchBar from "@/components/common/search-bar";
import EmptyState from "./empty-state";
import { useGetStaff, useGetStaffListInfinite } from "../hooks/use-api";
import { StaffTable } from "./staff-table";

export default function StaffPage({ onAddStaff }: { onAddStaff?: () => void }) {
  const { data } = useGetStaff();
  const [search, setSearch] = useState("");
  const [debounceSearch, setDebouncedSearch] = useState("");

  const {
    data: staffData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useGetStaffListInfinite(10, "all", debounceSearch);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  const totalStaff = data?.totalStaff ?? 0;
  const availableStaff = data?.availableStaff ?? 0;
  const unavailableStaff = data?.unavailableStaff ?? 0;
  const staffList = staffData?.staffList ?? [];

  return (
    <div className="min-h-screen mt-5 space-y-5 max-w-7xl mx-auto">
      {/* ── Page header ── */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-br from-stone-900 to-stone-800 px-6 py-5 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center shrink-0">
              <Users size={22} className="text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-0.5">
                Management
              </p>
              <h1 className="font-playfair text-xl text-amber-100 leading-tight">
                Staff
              </h1>
            </div>
          </div>

          <button
            onClick={onAddStaff}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium text-stone-900 bg-gradient-to-r from-amber-400 to-orange-400 hover:opacity-90 transition-all border-0 self-start"
          >
            <Plus size={14} />
            Add staff
          </button>
        </div>

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 divide-x divide-stone-100 border-t border-stone-100">
          <StatCell label="Total staff" value={totalStaff} />
          <StatCell label="Available" value={availableStaff} accent="emerald" />
          <StatCell
            label="Unavailable"
            value={unavailableStaff}
            accent="stone"
          />
        </div>
      </div>

      {totalStaff > 0 && (
        <div className="flex flex-wrap gap-3 items-center">
          <SearchBar
            placeholder="Search name, email, service…"
            value={search}
            onChange={setSearch}
            width="w-full sm:w-72"
          />
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {isLoading && (
        <div className="animate-pulse space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-14 bg-stone-100 rounded-xl" />
          ))}
        </div>
      )}

      {/* ── Table or empty ── */}
      {!isLoading && staffList.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No staff found"
          description={
            search
              ? `No staff matching "${search}".`
              : "Start by adding your first staff member."
          }
          buttonText={!search ? "Add staff" : undefined}
          onButtonClick={onAddStaff}
        />
      ) : (
        !isLoading && (
          <>
            <StaffTable staff={staffList} />

            {/* ── Load more ── */}
            {hasNextPage && (
              <div className="flex justify-center pt-2">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-5 py-2 text-sm rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 disabled:opacity-50 transition-all"
                >
                  {isFetchingNextPage ? "Loading…" : "Load more"}
                </button>
              </div>
            )}
            {search === "" && (
              <p className="text-xs text-stone-400 text-right">
                Showing {staffList.length} of {totalStaff} staff member
                {totalStaff !== 1 ? "s" : ""}
              </p>
            )}
          </>
        )
      )}
    </div>
  );
}

// ── StatCell ───────────────────────────────────────────────────────────────────
function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: "emerald" | "rose" | "stone";
}) {
  const color =
    accent === "emerald"
      ? "text-emerald-600"
      : accent === "rose"
        ? "text-rose-500"
        : "text-stone-500";

  return (
    <div className="px-5 py-4">
      <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
        {label}
      </p>
      <p
        className={`text-2xl font-semibold ${accent ? color : "text-stone-800"}`}
      >
        {value}
      </p>
    </div>
  );
}
