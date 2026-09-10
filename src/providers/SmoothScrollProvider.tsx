"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode, useEffect, useState } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Detect touch-primary devices (phones/tablets).
    // On these, Lenis intercepts touchmove and causes the page to
    // overshoot-then-snap-to-top when the user lifts their finger mid-scroll.
    // We completely bypass Lenis on touch devices and rely on native scroll.
    setIsTouchDevice(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  // On mobile/touch → render children directly (native scroll, no Lenis)
  if (isTouchDevice) {
    return <>{children}</>;
  }

  // On desktop → Lenis smooth-scroll only for mouse wheel
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.0,
        smoothWheel: true,
        wheelMultiplier: 0.85,
        touchMultiplier: 0,
        syncTouch: false,
      }}
    >
      {children}
    </ReactLenis>
  );
}
