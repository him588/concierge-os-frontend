"use client";

import { useState, type FC, type CSSProperties, JSX } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface SocialLink {
  label: string;
  icon: JSX.Element;
  href: string;
}

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @keyframes revealUp {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes shimmerFooter {
    0%   { background-position: 200% center; }
    100% { background-position: -200% center; }
  }
  @keyframes floatOrb {
    0%,100% { transform:translateY(0) scale(1); }
    50%      { transform:translateY(-18px) scale(1.04); }
  }
  @keyframes marquee {
    from { transform: translateX(0); }
    to   { transform: translateX(-50%); }
  }

  .footer-reveal { animation: revealUp .65s ease both; }

  .footer-link {
    transition: color .2s, padding-left .2s;
    position: relative;
  }
  .footer-link::before {
    content: '';
    position: absolute;
    left: 0; top: 50%;
    transform: translateY(-50%);
    width: 0; height: 1px;
    background: #f59e0b;
    transition: width .25s;
  }
  .footer-link:hover { color: #92400e; padding-left: 12px; }
  .footer-link:hover::before { width: 8px; }

  .footer-input:focus {
    outline: none;
    border-color: #d97706;
    box-shadow: 0 0 0 3px rgba(217,119,6,.1);
  }

  .social-btn {
    transition: background .2s, border-color .2s, transform .2s;
  }
  .social-btn:hover {
    background: rgba(217,119,6,.08);
    border-color: rgba(217,119,6,.4);
    transform: translateY(-2px);
  }

  .orb-a { animation: floatOrb 9s ease-in-out infinite; }
  .orb-b { animation: floatOrb 12s 2s ease-in-out infinite; }

  .marquee-track { animation: marquee 28s linear infinite; }

  .shimmer-footer {
    background: linear-gradient(90deg, #92400e 0%, #d97706 40%, #f59e0b 50%, #d97706 60%, #92400e 100%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmerFooter 4s linear infinite;
  }

  .bottom-link {
    transition: color .2s;
  }
  .bottom-link:hover { color: #d97706; }
`;

// ── Icons ─────────────────────────────────────────────────────────────────────

const Icons = {
  Twitter: (): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Linkedin: (): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  ),
  Github: (): JSX.Element => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  ),
  Mail: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
  Hotel: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-4 h-4"
    >
      <path d="M3 22V8l9-6 9 6v14" />
      <rect x="9" y="14" width="6" height="8" />
      <rect x="5" y="10" width="3" height="3" />
      <rect x="16" y="10" width="3" height="3" />
    </svg>
  ),
  Arrow: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  MapPin: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  ),
  Phone: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3.5 h-3.5"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1.27h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l.81-.81a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.73 16z" />
    </svg>
  ),
  Check: (): JSX.Element => (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-3 h-3"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  ),
};

// ── Data ──────────────────────────────────────────────────────────────────────

const SOCIALS: SocialLink[] = [
  {
    label: "LinkedIn",
    icon: <Icons.Linkedin />,
    href: "https://www.linkedin.com/in/himanshu-kashyap-920136226/",
  },
  {
    label: "GitHub",
    icon: <Icons.Github />,
    href: "https://github.com/him588",
  },
  { label: "Email", icon: <Icons.Mail />, href: "mailto:hk93931212@gmail.com" },
];

const NewsletterBox: FC = () => {
  const [email, setEmail] = useState<string>("");
  const [sent, setSent] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (!email.trim()) return;
    setSent(true);
    setEmail("");
  };

  return (
    <div
      className="relative rounded-3xl p-8 overflow-hidden"
      style={
        {
          background: "linear-gradient(135deg,#1c1917,#292524)",
        } as CSSProperties
      }
    >
      {/* Orbs */}
      <div
        className="orb-a absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none opacity-20"
        style={
          {
            background: "radial-gradient(circle,#f59e0b,transparent)",
          } as CSSProperties
        }
      />
      <div
        className="orb-b absolute -bottom-8 -left-8 w-32 h-32 rounded-full pointer-events-none opacity-15"
        style={
          {
            background: "radial-gradient(circle,#34d399,transparent)",
          } as CSSProperties
        }
      />

      <p className="font-jakarta text-[10px] uppercase tracking-widest text-amber-400 mb-2">
        Stay in the loop
      </p>
      <h3 className="font-playfair text-white text-2xl mb-1 leading-tight">
        Hotel ops tips,
        <br />
        <span className="shimmer-footer">every two weeks.</span>
      </h3>
      <p className="font-jakarta text-xs text-stone-400 mb-5 leading-relaxed">
        No spam. Just practical insights for hoteliers and product updates from
        the team.
      </p>

      {sent ? (
        <div className="flex items-center gap-2 bg-emerald-900/40 border border-emerald-700/40 text-emerald-400 rounded-xl px-4 py-3">
          <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center flex-shrink-0">
            <Icons.Check />
          </div>
          <p className="font-jakarta text-xs">Youre in! Check your inbox.</p>
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            placeholder="gm@yourhotel.com"
            className="footer-input flex-1 font-jakarta text-sm text-white placeholder-stone-500 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 transition-all"
          />
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-jakarta text-xs font-medium px-4 py-2.5 rounded-xl whitespace-nowrap hover:opacity-90 transition-opacity"
          >
            Subscribe <Icons.Arrow />
          </button>
        </div>
      )}

      <p className="font-jakarta text-[9px] text-stone-500 mt-3">
        Join 4,800+ hoteliers already subscribed · Unsubscribe anytime
      </p>
    </div>
  );
};

// ── Main Footer ───────────────────────────────────────────────────────────────

export default function FooterSection(): JSX.Element {
  return (
    <>
      <style>{STYLES}</style>

      <footer
        className="font-jakarta"
        style={{ background: "#fafaf9" } as CSSProperties}
      >
        {/* ── Marquee banner ── */}

        {/* ── Main body ── */}
        <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 pt-16 pb-10">
          {/* Top row */}
          <div className="grid lg:grid-cols-2 gap-12 mb-14 items-start">
            {/* Brand column */}
            <div className="flex flex-col gap-5 footer-reveal">
              {/* Logo */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md shadow-amber-100 text-white">
                  <Icons.Hotel />
                </div>
                <span className="font-playfair text-xl text-stone-800 font-medium">
                  Concierge<span className="text-amber-500">OS</span>
                </span>
              </div>

              <p className="font-jakarta text-sm text-stone-400 leading-relaxed max-w-[280px]">
                The operating system for modern hospitality. Manage every room,
                reservation, and revenue stream — all from one place.
              </p>

              {/* Contact info */}
              <div className="flex flex-col gap-2">
                {[
                  { icon: <Icons.MapPin />, text: "Delhi · India " },
                  { icon: <Icons.Phone />, text: "+91 8447162049" },
                  { icon: <Icons.Mail />, text: "hk93931212@gmail.com" },
                ].map((c) => (
                  <div
                    key={c.text}
                    className="flex items-center gap-2 text-stone-400"
                  >
                    <span className="text-amber-400 flex-shrink-0">
                      {c.icon}
                    </span>
                    <span className="font-jakarta text-xs">{c.text}</span>
                  </div>
                ))}
              </div>

              {/* Socials */}
              <div className="flex gap-2 pt-1">
                {SOCIALS.map((s: SocialLink) => (
                  <a
                    key={s.label}
                    target="_blank"
                    href={s.href}
                    aria-label={s.label}
                    className="social-btn w-8 h-8 rounded-xl border border-stone-200 bg-white flex items-center justify-center text-stone-400"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div
              className="footer-reveal"
              style={{ animationDelay: ".15s" } as CSSProperties}
            >
              <NewsletterBox />
            </div>
          </div>

          {/* Divider with logo watermark */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-x-0 top-1/2 h-px bg-stone-200" />
            <div className="relative bg-stone-50 px-4">
              <span className="font-playfair text-stone-200 text-4xl font-bold tracking-widest select-none">
                CONCIERGEOS
              </span>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="font-jakarta text-[11px] text-stone-400 text-center md:text-left">
              © {new Date().getFullYear()} ConciergeOS. All rights reserved.{" "}
              Built with ☕ by a human & build by me.
            </p>

            <div className="flex items-center gap-4 flex-wrap justify-center">
              {["Privacy", "Terms", "Cookies", "Security"].map((l: string) => (
                <a
                  key={l}
                  href="#"
                  className="bottom-link font-jakarta text-[11px] text-stone-400"
                >
                  {l}
                </a>
              ))}
            </div>

            {/* Made by stack */}
            <div className="flex items-center gap-2">
              <p className="font-jakarta text-[10px] text-stone-300 uppercase tracking-widest">
                Built by
              </p>
              <div className="flex -space-x-2">
                {[
                  {
                    bg: "linear-gradient(135deg,#fbbf24,#d97706)",
                    label: "👤",
                  },
                  {
                    bg: "linear-gradient(135deg,#34d399,#059669)",
                    label: "🤖",
                  },
                  { bg: "linear-gradient(135deg,#a78bfa,#6d28d9)", label: "✦" },
                ].map((a, i: number) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full border-2 border-stone-50 flex items-center justify-center text-[10px] shadow-sm"
                    style={{ background: a.bg } as CSSProperties}
                  >
                    {a.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
