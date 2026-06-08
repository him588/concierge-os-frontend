import { ReactNode } from "react";

export interface MetricChipProps {
  icon: ReactNode;
  label: string;
  value: string;
  sub?: string;
  color: string;
  className?: string;
  animClass?: string;
}

export interface InputFieldProps {
  label: string;
  type?: "text" | "email" | "tel" | "number" | "password";
  placeholder?: string;
  options?: string[];
  fullWidth?: boolean;
}

export interface CopyButtonProps {
  text: string;
  className?: string;
}

export interface SuccessModalProps {
  onClose: () => void;
}

export interface StatItem {
  num: string;
  label: string;
  icon?: boolean;
}

export interface MetricItem {
  k: string;
  v: string;
  up: boolean;
}

export interface RoomStatusItem {
  label: string;
  pct: number;
  color: string;
}

export interface BookingField {
  l: string;
  v: string;
}

export interface TickerItem {
  text: string;
}

export interface NavLink {
  name: string;
  route: string;
}
