"use client";

import { useState } from "react";
import {
  Phone,
  Mail,
  MoreHorizontal,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Trash2,
  ShieldOff,
  Shield,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import dayjs from "dayjs";
import { Staff } from "../types/types";

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
function RowMenu({
  staff,
  onEdit,
  onToggleAvailability,
  onToggleActive,
  onDelete,
}: {
  staff: Staff;
  onEdit?: (s: Staff) => void;
  onToggleAvailability?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all"
      >
        <MoreHorizontal size={15} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-8 z-20 w-44 bg-white border border-stone-200 rounded-xl shadow-lg overflow-hidden py-1">
            <MenuItem
              icon={<Pencil size={13} />}
              label="Edit staff"
              onClick={() => {
                onEdit?.(staff);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={
                staff.isAvailable ? (
                  <ToggleLeft size={13} />
                ) : (
                  <ToggleRight size={13} />
                )
              }
              label={staff.isAvailable ? "Mark unavailable" : "Mark available"}
              onClick={() => {
                onToggleAvailability?.(staff._id);
                setOpen(false);
              }}
            />
            <MenuItem
              icon={
                staff.isActive ? <ShieldOff size={13} /> : <Shield size={13} />
              }
              label={staff.isActive ? "Deactivate" : "Activate"}
              onClick={() => {
                onToggleActive?.(staff._id);
                setOpen(false);
              }}
            />
            <div className="h-px bg-stone-100 my-1" />
            <MenuItem
              icon={<Trash2 size={13} />}
              label="Remove"
              danger
              onClick={() => {
                onDelete?.(staff._id);
                setOpen(false);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

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
function StaffRow({
  staff,
  onEdit,
  onToggleAvailability,
  onToggleActive,
  onDelete,
}: {
  staff: Staff;
  onEdit?: (s: Staff) => void;
  onToggleAvailability?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onDelete?: (id: string) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const activeServices = staff.services?.filter((s) => s.isActive) ?? [];
  const inactiveServices = staff.services?.filter((s) => !s.isActive) ?? [];

  return (
    <>
      <tr
        className={`border-b border-stone-100 transition-colors
          ${!staff.isActive ? "opacity-50" : "hover:bg-amber-50/30"}`}
      >
        {/* Name + avatar */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-3">
            <Avatar name={staff.name} />
            <div>
              <p className="text-sm font-medium text-stone-800 font-jakarta">
                {staff.name}
              </p>
              <p className="text-[10px] text-stone-400 font-mono">
                #{staff._id.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>
        </td>

        {/* Contact */}
        <td className="px-5 py-3.5">
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
        <td className="px-5 py-3.5">
          <div className="flex flex-wrap gap-1.5">
            {activeServices.length === 0 ? (
              <span className="text-xs text-stone-300 italic">No services</span>
            ) : (
              <>
                {activeServices.slice(0, 2).map((s) => (
                  <span
                    key={s.mappingId}
                    className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: s.serviceColor + "18",
                      color: s.serviceColor,
                      border: `1px solid ${s.serviceColor}30`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: s.serviceColor }}
                    />
                    {s.serviceName}
                  </span>
                ))}
                {activeServices.length > 2 && (
                  <span className="text-[11px] font-medium text-stone-400 bg-stone-100 border border-stone-200 px-2 py-0.5 rounded-full">
                    +{activeServices.length - 2} more
                  </span>
                )}
              </>
            )}
          </div>
        </td>

        {/* Availability */}
        <td className="px-5 py-3.5">
          <button
            onClick={() => onToggleAvailability?.(staff._id)}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border transition-all
              ${
                staff.isAvailable
                  ? "bg-emerald-50 text-emerald-700 border-emerald-100 hover:bg-emerald-100"
                  : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${staff.isAvailable ? "bg-emerald-400" : "bg-stone-300"}`}
            />
            {staff.isAvailable ? "Available" : "Unavailable"}
          </button>
        </td>

        {/* Status */}
        <td className="px-5 py-3.5">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border
              ${
                staff.isActive
                  ? "bg-amber-50 text-amber-700 border-amber-100"
                  : "bg-rose-50 text-rose-600 border-rose-100"
              }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${staff.isActive ? "bg-amber-400" : "bg-rose-400"}`}
            />
            {staff.isActive ? "Active" : "Inactive"}
          </span>
        </td>

        {/* Joined */}
        <td className="px-5 py-3.5">
          <span className="text-xs text-stone-400 font-jakarta">
            {dayjs(staff.createdAt).format("D MMM YYYY")}
          </span>
        </td>

        {/* Actions */}
        <td className="px-5 py-3.5">
          <div className="flex items-center gap-1">
            {(staff.services?.length ?? 0) > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-stone-400 hover:bg-stone-100 hover:text-stone-600 transition-all"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            <RowMenu
              staff={staff}
              onEdit={onEdit}
              onToggleAvailability={onToggleAvailability}
              onToggleActive={onToggleActive}
              onDelete={onDelete}
            />
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
                {staff.services?.map((s) => (
                  <div
                    key={s.mappingId}
                    className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border
                      ${s.isActive ? "opacity-100" : "opacity-40"}`}
                    style={{
                      background: s.serviceColor + "15",
                      color: s.serviceColor,
                      border: `1px solid ${s.serviceColor}25`,
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full shrink-0"
                      style={{ background: s.serviceColor }}
                    />
                    {s.serviceName}
                    {!s.isActive && (
                      <span className="text-[10px] ml-1 opacity-60">
                        (disabled)
                      </span>
                    )}
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
  onEdit?: (s: Staff) => void;
  onToggleAvailability?: (id: string) => void;
  onToggleActive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function StaffTable({
  staff,
  onEdit,
  onToggleAvailability,
  onToggleActive,
  onDelete,
}: StaffTableProps) {
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
              <StaffRow
                key={s._id}
                staff={s}
                onEdit={onEdit}
                onToggleAvailability={onToggleAvailability}
                onToggleActive={onToggleActive}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
