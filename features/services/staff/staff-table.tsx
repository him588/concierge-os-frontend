"use client";

import { useRef, useState } from "react";
import {
  Phone,
  Mail,
  MoreHorizontal,
  Trash2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dayjs from "dayjs";
import { Staff } from "../types/types";
import Modal from "@/components/common/modal";
import { useDeleteStaff } from "../hooks/use-api";
import { useUIContext } from "@/context/ui-context";

// ── Initials avatar ────────────────────────────────────────────────────────────
function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 flex items-center justify-center shrink-0">
      <span className="text-sm font-semibold text-white">{initials}</span>
    </div>
  );
}

// ── Row actions menu ───────────────────────────────────────────────────────────
function RowMenu({ staff }: { staff: Staff }) {
  const [pos, setPos] = useState<{ top: number; right: number } | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const open = pos !== null;

  const handleOpen = () => {
    if (open) {
      setPos(null);
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      setPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
  };

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleOpen}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setPos(null)} />
          <div
            className="fixed z-20 w-44 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden py-1"
            style={{ top: pos!.top, right: pos!.right }}
          >
            <MenuItem
              icon={<Trash2 size={13} />}
              label="Remove"
              danger
              onClick={() => {
                setPos(null); // close dropdown first
                setShowWarning(true); // then open modal
              }}
            />
          </div>
        </>
      )}

      {/* Outside {open &&} so it survives dropdown unmounting */}
      <Modal isOpen={showWarning} onClose={() => setShowWarning(false)}>
        <DeleteWarning staff={staff} onclose={() => setShowWarning(false)} />
      </Modal>
    </div>
  );
}

// ── Menu item ──────────────────────────────────────────────────────────────────
function MenuItem({
  icon,
  label,
  danger = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium font-jakarta transition-colors
        ${
          danger
            ? "text-rose-500 hover:bg-rose-50"
            : "text-stone-600 hover:bg-stone-50"
        }`}
    >
      {icon}
      {label}
    </button>
  );
}

// ── StaffRow ───────────────────────────────────────────────────────────────────
function StaffRow({ staff }: { staff: Staff }) {
  const [expanded, setExpanded] = useState(false);
  const assignedService = staff.assignedServices || [];

  // Applied per content <td> only — never on the actions <td>
  // so opacity never bleeds into the fixed-position dropdown or modal
  const dimmed = !staff.isActive ? "opacity-50" : "";

  return (
    <>
      <tr
        className={`border-b border-stone-100 transition-colors ${
          staff.isActive ? "hover:bg-amber-50/30" : ""
        }`}
      >
        {/* Name + avatar */}
        <td className={`px-5 py-3.5 ${dimmed}`}>
          <div className="flex items-center gap-3">
            <Avatar name={staff.name} />
            <div>
              <p className="text-sm font-medium text-stone-800 font-jakarta">
                {staff.name}
              </p>
              <p className="text-[10px] text-stone-400 font-mono">
                #{staff.staffId.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className={`px-5 py-3.5 ${dimmed}`}>
          <div className="space-y-1">
            {staff.email && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Mail size={11} className="text-stone-300 shrink-0" />
                {staff.email}
              </div>
            )}
            {staff.phone && (
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <Phone size={11} className="text-stone-300 shrink-0" />
                {staff.phone}
              </div>
            )}
          </div>
        </td>

        {/* Services */}
        <td className={`px-5 py-3.5 ${dimmed}`}>
          <div className="flex flex-wrap gap-1.5">
            {assignedService.length === 0 ? (
              <span className="text-xs text-stone-300 italic">No services</span>
            ) : (
              <>
                {assignedService.slice(0, 2).map((s) => (
                  <span
                    key={s.serviceId}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: s.color + "18",
                      color: s.color,
                      border: `1px solid ${s.color}30`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 text-nowrap rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    <span className="text-nowrap">{s.name}</span>
                  </span>
                ))}
                {assignedService.length > 2 && (
                  <span className="text-[11px] font-medium text-stone-400 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                    +{assignedService.length - 2} more
                  </span>
                )}
              </>
            )}
          </div>
        </td>

        {/* Availability */}
        <td className={`px-5 py-3.5 ${dimmed}`}>
          <button
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all
              ${
                staff.isAvailable
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                  : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                staff.isAvailable ? "bg-emerald-400" : "bg-stone-300"
              }`}
            />
            {staff.isAvailable ? "Available" : "Unavailable"}
          </button>
        </td>

        {/* Status */}
        <td className={`px-5 py-3.5 ${dimmed}`}>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border
              ${
                staff.isActive
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                staff.isActive ? "bg-amber-400" : "bg-rose-400"
              }`}
            />
            {staff.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Joined */}
        <td className={`px-5 py-3.5 ${dimmed}`}>
          <span className="text-xs text-stone-400 font-jakarta">
            {dayjs(staff.createdAt).format("D MMM YYYY")}
          </span>
        </td>

        {/* Actions — never dimmed so dropdown + modal are unaffected */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1">
            {(staff.assignedServices?.length ?? 0) > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            <RowMenu staff={staff} />
          </div>
        </td>
      </tr>

      {/* ── Expanded services row ── */}
      {expanded && (
        <tr className="border-b border-stone-100 bg-amber-50/20">
          <td colSpan={7} className="px-5 py-3">
            <div className="pl-12 space-y-2">
              <p className="text-[10px] uppercase tracking-widest text-stone-400 font-jakarta mb-2">
                All service assignments
              </p>
              <div className="flex flex-wrap gap-2">
                {assignedService.map((s) => (
                  <div
                    key={s.serviceId}
                    className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border"
                    style={{
                      background: s.color + "15",
                      color: s.color,
                      border: `1px solid ${s.color}25`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: s.color }}
                    />
                    {s.name}
                  </div>
                ))}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

// ── StaffTable ─────────────────────────────────────────────────────────────────
interface StaffTableProps {
  staff: Staff[];
}

export function StaffTable({ staff }: StaffTableProps) {
  if (staff.length === 0) return null;

  return (
    <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-stone-100 bg-stone-50/60">
              {[
                "Staff member",
                "Contact",
                "Services",
                "Availability",
                "Status",
                "Joined",
                "",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3 text-left text-[10px] uppercase tracking-widest text-stone-400 font-jakarta font-medium"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {staff.map((s) => (
              <StaffRow key={s.staffId} staff={s} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Delete warning ─────────────────────────────────────────────────────────────
export function DeleteWarning({
  staff,
  onclose,
}: {
  staff: Staff;
  onclose: () => void;
}) {
  const { isPending, mutate: deleteStaff } = useDeleteStaff();
  const { setToastMessage, setToastType } = useUIContext();

  function handleDelete() {
    deleteStaff(
      { staffId: staff.staffId },
      {
        onSuccess: () => {
          setToastType("success");
          setToastMessage(`${staff.name} has been removed.`);
          onclose();
        },
        onError: () => {
          setToastType("error");
          setToastMessage("Failed to remove staff. Please try again.");
        },
      },
    );
  }

  return (
    <div className="relative w-full">
      {/* Icon */}
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
        <svg
          className="h-6 w-6 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      {/* Text */}
      <h2 className="mb-2 text-lg font-semibold text-gray-900">
        Delete Staff Member
      </h2>
      <p className="mb-6 text-sm leading-relaxed text-gray-500">
        <span className="font-medium text-gray-700">{staff.name}</span> will be
        permanently removed from your staff list. This action is{" "}
        <span className="font-medium text-red-500">irreversible</span>.
      </p>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onclose}
          disabled={isPending}
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          onClick={handleDelete}
          disabled={isPending}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-500 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? (
            <>
              <svg
                className="h-4 w-4 animate-spin"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
                />
              </svg>
              Removing…
            </>
          ) : (
            `Remove ${staff.name}`
          )}
        </button>
      </div>
    </div>
  );
}
