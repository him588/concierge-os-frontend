import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { UiContextProvider } from "@/context/ui-context";
import BaseContextProvider from "@/context/base-context";
import { QueryContextProvider } from "@/context/query-context";
import "./globals.css";
import BookingWidget from "@/components/BookingWidget";

const geistSans = Plus_Jakarta_Sans({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ConciergeOS | Hotel Property Management System",
  description:
    "ConciergeOS is a full-stack hotel property management platform for managing rooms, bookings, staff, services, and payments — all in one dashboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable}  antialiased`}>
        <QueryContextProvider>
          <UiContextProvider>
            <BaseContextProvider>{children}</BaseContextProvider>
          </UiContextProvider>
        </QueryContextProvider>
      </body>
    </html>
  );
}
