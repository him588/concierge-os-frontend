"use client";

import { ChangeEvent, useEffect, useState } from "react";
import {
  Tag,
  AlignLeft,
  Package,
  Users,
  X,
  IndianRupeeIcon,
} from "lucide-react";
import { ListingType, ServiceItem } from "../types/types";
import { useCreateServiceItem } from "../hooks/use-api";
import { useUIContext } from "@/context/ui-context";

function CreateServiceItem({
  onClose,
  id,
}: {
  onClose: () => void;
  id: string;
}) {
  const [formData, setFormData] = useState<ServiceItem>({
    name: "",
    description: "",
    serviceId: id,
    price: 0,
    isAvailable: true,
    listingType: ListingType.QUANTITY,
  });
  const { mutate: createSubService } = useCreateServiceItem();
  const { setToastMessage, setToastType } = useUIContext();

  const isFree = formData.price === 0;

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    const { name, value, type } = e.target;

    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else if (type === "number") {
      setFormData((prev) => ({
        ...prev,
        [name]: value === "" ? undefined : Number(value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  }

  function handleSubmit() {
    console.log("Form Data:", formData);
    createSubService(formData, {
      onSuccess: () => {
        setToastType("success");
        setToastMessage("Sub service created Successfully");
      },
      onError: () => {
        setToastType("error");
        setToastMessage("Running some unexpexted error sorry");
      },
    });
    onClose();
  }

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const isDisabled =
    formData.name.length < 3 || !formData.serviceId || formData.price < 0;

  return (
    <div className="font-jakarta space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-1">
            Service Items
          </p>
          <h2 className="font-playfair text-stone-800 text-xl">
            Create service item
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
          Item name <span className="text-amber-500">*</span>
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
            placeholder="e.g. Coffee & Pastries"
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
            placeholder="Briefly describe this item…"
            rows={3}
            className="w-full font-jakarta text-sm text-stone-700 placeholder-stone-300
              bg-amber-50/40 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 outline-none
              hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10
              transition-all resize-none min-h-[90px] max-h-[120px]"
          />
        </div>
      </div>

      {/* ── Listing Type ── */}
      <div>
        <label className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 block mb-2">
          Listing type
        </label>
        <div className="grid grid-cols-2 gap-3">
          <ListingTypeCard
            icon={<Package size={16} />}
            label="Quantity"
            description="Food, amenities, consumables"
            selected={formData.listingType === ListingType.QUANTITY}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                listingType: ListingType.QUANTITY,
              }))
            }
          />
          <ListingTypeCard
            icon={<Users size={16} />}
            label="Person"
            description="Spa, classes, consultations"
            selected={formData.listingType === ListingType.PERSON}
            onClick={() =>
              setFormData((prev) => ({
                ...prev,
                listingType: ListingType.PERSON,
              }))
            }
          />
        </div>
      </div>

      {/* ── Price & Max Quantity ── */}
      <div className="grid grid-cols-1">
        {/* Price */}
        <div>
          <label className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5">
            Price <span className="text-amber-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none">
              <IndianRupeeIcon size={14} />
            </div>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              min={0}
              step="0.01"
              placeholder="0.00"
              className="w-full font-jakarta text-sm text-stone-700 placeholder-stone-300
                bg-amber-50/40 border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 outline-none
                hover:border-stone-300 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
          </div>
          {isFree && (
            <p className="text-[10px] text-emerald-600 mt-1 ml-1">
              This item is free
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        <Toggle
          label="Available"
          description="Available to list at site"
          checked={formData.isAvailable}
          onChange={() =>
            setFormData((prev) => ({
              ...prev,
              isAvailable: !prev.isAvailable,
            }))
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
          onClick={handleSubmit}
          className="font-jakarta text-sm font-medium px-6 py-2.5 rounded-xl
            bg-gradient-to-r from-amber-500 to-orange-500 text-white
            shadow-md shadow-amber-100 hover:opacity-95 transition-all
            border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create item
        </button>
      </div>
    </div>
  );
}

export default CreateServiceItem;

// ── ListingTypeCard ────────────────────────────────────────────────────────────
function ListingTypeCard({
  icon,
  label,
  description,
  selected,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start p-3.5 rounded-xl border transition-all text-left
        ${
          selected
            ? "bg-amber-50/60 border-amber-200 ring-2 ring-amber-500/20"
            : "bg-stone-50/40 border-stone-200 hover:border-stone-300"
        }`}
    >
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-all
          ${
            selected
              ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
              : "bg-stone-100 text-stone-400"
          }`}
      >
        {icon}
      </div>
      <p className="text-xs font-medium text-stone-700 font-jakarta mb-0.5">
        {label}
      </p>
      <p className="text-[10px] text-stone-400 font-jakarta">{description}</p>
    </button>
  );
}

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
