"use client";

import { useState, type FC, type CSSProperties, JSX } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

interface TeamMember {
  id: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  initials: string;
  accentColor: string;
  skills: string[];
}

// ── Styles ────────────────────────────────────────────────────────────────────

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

  @keyframes revealUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes lineGrow {
    from { transform: scaleX(0); }
    to   { transform: scaleX(1); }
  }
  @keyframes fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }

  .team-section {
    background: #0c0a09;
    font-family: 'DM Sans', sans-serif;
  }

  .team-heading {
    font-family: 'DM Serif Display', Georgia, serif;
  }

  .member-row {
    transition: background 0.25s ease;
    cursor: pointer;
    position: relative;
  }
  .member-row:hover {
    background: rgba(255,255,255,0.03);
  }
  .member-row.is-open {
    background: rgba(255,255,255,0.04);
  }

  .member-number {
    font-variant-numeric: tabular-nums;
    font-feature-settings: "tnum";
  }

  .expand-panel {
    display: grid;
    grid-template-rows: 0fr;
    transition: grid-template-rows 0.35s ease;
  }
  .expand-panel.open {
    grid-template-rows: 1fr;
  }
  .expand-inner {
    overflow: hidden;
  }

  .skill-pill {
    font-size: 10px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.4);
    padding: 4px 10px;
    border-radius: 100px;
    transition: border-color 0.2s, color 0.2s;
  }
  .skill-pill:hover {
    border-color: rgba(245,158,11,0.4);
    color: rgba(245,158,11,0.8);
  }

  .reveal { animation: revealUp 0.6s ease both; }
  .d1 { animation-delay: 0.05s; }
  .d2 { animation-delay: 0.15s; }
  .d3 { animation-delay: 0.25s; }
  .d4 { animation-delay: 0.35s; }

  .divider-line {
    transform-origin: left;
    animation: lineGrow 0.8s ease both;
    animation-delay: 0.1s;
  }

  .initials-badge {
    font-family: 'DM Serif Display', Georgia, serif;
    font-style: italic;
  }

  .plus-icon {
    transition: transform 0.25s ease;
  }
  .is-open .plus-icon {
    transform: rotate(45deg);
  }
`;

// ── Team Data ─────────────────────────────────────────────────────────────────

const TEAM: TeamMember[] = [
  {
    id: "founder",
    name: "Himanshu",
    role: "Founder & CEO",
    focus: "Product · Strategy · Design · Code · Arcitecture",
    bio: "Built ConciergeOS from the ground up — from the initial concept to every product decision. Brings deep knowledge of the hospitality industry and an obsession with making hotel management genuinely simple.",
    initials: "A",
    accentColor: "#f59e0b",
    skills: ["Product Vision", "Hotel Domain", "UX Design", "Strategy", "GTM"],
  },
];

// ── Member Row ────────────────────────────────────────────────────────────────

const MemberRow: FC<{
  member: TeamMember;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ member, index, isOpen, onToggle }) => {
  return (
    <div className={`reveal d${index + 2}`}>
      {/* Main row */}
      <div
        className={`member-row ${isOpen ? "is-open" : ""} px-0 py-6 md:py-7`}
        onClick={onToggle}
      >
        <div className="flex items-center gap-6 md:gap-10">
          {/* Index number */}
          <span
            className="member-number hidden md:block font-light text-xs tracking-widest shrink-0"
            style={{ color: "rgba(255,255,255,0.15)", minWidth: "2ch" }}
          >
            0{index + 1}
          </span>

          {/* Initials badge */}
          <div
            className="initials-badge w-10 h-10 rounded-full flex items-center justify-center text-base shrink-0"
            style={{
              background: `${member.accentColor}18`,
              border: `1px solid ${member.accentColor}35`,
              color: member.accentColor,
            }}
          >
            {member.initials}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span
                className="team-heading text-white"
                style={{ fontSize: "clamp(1.1rem, 2vw, 1.35rem)" }}
              >
                {member.name}
              </span>
              <span
                className="hidden sm:inline text-xs uppercase tracking-widest font-light"
                style={{ color: "rgba(255,255,255,0.3)" }}
              >
                {member.role}
              </span>
            </div>
            <p
              className="text-xs mt-0.5 tracking-wide font-light sm:hidden"
              style={{ color: "rgba(255,255,255,0.3)" }}
            >
              {member.role}
            </p>
          </div>

          {/* Focus areas — desktop */}
          <p
            className="hidden lg:block text-xs font-light tracking-wide shrink-0"
            style={{ color: "rgba(255,255,255,0.3)", minWidth: "200px" }}
          >
            {member.focus}
          </p>

          {/* Toggle */}
          <div
            className="plus-icon shrink-0 w-6 h-6 flex items-center justify-center rounded-full border"
            style={{ borderColor: "rgba(255,255,255,0.15)" }}
          >
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth="1.5"
            >
              <line x1="5" y1="1" x2="5" y2="9" />
              <line x1="1" y1="5" x2="9" y2="5" />
            </svg>
          </div>
        </div>
      </div>

      {/* Expand panel */}
      <div className={`expand-panel ${isOpen ? "open" : ""}`}>
        <div className="expand-inner">
          <div className="ml-0 md:ml-[calc(2ch+40px+2.5rem)] pb-8 pr-8 pt-1 flex flex-col md:flex-row gap-6 md:gap-12">
            {/* Bio */}
            <p
              className="text-sm font-light leading-relaxed max-w-sm"
              style={{ color: "rgba(255,255,255,0.45)" }}
            >
              {member.bio}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 content-start">
              {member.skills.map((s) => (
                <span key={s} className="skill-pill">
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div
        className="h-px w-full"
        style={{ background: "rgba(255,255,255,0.06)" }}
      />
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────

export default function TeamSection(): JSX.Element {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = (id: string) => setOpenId((prev) => (prev === id ? null : id));

  return (
    <>
      <style>{STYLES}</style>

      <section id="team" className="team-section py-24 px-6 md:px-12 lg:px-20">
        <div className="max-w-5xl mx-auto">
          {/* ── Header ── */}
          <div className="mb-16 reveal d1">
            <p
              className="text-[10px] uppercase tracking-[0.2em] mb-4 font-light"
              style={{ color: "rgba(245,158,11,0.7)" }}
            >
              The Team
            </p>
            <div className="flex items-end justify-between gap-8 flex-wrap">
              <h2
                className="team-heading text-white leading-tight"
                style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
              >
                One builders.
                <br />
                <em style={{ color: "rgba(255,255,255,0.45)" }}>One goal.</em>
              </h2>
              <p
                className="text-sm font-light leading-relaxed max-w-xs"
                style={{ color: "rgba(255,255,255,0.35)" }}
              >
                A lean founding team combining human product judgment with AI
                engineering — shipping fast without cutting corners.
              </p>
            </div>

            {/* Divider */}
            <div
              className="divider-line mt-10 h-px w-full"
              style={{ background: "rgba(255,255,255,0.1)" }}
            />
          </div>

          {/* ── Member List ── */}
          <div>
            {TEAM.map((member, i) => (
              <MemberRow
                key={member.id}
                member={member}
                index={i}
                isOpen={openId === member.id}
                onToggle={() => toggle(member.id)}
              />
            ))}
          </div>

          {/* ── Footer note ── */}
          <div className="mt-14 flex items-center justify-between flex-wrap gap-4 reveal d4">
            <p
              className="text-xs font-light tracking-wide"
              style={{ color: "rgba(255,255,255,0.2)" }}
            >
              Hiring as we grow — reach out at{" "}
              <a
                href="mailto:hk93931212@gmail.com"
                className="cursor-pointer"
                style={{ color: "rgba(245,158,11,0.6)" }}
              >
                hk93931212@gmail.com
              </a>
            </p>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span
                className="text-[10px] uppercase tracking-widest font-light"
                style={{ color: "rgba(255,255,255,0.2)" }}
              >
                Actively building
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
