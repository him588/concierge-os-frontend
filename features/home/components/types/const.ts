import { NavLink, TickerItem, StatItem } from "./types";

export const CDN_URL = "https://cdn.concierge-os.com/widget/v2/booking.js";

export const NAV_LINKS: NavLink[] = [
  { name: "Features", route: "#features" },
  { name: "Teams", route: "#teams" },
  { name: "Pricing", route: "#pricing" },
  { name: "Docs", route: "#docs" },
];

export const TICKER_ITEMS: TickerItem[] = [
  { text: "3,200+ Hotels Worldwide" },
  { text: "98.9% Uptime SLA" },
  { text: "White-label Booking Widget" },
  { text: "Real-time Revenue Sync" },
  { text: "24/7 Support" },
  { text: "Channel Manager Included" },
];

export const STATS: StatItem[] = [
  { num: "3,200+", label: "Hotels trust us" },
  { num: "98.9%", label: "Uptime guarantee" },
  { num: "$4.2B", label: "Revenue managed" },
  { num: "4.9", label: "Average rating", icon: true },
];

export const FEATURES: string[] = [
  "Real-time availability sync",
  "Mobile-responsive widget",
  "Custom branding & colours",
  "PCI-compliant payments",
];
