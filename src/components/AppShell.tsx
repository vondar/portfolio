"use client";

import React, { useEffect, useRef, useState } from "react";
import ThemeProvider from "./ThemeProvider";
import Navbar from "./Navbar";
import AccessibilityPanel from "./AccessibilityPanel";
import ParticleBackdrop from "./ParticleBackdrop";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useStore } from "@/store/useStore";
import { sound } from "@/utils/sonification";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const audioEnabled = useStore((state) => state.audioEnabled);
  const pendingMouseRef = useRef<{ x: number; y: number } | null>(null);
  const rafRef = useRef(0);

  const toggleA11y = () => setIsA11yOpen((prev) => !prev);
  const closeA11y = () => setIsA11yOpen(false);

  useKeyboardShortcuts();

  useEffect(() => {
    sound.setEnabled(audioEnabled);
  }, [audioEnabled]);

  useEffect(() => {
    const root = document.documentElement;

    const flushMouseVars = () => {
      const point = pendingMouseRef.current;
      if (point) {
        const xPercent = (point.x / window.innerWidth) * 100;
        const yPercent = (point.y / window.innerHeight) * 100;
        const xTilt = (xPercent - 50) / 50;
        const yTilt = (yPercent - 50) / 50;

        root.style.setProperty("--mouse-x", `${xPercent}%`);
        root.style.setProperty("--mouse-y", `${yPercent}%`);
        root.style.setProperty("--mouse-x-tilt", xTilt.toFixed(3));
        root.style.setProperty("--mouse-y-tilt", yTilt.toFixed(3));
        pendingMouseRef.current = null;
      }

      rafRef.current = requestAnimationFrame(flushMouseVars);
    };

    const handleMouseMove = (event: MouseEvent) => {
      pendingMouseRef.current = { x: event.clientX, y: event.clientY };
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(flushMouseVars);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <ThemeProvider>
      {/* Background Cyber-grid decoration (hidden in cognitive-focus mode via globals.css class) */}
      <div className="cyber-grid cognitive-decor" />
      
      {/* Cyber scanlines overlay (hidden in cognitive-focus mode via globals.css class) */}
      <div className="cyber-scanlines cognitive-decor" />
      <div className="ambient-aurora cognitive-decor" />
      <ParticleBackdrop />
      
      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar onToggleA11y={toggleA11y} />
        <main className="flex-1 flex flex-col">{children}</main>
      </div>

      <AccessibilityPanel isOpen={isA11yOpen} onClose={closeA11y} />
    </ThemeProvider>
  );
}
