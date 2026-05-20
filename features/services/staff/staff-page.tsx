"use client";

import { useEffect, useState } from "react";
import { Plus, Users } from "lucide-react";
import SearchBar from "@/components/common/search-bar";
import EmptyState from "./empty-state";
import { Staff, StaffFilter } from "../types/types";
import { DUMMY_STAFF } from "../types/const";
import { StaffTable } from "./staff-table";
import { useGetStaff, useGetStaffListInfinite } from "../hooks/use-api";

// ── Types ──────────────────────────────────────────────────────────────────────
interface StaffPageProps {
  staff?: Staff[];
  onAddStaff?: () => void;
  onEdit?: (s: Staff) => void;
  onToggleAvailability?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// ── Filter config ──────────────────────────────────────────────────────────────
const FILTERS: { label: string; value: StaffFilter }[] = [
  { label: "All", value: "all" },
  { label: "Available", value: "available" },
  { label: "Unavailable", value: "unavailable" },
  { label: "Inactive", value: "inactive" },
];

// ── StaffPage ──────────────────────────────────────────────────────────────────
export default function StaffPage({
  staff = DUMMY_STAFF,
  onAddStaff,
  onEdit,
  onToggleAvailability,
  onToggleActive,
  onDelete,
}: StaffPageProps) {
  const { data, isLoading, isError } = useGetStaff();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<StaffFilter>("all");
  const pageSize = 10;

  const { data: staffList } = useGetStaffListInfinite(pageSize, "all", "");

  // ── Counts ──
  const total = staff.length;
  const available = staff.filter((s) => s.isAvailable && s.isActive).length;
  const unavailable = staff.filter((s) => !s.isAvailable && s.isActive).length;
  const inactive = staff.filter((s) => !s.isActive).length;

  useEffect(() => {
    console.log("staff list", staffList);
  }, [staffList]);

  return (
    <div className="min-h-screen  font-jakarta mt-5  space-y-5 max-w-7xl mx-auto">
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
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-stone-100 border-t border-stone-100">
          <StatCell label="Total staff" value={data.totalStaff} />
          <StatCell
            label="Available"
            value={data.availableStaff}
            accent="emerald"
          />
          <StatCell
            label="Unavailable"
            value={data.unavailableStaff}
            accent="stone"
          />
          <StatCell label="Inactive" value={data.inactiveStaff} accent="rose" />
        </div>
      </div>

      {/* ── Search + filters ── */}
      <div className="flex flex-wrap gap-3 items-center">
        <SearchBar
          placeholder="Search name, email, service…"
          value={search}
          onChange={setSearch}
          width="w-full sm:w-72"
        />

        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                onClick={() => setFilter(f.value)}
                className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-all
                  ${
                    active
                      ? "bg-amber-50 text-amber-800 border-amber-200"
                      : "bg-white text-stone-500 border-stone-200 hover:border-stone-300 hover:text-stone-700"
                  }`}
              >
                {f.label}
                <span className="ml-1.5 opacity-50">
                  {f.value === "all"
                    ? total
                    : f.value === "available"
                      ? available
                      : f.value === "unavailable"
                        ? unavailable
                        : inactive}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Table or empty ── */}
      {pageSize > 0 ? (
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
        <>
          <StaffTable
            staff={filtered}
            onEdit={onEdit}
            onToggleAvailability={onToggleAvailability}
            onToggleActive={onToggleActive}
            onDelete={onDelete}
          />

          <p className="text-xs text-stone-400 text-right">
            Showing {filtered.length} of {total} staff member
            {total !== 1 ? "s" : ""}
          </p>
        </>
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
