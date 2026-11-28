// components/transitions/CountUp.tsx
"use client";

import React, { useEffect, useState } from "react";

interface CountUpProps {
  end: number;
  duration?: number; // in ms, default 650
  prefix?: string;
  suffix?: string;
  formatRupiah?: boolean;
}

export default function CountUp({
  end,
  duration = 650,
  prefix = "",
  suffix = "",
  formatRupiah = false,
}: CountUpProps) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    // Respect reduced motion
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCurrent(end);
      return;
    }

    let startTimestamp: number | null = null;
    let animationFrameId: number;

    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      
      // Ease out quartic curve for silky deceleration
      const easeOut = 1 - Math.pow(1 - progress, 4);
      setCurrent(Math.round(easeOut * end));

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setCurrent(end);
      }
    };

    animationFrameId = requestAnimationFrame(step);

    return () => cancelAnimationFrame(animationFrameId);
  }, [end, duration]);

  const displayValue = formatRupiah
    ? `Rp ${current.toLocaleString("id-ID")}`
    : `${prefix}${current.toLocaleString("id-ID")}${suffix}`;

  return <span>{displayValue}</span>;
}
