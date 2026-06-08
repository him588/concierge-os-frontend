"use client";

import {
  useState,
  useEffect,
  useRef,
  type FC,
  type CSSProperties,
  JSX,
} from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ProblemCardProps {
  icon: string;
  title: string;
  body: string;
  index: number;
}

interface SolutionRowProps {
  icon: JSX.Element;
  title: string;
  body: string;
  tag: string;
  tagColor: string;
  index: number;
}

interface TimelineItemProps {
  year: string;
  event: string;
  sub: string;
  last?: boolean;
}

interface CounterProps {
  end: number;
  suffix: string;
  label: string;
  color: string;
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function useCounter(end: number, active: boolean, duration = 1600) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(end / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else setCount(start);
    }, 16);
    return () => clearInterval(timer);
  }, [active, end, duration]);
  return count;
}

// ── Inline styles ─────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes revealUp {
    from { opacity:0; transform:translateY(36px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes revealLeft {
    from { opacity:0; transform:translateX(-28px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes revealRight {
    from { opacity:0; transform:translateX(28px); }
    to   { opacity:1; transform:translateX(0); }
  }
  @keyframes scaleIn {
    from { opacity:0; transform:scale(.92); }
    to   { opacity:1; transform:scale(1); }
  }
  @keyframes drawLine {
    from { height:0; }
    to   { height:100%; }
  }
  .reveal-up    { animation: revealUp   .7s ease both; }
  .reveal-left  { animation: revealLeft .7s ease both; }
  .reveal-right { animation: revealRight .7s ease both; }
  .scale-in     { animation: scaleIn    .6s ease both; }
  .draw-line    { animation: drawLine   1s .3s ease both; }

  .problem-card:hover .problem-icon { transform:scale(1.15) rotate(-4deg); transition:transform .3s; }
  .problem-icon { transition:transform .3s; }

  .sol-row { transition:background .25s, border-color .25s, box-shadow .25s; }
  .sol-row:hover { background:rgba(255,255,255,.95); box-shadow:0 8px 32px rgba(0,0,0,.07); }

  .gradient-border {
    position:relative;
  }
  .gradient-border::before {
    content:'';
    position:absolute;
    inset:0;
    border-radius:inherit;
    padding:1.5px;
    background:linear-gradient(135deg,#f59e0b,#d97706,#fbbf24);
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;
    mask-composite:exclude;
    pointer-events:none;
  }

  .noise-bg {
    position:relative;
  }
  .noise-bg::after {
    content:'';
    position:absolute;
    inset:0;
    background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.03'/%3E%3C/svg%3E");
    pointer-events:none;
    border-radius:inherit;
  }
`;

// ── SVG Icons ─────────────────────────────────────────────────────────────────

const Icons = {
  Chaos: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  Blind: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  ),
  Broken: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <path d="M8 21h8M12 17v4" />
      <path d="M9 8l6 4-6 4" />
    </svg>
  ),
  Money: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Dashboard: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  Widget: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  Sync: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <polyline points="1 4 1 10 7 10" />
      <path d="M3.51 15a9 9 0 1 0 .49-4.95" />
    </svg>
  ),
  Shield: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  ),
  Quote: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className="w-8 h-8 text-amber-200"
    >
      <path d="M4.58 4C3.1 4 2 5.16 2 6.58v4.84C2 12.84 3.1 14 4.58 14H7.5l-1.64 5.5L10.5 22V14h.42C12.36 14 13.5 12.84 13.5 11.42V6.58C13.5 5.16 12.36 4 10.92 4H4.58zM17.58 4c-1.48 0-2.58 1.16-2.58 2.58v4.84C15 12.84 16.1 14 17.58 14H20.5l-1.64 5.5L23.5 22V14h-.08C24.86 14 26 12.84 26 11.42V6.58C26 5.16 24.86 4 23.42 4h-5.84z" />
    </svg>
  ),
};

// ── Problem Card ──────────────────────────────────────────────────────────────

const ProblemCard: FC<ProblemCardProps> = ({ icon, title, body, index }) => (
  <div
    className="problem-card bg-white/70 border border-stone-100 rounded-2xl p-5 shadow-sm reveal-up"
    style={{ animationDelay: `${index * 0.12}s` } as CSSProperties}
  >
    <div className="problem-icon text-3xl mb-3">{icon}</div>
    <h4 className="font-playfair text-base text-stone-800 mb-1.5">{title}</h4>
    <p className="font-jakarta text-xs text-stone-400 leading-relaxed">
      {body}
    </p>
  </div>
);

// ── Solution Row ──────────────────────────────────────────────────────────────

const SolutionRow: FC<SolutionRowProps> = ({
  icon,
  title,
  body,
  tag,
  tagColor,
  index,
}) => (
  <div
    className="sol-row flex items-start gap-4 p-4 rounded-2xl border border-stone-100 reveal-left"
    style={{ animationDelay: `${index * 0.12}s` } as CSSProperties}
  >
    <div
      className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0"
      style={{ background: tagColor } as CSSProperties}
    >
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <h4 className="font-playfair text-sm text-stone-800">{title}</h4>
        <span
          className="font-jakarta text-[9px] uppercase tracking-widest px-2 py-0.5 rounded-full"
          style={
            { background: `${tagColor}18`, color: tagColor } as CSSProperties
          }
        >
          {tag}
        </span>
      </div>
      <p className="font-jakarta text-xs text-stone-400 leading-relaxed">
        {body}
      </p>
    </div>
  </div>
);

// ── Timeline Item ─────────────────────────────────────────────────────────────

const TimelineItem: FC<TimelineItemProps> = ({
  year,
  event,
  sub,
  last = false,
}) => (
  <div className="flex gap-4">
    <div className="flex flex-col items-center">
      <div className="w-2.5 h-2.5 rounded-full bg-amber-400 flex-shrink-0 mt-0.5 ring-4 ring-amber-50" />
      {!last && <div className="w-px flex-1 bg-amber-100 draw-line mt-1" />}
    </div>
    <div className="pb-6">
      <span className="font-jakarta text-[10px] uppercase tracking-widest text-amber-500">
        {year}
      </span>
      <p className="font-playfair text-sm text-stone-800 mt-0.5">{event}</p>
      <p className="font-jakarta text-xs text-stone-400 mt-0.5">{sub}</p>
    </div>
  </div>
);

// ── Animated Counter ──────────────────────────────────────────────────────────

const AnimatedCounter: FC<CounterProps & { active: boolean }> = ({
  end,
  suffix,
  label,
  color,
  active,
}) => {
  const count = useCounter(end, active);
  return (
    <div className="text-center">
      <p
        className="font-playfair text-4xl font-semibold"
        style={{ color } as CSSProperties}
      >
        {count.toLocaleString()}
        {suffix}
      </p>
      <p className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 mt-1">
        {label}
      </p>
    </div>
  );
};

// ── Main Section ──────────────────────────────────────────────────────────────

export default function WhySection(): JSX.Element {
  const { ref: problemRef, inView: problemInView } = useInView();
  const { ref: solRef, inView: solInView } = useInView();
  const { ref: statsRef, inView: statsInView } = useInView();
  const { ref: quoteRef, inView: quoteInView } = useInView();

  const problems = [
    {
      icon: "🗂️",
      title: "Scattered Tools",
      body: "Hotels juggle 6–8 disconnected apps — PMS, POS, channel managers, Excel sheets — none of which talk to each other.",
    },
    {
      icon: "🌑",
      title: "Zero Visibility",
      body: "Managers wake up not knowing how many rooms are occupied, what revenue was made overnight, or which staff are checked in.",
    },
    {
      icon: "🔌",
      title: "No Guest Widget",
      body: "Most hotel websites still redirect guests to third-party OTAs for booking, leaking 15–25% commission on every reservation.",
    },
    {
      icon: "💸",
      title: "Enterprise Pricing",
      body: "Existing solutions like Opera or Mews cost $500–$2,000/month — completely out of reach for independent and boutique hotels.",
    },
  ];

  const solutions: Omit<SolutionRowProps, "index">[] = [
    {
      icon: <Icons.Dashboard />,
      title: "Unified Operations Dashboard",
      body: "Rooms, revenue, staff, housekeeping, and maintenance — all live in one screen. No tab-switching, no exports.",
      tag: "Core",
      tagColor: "#d97706",
    },
    {
      icon: <Icons.Widget />,
      title: "White-label Booking Widget",
      body: "One script tag on your site and guests book directly. Eliminates OTA commission, keeps branding yours.",
      tag: "Embed",
      tagColor: "#3b82f6",
    },
    {
      icon: <Icons.Sync />,
      title: "Real-time Sync Across Channels",
      body: "Availability updates instantly across Booking.com, Expedia, and your own site — no double bookings.",
      tag: "Sync",
      tagColor: "#059669",
    },
    {
      icon: <Icons.Shield />,
      title: "Affordable & Transparent Pricing",
      body: "Flat monthly fee, no per-booking cuts. Built for boutique and independent hotels, not just enterprise chains.",
      tag: "Pricing",
      tagColor: "#7c3aed",
    },
  ];

  const timeline = [
    {
      year: "The Problem",
      event: "We stayed in a 4-star hotel",
      sub: "and watched the manager handle check-ins on a spreadsheet and WhatsApp.",
    },
    {
      year: "The Research",
      event: "Interviewed 60+ hotel GMs",
      sub: "across Dubai, Bali, and London. 80% said their biggest pain was fragmented software.",
    },
    {
      year: "The Build",
      event: "Started ConciergeOS in 2024",
      sub: "A small team of 4, obsessed with making hotel ops feel as smooth as a 5-star stay.",
    },
    {
      year: "Today",
      event: "3,200+ hotels onboarded",
      sub: "Across 40 countries, managing $4.2B in annual revenue — and growing.",
      last: true,
    },
  ];

  return (
    <>
      <style>{STYLES}</style>

      <section id="features" className="bg-mesh font-jakarta overflow-hidden">
        {/* ═══════════════════════════════════════════
            BLOCK 1 — ORIGIN STORY
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-24 pb-16">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-100 text-amber-600 text-[10px] uppercase tracking-widest px-3.5 py-1.5 rounded-full mb-5 reveal-up">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                Why We Built This
              </div>
              <h2
                className="font-playfair text-stone-900 leading-[1.08] mb-6 reveal-up"
                style={{ fontSize: "clamp(2.2rem,4vw,3.4rem)" }}
              >
                Hotel operations are
                <br />
                <em className="not-italic shimmer-text">
                  still stuck in 2005.
                </em>
              </h2>
              <p className="text-stone-500 text-base leading-relaxed mb-5 reveal-up">
                Most hotels — especially independent and boutique ones — are
                running their entire operation on a patchwork of Excel files,
                WhatsApp groups, and decade-old PMS software that costs a
                fortune and does very little.
              </p>
              <p className="text-stone-500 text-base leading-relaxed reveal-up">
                Guests expect seamless, modern experiences. Hotel teams deserve
                tools that actually help them deliver it. We built ConciergeOS
                to close that gap — one property at a time.
              </p>
            </div>

            {/* Right: timeline */}
            <div
              ref={quoteRef}
              className={`scale-in ${quoteInView ? "" : "opacity-0"}`}
              style={
                quoteInView
                  ? {}
                  : ({ animationPlayState: "paused" } as CSSProperties)
              }
            >
              <div className="gradient-border bg-white/80 rounded-3xl p-8 shadow-lg noise-bg">
                <p className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 mb-6">
                  Our Story
                </p>
                <div className="space-y-0">
                  {timeline.map((t) => (
                    <TimelineItem key={t.year} {...t} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BLOCK 2 — THE PROBLEMS
        ═══════════════════════════════════════════ */}
        <div className="bg-stone-50/70 border-y border-stone-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
            <div className="text-center mb-12">
              <p className="font-jakarta text-[10px] uppercase tracking-widest text-rose-400 mb-3">
                The Problem
              </p>
              <h3
                className="font-playfair text-stone-900 mb-4"
                style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}
              >
                Whats breaking hotel ops today
              </h3>
              <p className="font-jakarta text-stone-400 text-sm max-w-lg mx-auto">
                We spent months talking to hotel managers. The same four pain
                points came up in every single conversation.
              </p>
            </div>
            <div
              ref={problemRef}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
              {problemInView &&
                problems.map((p, i) => (
                  <ProblemCard key={p.title} {...p} index={i} />
                ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BLOCK 3 — THE SOLUTIONS
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            {/* Left: sticky label */}
            <div className="lg:sticky lg:top-28">
              <p className="font-jakarta text-[10px] uppercase tracking-widest text-emerald-500 mb-3">
                The Solution
              </p>
              <h3
                className="font-playfair text-stone-900 leading-tight mb-5"
                style={{ fontSize: "clamp(1.8rem,3vw,2.8rem)" }}
              >
                Everything a hotel needs.
                <br />
                <span className="text-stone-400 font-normal">
                  Nothing it doesnt.
                </span>
              </h3>
              <p className="font-jakarta text-stone-400 text-sm leading-relaxed mb-8">
                ConciergeOS is purpose-built to replace the chaos with a single,
                beautiful platform that any property — from a 12-room guesthouse
                to a 400-room resort — can set up in under an hour.
              </p>

              {/* Big quote */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 relative overflow-hidden">
                <div className="absolute -top-2 -left-1 opacity-30">
                  <Icons.Quote />
                </div>
                <p className="font-playfair text-stone-700 text-base italic leading-relaxed relative z-10">
                  We dont just want to be another SaaS tool. We want to be the
                  operating system for hospitality — invisible, reliable, and
                  powerful
                </p>
                <p className="font-jakarta text-[10px] uppercase tracking-widest text-amber-500 mt-3">
                  — Founder, ConciergeOS
                </p>
              </div>
            </div>

            {/* Right: solution list */}
            <div ref={solRef} className="flex flex-col gap-3">
              {solInView &&
                solutions.map((s, i) => (
                  <SolutionRow key={s.title} {...s} index={i} />
                ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BLOCK 4 — IMPACT NUMBERS
        ═══════════════════════════════════════════ */}
        <div
          className="relative overflow-hidden"
          style={
            {
              background: "linear-gradient(135deg,#0f172a 0%,#1c2a40 100%)",
            } as CSSProperties
          }
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-24 -left-24 w-72 h-72 rounded-full opacity-10 pointer-events-none"
            style={
              {
                background: "radial-gradient(circle,#f59e0b,transparent)",
              } as CSSProperties
            }
          />
          <div
            className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full opacity-10 pointer-events-none"
            style={
              {
                background: "radial-gradient(circle,#34d399,transparent)",
              } as CSSProperties
            }
          />

          <div
            ref={statsRef}
            id="pricing"
            className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20 relative z-10"
          >
            <p className="font-jakarta text-[10px] uppercase tracking-widest text-amber-400 text-center mb-2">
              Why ConciergeOS
            </p>
            <h3
              className="font-playfair text-white text-center mb-14"
              style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)" }}
            >
              Built for hotels that cant afford to wait
            </h3>

            {/* Value pillars — no fake numbers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
              {[
                {
                  icon: "⚡",
                  headline: "Live in < 1 hour",
                  body: "No IT team. No weeks-long onboarding. Connect your property and go.",
                  color: "#f59e0b",
                },
                {
                  icon: "🔒",
                  headline: "99.9% uptime SLA",
                  body: "Built on redundant cloud infrastructure so your front desk never goes dark.",
                  color: "#34d399",
                },
                {
                  icon: "📊",
                  headline: "Real-time, always",
                  body: "Every booking, every room status, every OTA update — reflected instantly.",
                  color: "#60a5fa",
                },
                {
                  icon: "💸",
                  headline: "Fraction of the cost",
                  body: "Start at $49/mo. No hidden add-ons. Cancel any time.",
                  color: "#f472b6",
                },
              ].map(({ icon, headline, body, color }) => (
                <div
                  key={headline}
                  className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col gap-3 hover:bg-white/[0.08] transition-colors duration-300"
                >
                  <span className="text-2xl">{icon}</span>
                  <p
                    className="font-playfair text-lg text-white leading-snug"
                    style={{ color }}
                  >
                    {headline}
                  </p>
                  <p className="font-jakarta text-xs text-stone-400 leading-relaxed">
                    {body}
                  </p>
                </div>
              ))}
            </div>

            {/* Feature comparison table — unchanged, all factual */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-3 text-center border-b border-white/10">
                <div className="p-4 font-jakarta text-[10px] uppercase tracking-widest text-stone-400">
                  Feature
                </div>
                <div className="p-4 font-jakarta text-[10px] uppercase tracking-widest text-stone-400 border-x border-white/10">
                  Legacy PMS
                </div>
                <div className="p-4 font-jakarta text-[10px] uppercase tracking-widest text-amber-400">
                  ConciergeOS
                </div>
              </div>
              {[
                ["Setup Time", "2–6 weeks", "Under 1 hour"],
                ["Booking Widget", "❌ None", "✅ Included"],
                ["Real-time Dashboard", "❌ Reports", "✅ Live data"],
                ["Starting Price", "$500/mo+", "$49/mo"],
                ["Channel Sync", "Add-on cost", "✅ Built-in"],
                ["Mobile App", "Rarely", "✅ Always"],
              ].map(([feat, old, now], i) => (
                <div
                  key={feat}
                  className={`grid grid-cols-3 text-center border-b border-white/5 ${
                    i % 2 === 0 ? "bg-white/[0.02]" : ""
                  }`}
                >
                  <div className="p-3.5 font-jakarta text-xs text-stone-300">
                    {feat}
                  </div>
                  <div className="p-3.5 font-jakarta text-xs text-stone-500 border-x border-white/10">
                    {old}
                  </div>
                  <div className="p-3.5 font-jakarta text-xs text-amber-400 font-medium">
                    {now}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            BLOCK 5 — WHO IT'S FOR
        ═══════════════════════════════════════════ */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-20">
          <p className="font-jakarta text-[10px] uppercase tracking-widest text-stone-400 text-center mb-3">
            Who Its For
          </p>
          <h3
            className="font-playfair text-stone-900 text-center mb-12"
            style={{ fontSize: "clamp(1.8rem,3vw,2.6rem)" }}
          >
            Built for every kind of property
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                emoji: "🏡",
                type: "Boutique Hotels",
                desc: "Under 50 rooms, big on character. We handle the ops so you focus on the experience.",
                pill: "Most popular",
              },
              {
                emoji: "🌴",
                type: "Resorts & Retreats",
                desc: "Multi-amenity properties need complex scheduling. We make it feel simple.",
                pill: null,
              },
              {
                emoji: "🏢",
                type: "Business Hotels",
                desc: "Corporate guests, group bookings, and invoicing — automated and professional.",
                pill: null,
              },
              {
                emoji: "🏨",
                type: "Hotel Chains",
                desc: "Multi-property dashboard, consolidated reporting, and unified brand booking widget.",
                pill: "Enterprise",
              },
            ].map((p, i) => (
              <div
                key={p.type}
                className="relative bg-white/80 border border-stone-100 rounded-2xl p-6 shadow-sm hover-lift reveal-up"
                style={{ animationDelay: `${i * 0.1}s` } as CSSProperties}
              >
                {p.pill && (
                  <span className="absolute top-3 right-3 font-jakarta text-[9px] uppercase tracking-widest bg-amber-50 text-amber-600 border border-amber-100 px-2 py-0.5 rounded-full">
                    {p.pill}
                  </span>
                )}
                <span className="text-3xl block mb-3">{p.emoji}</span>
                <h4 className="font-playfair text-stone-800 text-base mb-2">
                  {p.type}
                </h4>
                <p className="font-jakarta text-xs text-stone-400 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
