"use client";

import { useUIContext } from "@/context/ui-context";
import { useState } from "react";
import { useCreateStaff } from "../hooks/use-api";
import { User, Mail, Phone, Lock, X, Check, Copy } from "lucide-react";
import { clearError } from "@/components/helper/input";

// ── Types ──────────────────────────────────────────────────────────────────────
type FormErrors = {
  name: string;
  email: string;
  mobileNo: string;
  password: string;
};

// ── CreateStaff ────────────────────────────────────────────────────────────────
function CreateStaff({ onClose }: { onClose: () => void }) {
  const { mutate, isPending } = useCreateStaff();
  const { setToastType, setToastMessage } = useUIContext();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
    isAvailable: true,
    isActive: true,
  });

  const [errors, setErrors] = useState<FormErrors>({
    name: "",
    email: "",
    mobileNo: "",
    password: "",
  });

  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  // ── Validation ──
  function validate() {
    const newErrors: FormErrors = {
      name: "",
      email: "",
      mobileNo: "",
      password: "",
    };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
      isValid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      isValid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
      isValid = false;
    }
    if (!formData.mobileNo.trim()) {
      newErrors.mobileNo = "Mobile number is required.";
      isValid = false;
    } else if (!/^[6-9]\d{9}$/.test(formData.mobileNo)) {
      newErrors.mobileNo = "Enter a valid 10-digit mobile number.";
      isValid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Password is required.";
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log(formData);
    if (!validate()) return;

    mutate(formData, {
      onSuccess: () => setSuccess(true),
      onError: () => {
        setToastMessage("This email already exists for a different role.");
        setToastType("error");
      },
    });
  }

  function handleCopy() {
    navigator.clipboard.writeText(
      `Email: ${formData.email}\nPassword: ${formData.password}`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isDisabled = Object.values(formData).some((v) => v === "");

  // ── Success state ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="font-jakarta space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-1">
              Staff
            </p>
            <h2 className="font-playfair text-stone-800 text-xl">
              Staff created!
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center text-stone-300 hover:bg-stone-50 hover:text-stone-500 transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Success icon */}
        <div className="flex flex-col items-center py-4 gap-3">
          <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center">
            <Check size={24} className="text-amber-600" />
          </div>
          <p className="text-sm text-stone-500 text-center max-w-xs">
            Share these credentials with your staff to access the dashboard.
          </p>
        </div>

        {/* Credentials box */}
        <div className="bg-amber-50/60 border border-amber-100 rounded-2xl p-4 space-y-3">
          <CredRow label="Email" value={formData.email} />
          <div className="h-px bg-amber-100" />
          <CredRow label="Password" value={formData.password} />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium text-stone-600 bg-white border border-stone-200 hover:bg-stone-50 hover:border-stone-300 transition-all"
          >
            {copied ? (
              <Check size={14} className="text-emerald-500" />
            ) : (
              <Copy size={14} />
            )}
            {copied ? "Copied!" : "Copy credentials"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-orange-500 shadow-md shadow-amber-100 hover:opacity-90 transition-all border-0"
          >
            Done
          </button>
        </div>
      </div>
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="font-jakarta space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-amber-500 mb-1">
            Staff
          </p>
          <h2 className="font-playfair text-stone-800 text-xl">
            Add staff member
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

      {/* Fields */}
      <div className="space-y-4">
        <Field
          label="Full name"
          name="name"
          placeholder="e.g. Arjun Mehta"
          icon={<User size={14} />}
          value={formData.name}
          error={errors.name}
          onFocus={() => clearError(setErrors, "name")}
          onChange={handleChange}
        />
        <Field
          label="Email"
          name="email"
          type="email"
          placeholder="staff@hotel.com"
          icon={<Mail size={14} />}
          value={formData.email}
          error={errors.email}
          onFocus={() => clearError(setErrors, "email")}
          onChange={handleChange}
        />
        <Field
          label="Mobile number"
          name="mobileNo"
          placeholder="e.g. 9876543210"
          icon={<Phone size={14} />}
          value={formData.mobileNo}
          error={errors.mobileNo}
          onFocus={() => clearError(setErrors, "mobileNo")}
          onChange={handleChange}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          placeholder="Min. 6 characters"
          icon={<Lock size={14} />}
          value={formData.password}
          error={errors.password}
          onFocus={() => clearError(setErrors, "password")}
          onChange={handleChange}
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="font-jakarta text-sm text-stone-400 border border-stone-200 bg-white px-5 py-2.5 rounded-xl hover:border-stone-300 hover:text-stone-600 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isDisabled || isPending}
          className="font-jakarta text-sm font-medium px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-100 hover:opacity-95 transition-all flex items-center gap-2 border-0 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending && (
            <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          )}
          Create staff
        </button>
      </div>
    </form>
  );
}

export default CreateStaff;

// ── Field ──────────────────────────────────────────────────────────────────────
function Field({
  label,
  icon,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}) {
  return (
    <div>
      <label className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-300 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          {...props}
          className={`ob-input w-full font-jakarta text-sm text-stone-700 placeholder-stone-300
            bg-amber-50/40 border rounded-xl py-2.5 pr-4 outline-none transition-all
            focus:border-amber-400 focus:ring-2 focus:ring-amber-500/10
            ${icon ? "pl-9" : "pl-4"}
            ${error ? "border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-400/10" : "border-stone-200 hover:border-stone-300"}
          `}
        />
      </div>
      {error && <FieldError msg={error} />}
    </div>
  );
}

// ── FieldError ─────────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  return (
    <p className="font-jakarta text-[10px] text-red-500 mt-1 flex items-center gap-1">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        className="w-3 h-3 flex-shrink-0"
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {msg}
    </p>
  );
}

// ── CredRow ────────────────────────────────────────────────────────────────────
function CredRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-stone-400 font-jakarta">{label}</span>
      <span className="text-xs font-medium text-stone-700 font-mono">
        {value}
      </span>
    </div>
  );
}
