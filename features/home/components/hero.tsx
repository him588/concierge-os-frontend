"use client";

import { type CSSProperties, JSX } from "react";
import ReviewPanel from "./review-panel";
import { Icons } from "./icons/icons";
import { BookingWidgetPreview } from "./booking-widget";
import { NavLink, TickerItem, StatItem } from "./types/types";
import {
  NAV_LINKS,
  TICKER_ITEMS,
  STATS,
  CDN_URL,
  FEATURES,
} from "./types/const";
import { MetricChip } from "./metric-chips";
import { DashboardCard } from "./dashboard-card";
import { useRouter } from "next/navigation";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,700;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600&display=swap');

  .font-playfair { font-family: 'Playfair Display', serif; }
  .font-jakarta  { font-family: 'Plus Jakarta Sans', sans-serif; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes floatA {
    0%, 100% { transform: translateY(0px) rotate(-1deg); }
    50%       { transform: translateY(-12px) rotate(1deg); }
  }
  @keyframes floatB {
    0%, 100% { transform: translateY(0px) rotate(1deg); }
    50%       { transform: translateY(-8px) rotate(-1deg); }
  }
  @keyframes shimmer {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: .4; transform: scale(1.6); }
  }
  @keyframes ticker {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes progressBar {
    from { width: 0; }
    to   { width: var(--progress-w); }
  }
  @keyframes countUp {
    from { opacity: 0; transform: translateY(8px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .anim-fade-up  { animation: fadeUp .7s ease both; }
  .anim-fade-in  { animation: fadeIn .6s ease both; }
  .anim-float-a  { animation: floatA 7s ease-in-out infinite; }
  .anim-float-b  { animation: floatB 9s 1s ease-in-out infinite; }
  .anim-float-c  { animation: floatA 6s 2s ease-in-out infinite; }

  .delay-1 { animation-delay: .15s; }
  .delay-2 { animation-delay: .3s; }
  .delay-3 { animation-delay: .45s; }
  .delay-4 { animation-delay: .6s; }
  .delay-5 { animation-delay: .75s; }

  .shimmer-text {
    background: linear-gradient(90deg, #92400e 0%, #d97706 40%, #f59e0b 50%, #d97706 60%, #92400e 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  .progress-bar { animation: progressBar 1.4s .8s ease both; }
  .pulse-dot    { animation: pulseDot 2s infinite; }

  input:focus, select:focus {
    outline: none;
    border-color: #d97706 !important;
    box-shadow: 0 0 0 3px rgba(217,119,6,.12);
  }

  .hover-lift { transition: transform .2s, box-shadow .2s; }
  .hover-lift:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(0,0,0,.12); }

  .btn-shine { position: relative; overflow: hidden; }
  .btn-shine::after {
    content: '';
    position: absolute;
    top: 0; left: -100%;
    width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,.35), transparent);
    transform: skewX(-20deg);
    transition: left .5s;
  }
  .btn-shine:hover::after { left: 140%; }

  .ticker-track { animation: ticker 28s linear infinite; }

  .card-glass {
    background: rgba(255,255,255,.75);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  .bg-mesh {
    background-color: #fffbf5;
    background-image:
      radial-gradient(at 20% 20%, rgba(251,191,36,.12) 0, transparent 55%),
      radial-gradient(at 80% 10%, rgba(167,198,172,.18) 0, transparent 50%),
      radial-gradient(at 60% 80%, rgba(251,191,36,.08) 0, transparent 45%),
      radial-gradient(at 10% 75%, rgba(167,198,172,.12) 0, transparent 50%);
  }

  .modal-overlay { animation: fadeIn .25s ease both; }
  .modal-card    { animation: fadeUp .3s ease both; }

  ::-webkit-scrollbar { width: 6px; }
  ::-webkit-scrollbar-track { background: #fef9ee; }
  ::-webkit-scrollbar-thumb { background: #e5c88a; border-radius: 3px; }
`;

export default function HeroSection(): JSX.Element {
  const router = useRouter();
  return (
    <>
      <style>{STYLES}</style>

      {/* ── NAV ── */}
      <nav
        className="font-jakarta fixed top-0 inset-x-0 z-40 flex items-center justify-between px-8 py-4 anim-fade-in"
        style={
          {
            background: "rgba(255,251,245,.85)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(231,212,180,.4)",
          } as CSSProperties
        }
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-200 text-white">
            <Icons.Hotel />
          </div>
          <span className="font-playfair text-lg text-stone-800 font-medium">
            Concierge<span className="text-amber-500">OS</span>
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-[11px] uppercase tracking-widest text-stone-400">
          {NAV_LINKS.map(({ name, route }: NavLink) => (
            <a
              key={name}
              href={route}
              className="hover:text-stone-700 transition-colors"
            >
              {name}
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => router.push("/login")}
          className="btn-shine hidden md:flex items-center gap-2 bg-stone-900 text-white text-[11px] uppercase tracking-widest px-4 py-2.5 rounded-xl font-medium hover:bg-stone-800 transition-colors"
        >
          Get Started <Icons.Arrow />
        </button>
      </nav>

      {/* ── TICKER ── */}
      <div
        className="fixed top-[60px]   inset-x-0 z-30 overflow-hidden border-b font-jakarta"
        style={
          {
            borderColor: "rgba(231,212,180,.5)",
            background: "rgba(255,251,245,.9)",
            backdropFilter: "blur(10px)",
          } as CSSProperties
        }
      >
        <div className="flex mt-[8px] ticker-track whitespace-nowrap py-1.5">
          {[0, 1].map((rep: number) => (
            <span key={rep} className="flex ">
              {TICKER_ITEMS.map(({ text }: TickerItem, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-2 mx-8 text-[10px] uppercase tracking-widest text-stone-400"
                >
                  <span className="w-1 h-1 rounded-full bg-amber-400 flex-shrink-0" />
                  {text}
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>

      {/* ── PAGE ── */}
      <div className="bg-mesh font-jakarta min-h-screen">
        {/* ── HERO ── */}
        <section className="relative pt-36 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden">
          {/* Decorative rings */}
          <div className="pointer-events-none absolute -right-32 -top-32 w-[500px] h-[500px] rounded-full border border-amber-100/60" />
          <div className="pointer-events-none absolute -right-24 -top-24 w-[360px] h-[360px] rounded-full border border-amber-200/40" />

          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
            {/* ── LEFT ── */}
            <div>
              <div className="anim-fade-up delay-1 inline-flex items-center gap-2 border border-amber-200 bg-amber-50 text-amber-700 text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 pulse-dot" />
                Premium Hotel Management Platform
              </div>

              <h1
                className="font-playfair anim-fade-up delay-2 text-stone-900 leading-[1.05] mb-6"
                style={
                  { fontSize: "clamp(2.8rem,5vw,4.4rem)" } as CSSProperties
                }
              >
                Run your hotel
                <br />
                with <em className="shimmer-text not-italic">effortless</em>
                <br />
                precision.
              </h1>

              <p className="anim-fade-up delay-3 text-stone-500 text-base leading-relaxed max-w-[420px] mb-8">
                One intelligent platform to manage rooms, reservations, staff,
                and revenue — plus a white-label booking widget you can embed on
                any website in seconds.
              </p>

              <div className="anim-fade-up delay-4 flex flex-wrap items-center gap-3 mb-10">
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="btn-shine flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-medium px-6 py-3.5 rounded-2xl shadow-lg shadow-amber-200 hover-lift"
                >
                  Register Your Hotel <Icons.Arrow />
                </button>
                <button
                  type="button"
                  onClick={() => router.push("/login")}
                  className="flex items-center gap-2 text-stone-500 text-sm border border-stone-200 bg-white/80 px-5 py-3.5 rounded-2xl hover:border-stone-300 hover-lift transition-all"
                >
                  <Icons.Chart /> View Live Demo
                </button>
              </div>

              {/* Stats */}
              {/* <div className="anim-fade-up delay-5 flex flex-wrap gap-6 pt-8 border-t border-stone-100">
                {STATS.map((s: StatItem) => (
                  <div key={s.label}>
                    <p className="font-playfair text-2xl text-stone-800 font-medium flex items-center gap-1">
                      {s.num} {s.icon && <Icons.Star />}
                    </p>
                    <p className="text-[11px] uppercase tracking-widest text-stone-400 mt-0.5">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div> */}
            </div>

            {/* ── RIGHT ── */}
            <div className="relative anim-fade-up delay-3 flex items-center justify-center">
              <MetricChip
                icon={<Icons.Bed />}
                label="Occupancy"
                value="87%"
                sub="+4% today"
                color="linear-gradient(135deg,#f59e0b,#d97706)"
                className="absolute -top-4 -left-4 z-20 anim-float-a"
              />
              <MetricChip
                icon={<Icons.Chart />}
                label="Revenue"
                value="$24.8k"
                sub="+12% today"
                color="linear-gradient(135deg,#34d399,#059669)"
                className="absolute -bottom-4 -left-4 z-20 anim-float-b"
              />
              <MetricChip
                icon={<Icons.Globe />}
                label="Bookings"
                value="12 new"
                color="linear-gradient(135deg,#60a5fa,#3b82f6)"
                className="absolute -top-6 right-0 z-20 anim-float-c"
              />
              <DashboardCard />
            </div>
          </div>
        </section>

        {/* ── REGISTRATION FORM ── */}
        <section className="px-6 md:px-12 lg:px-20 pb-20">
          <div className="max-w-7xl mx-auto">
            <div className="bg-white/80 border border-stone-100 rounded-3xl shadow-xl shadow-stone-100/60 overflow-hidden">
              <div className="grid lg:grid-cols-5">
                {/* Form side */}
                <ReviewPanel />

                {/* Preview side */}
                <div className="lg:col-span-2 bg-gradient-to-br from-amber-50 to-orange-50/40 border-l border-stone-100 p-8 flex flex-col gap-6 justify-center">
                  <div>
                    <p className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 mb-3">
                      Booking Widget Preview
                    </p>
                    <BookingWidgetPreview />
                  </div>

                  <div className="bg-white/70 border border-stone-100 rounded-2xl p-4">
                    <p className="font-jakarta text-[9px] uppercase tracking-widest text-stone-400 mb-3">
                      Embed Snippet
                    </p>
                    <div className="bg-stone-900 rounded-xl p-3 font-mono text-[9px] leading-relaxed">
                      <span className="text-purple-400">&lt;script </span>
                      <span className="text-amber-400">src</span>
                      <span className="text-stone-400">=</span>
                      <span className="text-green-400 break-all">
                        &quot;{CDN_URL}&quot;
                      </span>
                      <span className="text-purple-400">
                        &gt;&lt;/script&gt;
                      </span>
                      <br />
                      <span className="text-purple-400">&lt;div </span>
                      <span className="text-amber-400">data-hotel-id</span>
                      <span className="text-stone-400">=</span>
                      <span className="text-green-400">
                        &quot;YOUR_ID&quot;
                      </span>
                      <span className="text-purple-400">/&gt;</span>
                    </div>
                  </div>

                  {/* Feature checklist */}
                  <div className="space-y-2">
                    {FEATURES.map((f: string) => (
                      <div key={f} className="flex items-center gap-2.5">
                        <div className="w-4 h-4 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-500 flex-shrink-0">
                          <Icons.Check />
                        </div>
                        <p className="font-jakarta text-xs text-stone-500">
                          {f}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
