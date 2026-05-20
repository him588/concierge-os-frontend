"use client";

import { ChangeEvent, useState } from "react";
import { returnAxiosError } from "@/components/helper/axios";
import { useUIContext } from "@/context/ui-context";
import { useCreateServices } from "../hooks/use-api";
import { Tag, AlignLeft, Palette, X, Check } from "lucide-react";

// ── Color swatches ─────────────────────────────────────────────────────────────
const COLORS = [
  "#dbc8f7", // lavender
  "#b2c6f2", // periwinkle
  "#9cf7c2", // mint
  "#f6cc99", // peach
  "#f69ece", // pink
  "#a3f8e5", // aqua
];

// ── CreateService ──────────────────────────────────────────────────────────────
function CreateService({ onClose }: { onClose: () => void }) {
  const { mutate: handleSubmit } = useCreateServices();
  const { setToastMessage, setToastType } = useUIContext();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
    color: COLORS[0],
    isPaid: true,
  });

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  const isDisabled =
    formData.name.length < 3 || formData.description.length < 3;

  return (
    <div className="font-jakarta space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-1">
            Services
          </p>
          <h2 className="font-playfair text-stone-800 text-xl">
            Create service
          </h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-300 hover:bg-stone-50 hover:text-stone-500 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* ── Name ── */}
      <div>
        <label className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5">
          Service name
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none">
            <Tag size={14} />
          </div>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Housekeeping"
            className="w-full font-jakarta text-sm text-stone-700 placeholder-stone-300
              bg-amber-50/40 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 outline-none
              hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 transition-all"
          />
        </div>
      </div>

      {/* ── Description ── */}
      <div>
        <label className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5">
          Description
        </label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-stone-300 pointer-events-none">
            <AlignLeft size={14} />
          </div>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Briefly describe this service…"
            rows={3}
            className="w-full font-jakarta text-sm text-stone-700 placeholder-stone-300
              bg-amber-50/40 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 outline-none
              hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10
              transition-all resize-none min-h-[90px] max-h-[120px]"
          />
        </div>
      </div>

      {/* ── Color picker ── */}
      <div>
        <label className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 block mb-2">
          <span className="flex items-center gap-1.5">
            <Palette size={11} />
            Service colour
          </span>
        </label>
        <div className="flex items-center gap-3 bg-amber-50/40 border border-stone-200 rounded-xl px-4 py-3">
          {COLORS.map((color) => {
            const active = formData.color === color;
            return (
              <button
                key={color}
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, color }))}
                className="relative w-7 h-7 rounded-full transition-all duration-200 hover:scale-110 flex items-center justify-center border-0"
                style={{ background: color }}
              >
                {active && (
                  <Check
                    size={13}
                    className="text-white drop-shadow"
                    strokeWidth={2.5}
                  />
                )}
                {active && (
                  <span
                    className="absolute inset-0 rounded-full ring-2 ring-offset-1"
                    style={{
                      outline: `2px solid ${color}`,
                      outlineOffset: "2px",
                    }}
                  />
                )}
              </button>
            );
          })}

          {/* Preview */}
          <div className="ml-auto flex items-center gap-2">
            <span
              className="text-xs font-medium px-3 py-1 rounded-full border"
              style={{
                background: formData.color + "18",
                color: formData.color,
                borderColor: formData.color + "35",
              }}
            >
              {formData.name || "Preview"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Toggles ── */}
      <div className="grid grid-cols-1 gap-3">
        <Toggle
          label="Ready to list"
          description="Visible to guests"
          checked={formData.isActive}
          onChange={() =>
            setFormData((prev) => ({ ...prev, isActive: !prev.isActive }))
          }
        />
      </div>

      {/* ── Actions ── */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="font-jakarta text-sm text-stone-400 border border-stone-200 bg-white px-5 py-2.5 rounded-xl hover:border-stone-300 hover:text-stone-600 transition-all"
        >
          Cancel
        </button>
        <button
          type="button"
          disabled={isDisabled}
          onClick={() =>
            handleSubmit(formData, {
              onSuccess: () => {
                onClose();
                setToastType("success");
                setToastMessage("Service created successfully");
              },
              onError: (error) => {
                onClose();
                const message = returnAxiosError(error);
                setToastType("error");
                setToastMessage(message);
              },
            })
          }
          className="font-jakarta text-sm font-medium px-6 py-2.5 rounded-xl
            bg-gradient-to-r from-amber-500 to-orange-500 text-white
            shadow-md shadow-amber-100 hover:opacity-95 transition-all
            border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create service
        </button>
      </div>
    </div>
  );
}

export default CreateService;

// ── Toggle ─────────────────────────────────────────────────────────────────────
function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-3 rounded-xl border cursor-pointer transition-all
        ${
          checked
            ? "bg-amber-50/60 border-amber-100"
            : "bg-stone-50/60 border-stone-200"
        }`}
      onClick={onChange}
    >
      <div>
        <p className="text-xs font-medium text-stone-700 font-jakarta">
          {label}
        </p>
        <p className="text-[10px] text-stone-400 font-jakarta mt-0.5">
          {description}
        </p>
      </div>

      {/* Pill toggle */}
      <div
        className={`relative w-9 h-5 rounded-full transition-all duration-200 shrink-0 ml-3
          ${checked ? "bg-gradient-to-r from-amber-500 to-orange-500" : "bg-stone-200"}`}
      >
        <div
          className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-all duration-200
            ${checked ? "left-4" : "left-0.5"}`}
        />
      </div>
    </div>
  );
}
