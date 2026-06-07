// components/BookingWidget.tsx
"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

function WidgetPortal() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const div = document.createElement("div");
    div.style.cssText =
      "position:fixed;z-index:9999;bottom:0;right:0;isolation:isolate;";
    document.body.appendChild(div);
    containerRef.current = div;

    return () => {
      document.body.removeChild(div);
    };
  }, []);

  if (!containerRef.current) return null;

  return createPortal(
    <div
      data-booking-widget=""
      data-hotel-name="The Himanshu"
      data-hotel-id="69b5a814b970ab623ecdb80c"
    />,
    containerRef.current,
  );
}

export default function BookingWidget() {
  return (
    <>
      <WidgetPortal />
      <Script
        src="https://widget.conciergeservice.in/widget.js"
        strategy="lazyOnload"
      />
    </>
  );
}
