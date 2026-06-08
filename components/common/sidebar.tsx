"use client";

import {
  ChartSpline,
  DollarSign,
  KeyRound,
  MapPinHouse,
  Settings,
  UsersRound,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import React, { JSX, useEffect, useState } from "react";

type Page = {
  name: string;
  icon: JSX.Element;
  isActive: boolean;
  route: string;
};

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export default function Sidebar({ open, onClose }: SidebarProps) {
  const router = useRouter();
  const pathName = usePathname();
  const [pages, setPages] = useState<Page[]>([
    {
      name: "Overview",
      icon: <ChartSpline size={16} />,
      isActive: true,
      route: "/overview",
    },
    {
      name: "Rooms",
      icon: <KeyRound size={16} />,
      isActive: false,
      route: "/rooms",
    },
    {
      name: "Services",
      icon: <MapPinHouse size={16} />,
      isActive: false,
      route: "/services",
    },
    // {
    //   name: "Earnings",
    //   icon: <DollarSign size={16} />,
    //   isActive: false,
    //   route: "/earnings",
    // },
    {
      name: "Profile",
      icon: <UsersRound size={16} />,
      isActive: false,
      route: "/profile",
    },
  ]);

  const handlePageClick = (index: number, route: string) => {
    setPages((prev) => prev.map((p, i) => ({ ...p, isActive: i === index })));
    router.push(route);
    onClose(); // close drawer on mobile after navigation
  };

  useEffect(() => {
    setPages((prev) =>
      prev.map((page) => ({
        ...page,
        isActive: pathName.includes(page.route),
      })),
    );
  }, []);

  const content = (
    <div className="h-full w-full flex flex-col justify-between bg-white border border-stone-100 rounded-3xl shadow-lg shadow-stone-100/80 px-5 py-8">
      {/* Logo */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-100 text-white flex-shrink-0">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-4 h-4"
            >
              <path d="M3 22V8l9-6 9 6v14" />
              <rect x="9" y="14" width="6" height="8" />
              <rect x="5" y="10" width="3" height="3" />
              <rect x="16" y="10" width="3" height="3" />
            </svg>
          </div>
          <span className="font-playfair   text-lg text-stone-800 font-medium">
            Concierge<span className="text-amber-500">OS</span>
          </span>
        </div>

        {/* Close button — mobile only */}
        <button
          onClick={onClose}
          className="lg:hidden w-8 h-8 rounded-xl flex items-center justify-center text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-all"
        >
          <X size={16} />
        </button>
      </div>

      {/* Nav */}
      <div className="flex flex-col gap-1 -mt-[5rem]">
        <p className="font-jakarta text-[9px] uppercase tracking-widest text-stone-300 px-3 mb-2">
          Menu
        </p>
        {pages.map((page, index) => (
          <div
            key={index}
            onClick={() => handlePageClick(index, page.route)}
            className={`h-11 rounded-xl cursor-pointer w-full flex items-center gap-3 px-3 transition-all duration-150
              ${
                page.isActive
                  ? "bg-gradient-to-r from-amber-50 to-orange-50 text-amber-700 border border-amber-100"
                  : "text-stone-400 hover:bg-stone-50 hover:text-stone-600 border border-transparent"
              }`}
          >
            <span className={page.isActive ? "text-amber-500" : ""}>
              {page.icon}
            </span>
            <p className="font-jakarta text-sm">{page.name}</p>
            {page.isActive && (
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />
            )}
          </div>
        ))}
      </div>

      {/* Bottom */}
      <button className="w-full h-11 flex items-center gap-3 px-3 rounded-xl text-stone-400 hover:bg-stone-50 hover:text-stone-600 transition-all border border-transparent hover:border-stone-100">
        <Settings size={16} />
        <span className="font-jakarta text-sm">Settings</span>
      </button>
    </div>
  );

  return (
    <>
      {/* ── Desktop: static sidebar ── */}
      <div className="hidden lg:block h-full w-full">{content}</div>

      {/* ── Mobile: overlay drawer ── */}
      {/* Backdrop */}
      {open && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`lg:hidden fixed top-0 left-0 z-50 h-full w-[280px] p-4 transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        {content}
      </div>
    </>
  );
}
