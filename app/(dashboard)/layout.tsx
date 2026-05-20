"use client";

import Header from "@/components/common/header";
import Sidebar from "@/components/common/sidebar";
import React, { useState } from "react";
import { Menu } from "lucide-react";
import { useBaseContext } from "@/context/base-context";
import LoadingScreen from "@/components/common/loading";
import { RoomContextProvider } from "@/context/room-context";
import { ServiveContextProvider } from "@/context/service-context";

function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAuthReady } = useBaseContext();

  if (!isAuthReady) {
    return <LoadingScreen />;
  }
  return (
    <div
      className="h-screen overflow-hidden relative flex gap-4 p-4"
      style={{
        backgroundColor: "#fffbf5",
        backgroundImage:
          "radial-gradient(at 10% 10%, rgba(251,191,36,.08) 0, transparent 50%), radial-gradient(at 90% 90%, rgba(167,198,172,.1) 0, transparent 50%)",
      }}
    >
      {/* ── Desktop sidebar ── */}
      <div className="hidden lg:block min-w-[220px] w-[22%] max-w-[300px] h-full flex-shrink-0">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Mobile drawer sidebar ── */}
      <div className="lg:hidden">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      {/* ── Main content ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar with hamburger */}
        <div className="lg:hidden flex items-center gap-3 mb-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="w-10 h-10 rounded-xl bg-white border border-stone-100 shadow-sm flex items-center justify-center text-stone-500 hover:text-amber-500 hover:border-amber-100 transition-all flex-shrink-0"
          >
            <Menu size={18} />
          </button>

          {/* Mobile logo */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white shadow-md shadow-amber-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-3.5 h-3.5"
              >
                <path d="M3 22V8l9-6 9 6v14" />
                <rect x="9" y="14" width="6" height="8" />
                <rect x="5" y="10" width="3" height="3" />
                <rect x="16" y="10" width="3" height="3" />
              </svg>
            </div>
            <span className="font-playfair sm:block hidden text-base text-stone-800">
              Concierge<span className="text-amber-500">OS</span>
            </span>
          </div>
        </div>

        {/* Header — desktop only */}
        <div className="hidden lg:block">
          <Header />
        </div>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto scrollbar-hide pt-2 pb-4">
          <RoomContextProvider>
            <ServiveContextProvider>{children}</ServiveContextProvider>
          </RoomContextProvider>
        </div>
      </div>
    </div>
  );
}

export default Layout;
