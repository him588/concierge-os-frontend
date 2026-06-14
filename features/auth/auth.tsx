"use client";

import { useState, JSX, useEffect } from "react";
import { Icons } from "./components/icons/icons";
import { LeftPanel } from "./components/left-panel";
import { AuthMode } from "./components/types/types";
import GoogleAuth from "./components/google-auth";
import AuthForm from "./components/auth-form";
import { useUIContext } from "@/context/ui-context";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ENV } from "@/components/config/env";

// ── Main Auth Page ────────────────────────────────────────────────────────────

export default function AuthPage(): JSX.Element {
  const [mode, setMode] = useState<AuthMode>("login");
  const { setToastMessage, setToastType } = useUIContext();
  const switchMode = (m: AuthMode): void => {
    setMode(m);
  };
  const animKey = mode; // forces re-animation on tab switch

  useEffect(() => {
    console.log(ENV.GOOGLE_CLIENT_ID);
    const msg = sessionStorage.getItem("auth_error");
    if (msg) {
      setToastMessage(msg);
      setToastType("error");
      sessionStorage.removeItem("auth_error");
    }
  }, [setToastType, setToastMessage]);

  return (
    <>
      <div className="bg-mesh font-jakarta min-h-screen flex items-center justify-center p-4">
        <div
          className="w-full max-w-5xl grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-2xl shadow-stone-200/80 border border-stone-100"
          style={{ minHeight: "620px" }}
        >
          {/* ── Left panel ── */}
          <LeftPanel />

          {/* ── Right: auth form ── */}
          <div className="bg-white flex flex-col justify-center px-8 py-10 md:px-12">
            {/* Mobile logo */}
            <div className="flex items-center gap-2 mb-8 lg:hidden">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white">
                <Icons.Hotel />
              </div>
              <span className="font-playfair text-lg text-stone-800">
                Concierge<span className="text-amber-500">OS</span>
              </span>
            </div>

            {/* Tab switcher */}
            <div className="flex bg-stone-100 rounded-2xl p-1 mb-8 fade-up">
              {(["login", "signup"] as AuthMode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => switchMode(m)}
                  className={`tab-pill flex-1 font-jakarta text-sm font-medium py-2.5 rounded-xl capitalize ${
                    mode === m
                      ? "bg-white text-stone-800 shadow-sm"
                      : "text-stone-400 hover:text-stone-600"
                  }`}
                >
                  {m === "login" ? "Sign In" : "Create Account"}
                </button>
              ))}
            </div>

            {/* Heading */}
            <div key={`${animKey}-head`} className="mb-7 slide-r">
              <h1 className="font-playfair text-stone-900 text-2xl mb-1">
                {mode === "login" ? "Welcome back 👋" : "Start for free ✨"}
              </h1>
              <p className="font-jakarta text-sm text-stone-400">
                {mode === "login"
                  ? "Sign in to your hotel dashboard."
                  : "Set up your property in under 5 minutes."}
              </p>
            </div>

            {/* Google button */}

            {ENV.GOOGLE_CLIENT_ID && (
              <GoogleOAuthProvider clientId={ENV.GOOGLE_CLIENT_ID}>
                <GoogleAuth />
              </GoogleOAuthProvider>
            )}

            {/* Divider */}
            <div className="flex items-center gap-3 mb-5 fade-up d2">
              <div className="flex-1 h-px bg-stone-100" />
              <span className="font-jakarta text-[10px] uppercase tracking-widest text-stone-300">
                or
              </span>
              <div className="flex-1 h-px bg-stone-100" />
            </div>
            <AuthForm mode={mode} animKey={animKey} />

            {/* Switch link */}
            <p className="font-jakarta text-xs text-stone-400 text-center mt-5 fade-up">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                type="button"
                onClick={() =>
                  switchMode(mode === "login" ? "signup" : "login")
                }
                className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
              >
                {mode === "login" ? "Sign up free" : "Sign in"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
