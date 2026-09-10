"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        // Do NOT use touchMultiplier > 1 — it causes Lenis to "overshoot" on touch
        // and snap back to the top when the user lifts their finger mid-scroll.
        touchMultiplier: 0,   // 0 = disable Lenis touch, let native momentum handle it
        syncTouch: false,     // false = don't hijack native iOS rubber-band scroll
      }}
    >
      {children}
    </ReactLenis>
  );
}
