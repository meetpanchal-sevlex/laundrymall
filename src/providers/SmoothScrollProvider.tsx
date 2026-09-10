"use client";

import { ReactLenis } from "lenis/react";
import { ReactNode } from "react";

export default function SmoothScrollProvider({ children }: { children: ReactNode }) {
 return (
 <ReactLenis
 root
 options={{
 lerp: 0.1,
 duration: 1.2,
 smoothWheel: true,
 wheelMultiplier: 0.9,
 touchMultiplier: 1.5,
 }}
 >
 {children}
 </ReactLenis>
 );
}
