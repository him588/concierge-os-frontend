"use client";
import { useEffect, useState } from "react";
import { useGetPropertyDetails } from "./hooks/use-api";
import { useBaseContext } from "@/context/base-context";

// ─── Types ─────────────────────────────────────────────────────────────────────
interface Property {
  ownerName: string;
  address: string;
  propertyId: string;
  contactNo: string;
  email: string;
  propertyName: string;
  propertyType: string;
  joiningDate: string;
}

interface SnippetEntry {
  lang: string;
  code: string;
}

type SnippetKey = "HTML" | "PHP" | "WordPress" | "Next.js" | "Vue.js" | "React";

// ─── Snippet Data ──────────────────────────────────────────────────────────────
const WIDGET_URL = "https://widget.conciergeservice.in/widget.js";

function buildSnippets(
  hotelName: string,
  hotelId: string,
): Record<SnippetKey, SnippetEntry> {
  return {
    HTML: {
      lang: "html",
      code: `<!-- Place just before </body> -->
<div
  data-booking-widget
  data-hotel-name="${hotelName}"
  data-hotel-id="${hotelId}"
></div>
<script
  type="module"
  src="${WIDGET_URL}"
></script>`,
    },
    PHP: {
      lang: "php",
      code: `<?php // In your theme's footer.php ?>
<div
  data-booking-widget
  data-hotel-name="<?php echo esc_attr(get_option('hotel_name')); ?>"
  data-hotel-id="${hotelId}"
></div>
<script
  type="module"
  src="${WIDGET_URL}"
></script>`,
    },
    WordPress: {
      lang: "php",
      code: `// Add to functions.php
function add_booking_widget() { ?>
  <div
    data-booking-widget
    data-hotel-name="${hotelName}"
    data-hotel-id="${hotelId}"
  ></div>
  <script type="module"
    src="${WIDGET_URL}"
  ></script>
<?php }
add_action('wp_footer', 'add_booking_widget');`,
    },
    "Next.js": {
      lang: "tsx",
      code: `// components/BookingWidget.tsx
import Script from 'next/script'

export default function BookingWidget() {
  return (
    <>
      <div
        data-booking-widget
        data-hotel-name="${hotelName}"
        data-hotel-id="${hotelId}"
      />
      <Script
        src="${WIDGET_URL}"
        strategy="afterInteractive"
        type="module"
      />
    </>
  )
}`,
    },
    "Vue.js": {
      lang: "vue",
      code: `<!-- BookingWidget.vue -->
<template>
  <div
    data-booking-widget
    data-hotel-name="${hotelName}"
    data-hotel-id="${hotelId}"
  />
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(() => {
  const s = document.createElement('script')
  s.type = 'module'
  s.src = '${WIDGET_URL}'
  document.body.appendChild(s)
})
</script>`,
    },
    React: {
      lang: "jsx",
      code: `// components/BookingWidget.jsx
import { useEffect } from 'react'

export default function BookingWidget() {
  useEffect(() => {
    const s = document.createElement('script')
    s.type = 'module'
    s.src = '${WIDGET_URL}'
    document.body.appendChild(s)
    return () => document.body.removeChild(s)
  }, [])

  return (
    <div
      data-booking-widget
      data-hotel-name="${hotelName}"
      data-hotel-id="${hotelId}"
    />
  )
}`,
    },
  };
}

const TAB_KEYS: SnippetKey[] = [
  "HTML",
  "PHP",
  "WordPress",
  "Next.js",
  "Vue.js",
  "React",
];

// ─── Helpers ───────────────────────────────────────────────────────────────────
function formatJoiningDate(isoDate: string): string {
  try {
    return new Date(isoDate).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  } catch {
    return isoDate;
  }
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ─── Syntax Highlight ──────────────────────────────────────────────────────────
function highlight(code: string, _lang: string): string {
  return code
    .replace(/("(?:[^"\\]|\\.)*")/g, '<span style="color:#059669">$1</span>')
    .replace(
      /\b(import|export|default|function|return|const|from|type)\b/g,
      '<span style="color:#d97706">$1</span>',
    )
    .replace(/(&lt;\/?[\w.]+)/g, '<span style="color:#b45309">$1</span>')
    .replace(
      /\b(add_action|onMounted|useEffect|esc_attr|get_option)\b/g,
      '<span style="color:#7c3aed">$1</span>',
    )
    .replace(/(\/\/[^\n]*|&lt;!--[\s\S]*?--&gt;|&lt;\?php.*?\?&gt;)/g, (m) =>
      m.startsWith("//") || m.startsWith("&lt;!--")
        ? `<span style="color:#a8a29e;font-style:italic">${m}</span>`
        : m,
    );
}

// ─── Sub-components ────────────────────────────────────────────────────────────
interface CopyButtonProps {
  text: string;
  className?: string;
}

function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const handle = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  return (
    <button
      onClick={handle}
      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all duration-200
        ${
          copied
            ? "border-amber-400 bg-amber-50 text-amber-700"
            : "border-stone-200 bg-white text-stone-500 hover:border-amber-300 hover:text-amber-700 hover:bg-amber-50"
        } ${className}`}
    >
      {copied ? (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
          Copied
        </>
      ) : (
        <>
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <rect x="9" y="9" width="13" height="13" rx="2" />
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" />
          </svg>
          Copy
        </>
      )}
    </button>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400 mb-3">
      {children}
    </p>
  );
}

interface InfoRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

function InfoRow({ label, value, mono = false }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-0.5 py-3 border-b border-stone-100 last:border-0">
      <span className="text-[10px] uppercase tracking-widest font-medium text-stone-400">
        {label}
      </span>
      <span
        className={`text-sm text-stone-700 ${mono ? "font-mono text-xs" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────────
function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-stone-200 rounded-lg ${className}`} />
  );
}

function ProfileSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Hero card */}
      <div className="rounded-3xl border border-amber-100/80 p-6 bg-amber-50/50">
        <div className="flex items-start gap-5">
          <Skeleton className="w-20 h-20 rounded-2xl flex-shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-56" />
            <div className="flex gap-3 mt-4">
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-8 w-28 rounded-xl" />
              <Skeleton className="h-8 w-28 rounded-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-column */}
      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-3 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
          <Skeleton className="h-3 w-28" />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="py-2 space-y-1.5">
              <Skeleton className="h-2.5 w-20" />
              <Skeleton className="h-4 w-48" />
            </div>
          ))}
        </div>
        <div className="col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6 space-y-4">
          <Skeleton className="h-3 w-28" />
          <div className="flex items-center gap-3 pb-4">
            <Skeleton className="w-11 h-11 rounded-full flex-shrink-0" />
            <div className="space-y-1.5">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-20" />
            </div>
          </div>
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-2 space-y-1.5">
              <Skeleton className="h-2.5 w-16" />
              <Skeleton className="h-4 w-40" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Error State ───────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
      <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
        <svg
          className="w-7 h-7 text-red-400"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <p className="text-sm font-semibold text-stone-800">
          Failed to load property details
        </p>
        <p className="text-xs text-stone-400 mt-1">
          Something went wrong while fetching your data.
        </p>
      </div>
      <button
        onClick={onRetry}
        className="px-4 py-2 rounded-xl text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Profile() {
  const [activeTab, setActiveTab] = useState<SnippetKey>("HTML");
  const [editMode, setEditMode] = useState(false);
  const { userDetails } = useBaseContext();

  const { isLoading, isError, data, refetch } = useGetPropertyDetails(
    userDetails?.propertyId ?? "",
  );

  const property: Property | undefined = data?.data?.property;

  const hotelName = property?.propertyName ?? "—";
  const hotelId = property?.propertyId ?? "—";
  const SNIPPETS = buildSnippets(hotelName, hotelId);
  const snippet = SNIPPETS[activeTab];
  if (isLoading) return <ProfileSkeleton />;
  if (isError || !property) return <ErrorState onRetry={refetch} />;

  // ── Derived display values ──
  const initials = getInitials(property.ownerName);
  const propertyInitials = getInitials(property.propertyName);
  const joiningDate = formatJoiningDate(property.joiningDate);

  return (
    <div className="">
      <div className="space-y-6">
        {/* ── Page Header ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900">
              Property Profile
            </h1>
            <p className="text-sm text-stone-500 mt-0.5">
              Manage your hotel details and widget setup
            </p>
          </div>
          <button
            onClick={() => setEditMode(!editMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-200
              ${
                editMode
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white border-transparent shadow-md shadow-amber-200"
                  : "bg-white border-stone-200 text-stone-600 hover:border-amber-300 hover:text-amber-700"
              }`}
          >
            {/* {editMode ? (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2.5}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                Save changes
              </>
            ) : (
              <>
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Edit profile
              </>
            )} */}
          </button>
        </div>

        {/* ── Hero Card ── */}
        <div
          className="relative overflow-hidden rounded-3xl border border-amber-100/80 shadow-sm"
          style={{ background: "linear-gradient(145deg, #fefce8, #fff7ed)" }}
        >
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-amber-200/40 pointer-events-none" />
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full border border-amber-200/30 pointer-events-none" />

          <div className="relative p-6 flex items-start gap-5">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-amber-200/50"
              style={{
                background: "linear-gradient(135deg, #fbbf24, #d97706)",
              }}
            >
              <span
                className="text-3xl font-bold text-white tracking-wide"
                style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              >
                {propertyInitials}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-semibold text-stone-900">
                    {property.propertyName}
                  </h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <svg
                      className="w-3.5 h-3.5 text-amber-500 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm text-stone-500">
                      {property.address}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                    ✦ Pro Plan
                  </span>
                </div>
              </div>

              <div className="flex gap-3 mt-4 flex-wrap">
                {[
                  { icon: "🏨", label: property.propertyType },
                  { icon: "👤", label: property.ownerName },
                  { icon: "📞", label: property.contactNo },
                ].map(({ icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs text-stone-600 bg-white/70 border border-stone-200/60 backdrop-blur-sm"
                  >
                    <span>{icon}</span> {label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Two-column: Property Details + Owner Info ── */}
        <div className="grid grid-cols-5 gap-4">
          {/* Property Details */}
          <div className="col-span-3 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <SectionLabel>Property details</SectionLabel>
            <InfoRow label="Property name" value={property.propertyName} />
            <InfoRow label="Property type" value={property.propertyType} />
            <InfoRow label="Full address" value={property.address} />
            <InfoRow label="Hotel ID" value={property.propertyId} mono />
          </div>

          {/* Owner Info */}
          <div className="col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
            <SectionLabel>Owner information</SectionLabel>
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-stone-100">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold text-sm flex-shrink-0"
                style={{
                  background: "linear-gradient(135deg, #fbbf24, #d97706)",
                }}
              >
                {initials}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {property.ownerName}
                </p>
                <p className="text-xs text-stone-400">Property Owner</p>
              </div>
            </div>
            <InfoRow label="Email" value={property.email} />
            <InfoRow label="Phone" value={property.contactNo} />
            <InfoRow label="Member since" value={joiningDate} />
          </div>
        </div>

        {/* ── Widget Integration ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
          <div
            className="px-6 py-5 flex items-center justify-between border-b border-stone-100"
            style={{ background: "linear-gradient(135deg, #1c1917, #292524)" }}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-amber-400"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-100">
                  Widget Integration
                </p>
                <p className="text-xs text-stone-400">
                  Copy the snippet for your platform
                </p>
              </div>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Connected
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div>
              <SectionLabel>Script URL</SectionLabel>
              <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-stone-50 border border-stone-200">
                <svg
                  className="w-4 h-4 text-amber-500 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
                <code className="flex-1 text-xs font-mono text-stone-600 truncate">
                  {WIDGET_URL}
                </code>
                <CopyButton text={WIDGET_URL} />
              </div>
            </div>

            <div>
              <SectionLabel>Integration snippets</SectionLabel>
              <div className="flex gap-1 p-1 rounded-xl bg-stone-100 border border-stone-200 mb-4 flex-wrap">
                {TAB_KEYS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 min-w-[60px] px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200
                      ${
                        activeTab === tab
                          ? "bg-white text-stone-800 shadow-sm border border-stone-200"
                          : "text-stone-500 hover:text-stone-700"
                      }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div
                className="relative rounded-xl overflow-hidden border border-stone-200"
                style={{ background: "#1c1917" }}
              >
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-stone-700/50">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
                    <span className="ml-2 text-[11px] font-mono text-stone-500">
                      {activeTab === "Next.js"
                        ? "BookingWidget.tsx"
                        : activeTab === "Vue.js"
                          ? "BookingWidget.vue"
                          : activeTab === "React"
                            ? "BookingWidget.jsx"
                            : activeTab === "WordPress" || activeTab === "PHP"
                              ? "footer.php"
                              : "index.html"}
                    </span>
                  </div>
                  <CopyButton text={snippet.code} />
                </div>
                <div className="p-5 overflow-x-auto">
                  <pre
                    className="text-xs leading-relaxed font-mono text-stone-300"
                    dangerouslySetInnerHTML={{
                      __html: highlight(
                        snippet.code
                          .replace(/&/g, "&amp;")
                          .replace(/</g, "&lt;")
                          .replace(/>/g, "&gt;"),
                        snippet.lang,
                      ),
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200">
              <svg
                className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p className="text-xs text-amber-800 leading-relaxed">
                The widget auto-mounts on the{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                  data-booking-widget
                </code>{" "}
                div. Keep your{" "}
                <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono">
                  data-hotel-id
                </code>{" "}
                private — never commit it to a public repository.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
