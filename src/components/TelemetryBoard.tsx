"use client";

import React, { useEffect, useRef } from "react";
import { Cpu } from "lucide-react";
import { useStore } from "@/store/useStore";

export default function TelemetryBoard() {
  const { role, theme, motion, contrast, cognitiveMode, dyslexiaFont, audioEnabled } = useStore();
  const fpsRef = useRef<HTMLSpanElement>(null);
  const heapRef = useRef<HTMLSpanElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frameCount = 0;
    let lastFrameTime = performance.now();
    let rafId = 0;
    let clockTimer = 0;

    const measureFPS = () => {
      frameCount += 1;
      const now = performance.now();

      if (now >= lastFrameTime + 1000) {
        const fps = Math.round((frameCount * 1000) / (now - lastFrameTime));
        if (fpsRef.current) {
          fpsRef.current.textContent = `${fps} FPS`;
        }

        const memory = (performance as Performance & {
          memory?: { usedJSHeapSize: number };
        }).memory;
        if (heapRef.current) {
          heapRef.current.textContent = memory
            ? `${(memory.usedJSHeapSize / 1048576).toFixed(1)} MB`
            : "API BLOCKED";
        }

        frameCount = 0;
        lastFrameTime = now;
      }

      rafId = requestAnimationFrame(measureFPS);
    };

    const updateClock = () => {
      if (clockRef.current) {
        clockRef.current.textContent = new Date().toLocaleTimeString();
      }
    };

    updateClock();
    clockTimer = window.setInterval(updateClock, 1000);
    rafId = requestAnimationFrame(measureFPS);

    return () => {
      cancelAnimationFrame(rafId);
      window.clearInterval(clockTimer);
    };
  }, []);

  return (
    <div
      id="diagnostics"
      className="spatial-card rounded-lg p-6 font-mono text-xs"
    >
      <div className="mb-4 flex items-center justify-between border-b border-border-color pb-3">
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-accent" />
          <span className="font-semibold uppercase tracking-wider text-text-primary">
            Quantum Telemetry Board
          </span>
        </div>
        <span ref={clockRef} className="text-accent-pink">
          SYSTEM_ONLINE
        </span>
      </div>

      <div className="space-y-3.5">
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">ACTIVE_ROLE:</span>
          <span className="font-bold uppercase text-accent">{role}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">THEME_CORE:</span>
          <span className="uppercase text-text-primary">{theme}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">MOTION_TIMING:</span>
          <span className={`uppercase ${motion === "reduced" ? "font-semibold text-accent-pink" : "text-text-primary"}`}>
            {motion}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">CONTRAST_RATIO:</span>
          <span className="uppercase text-text-primary">{contrast}</span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">COGNITIVE_LOAD:</span>
          <span className={`uppercase ${cognitiveMode === "focus" ? "font-semibold text-accent" : "text-text-primary"}`}>
            {cognitiveMode}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">DYSLEXIA_FONT:</span>
          <span className={dyslexiaFont ? "text-accent" : "text-text-secondary"}>
            {dyslexiaFont ? "ENABLED" : "DISABLED"}
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">ENGINE_FPS:</span>
          <span ref={fpsRef} className="text-emerald-400">
            0 FPS
          </span>
        </div>
        <div className="flex items-center justify-between border-b border-border-color/50 py-1.5">
          <span className="text-text-secondary">HEAP_USAGE:</span>
          <span ref={heapRef} className="text-emerald-400">
            MEASURING...
          </span>
        </div>
        <div className="flex items-center justify-between py-1.5">
          <span className="text-text-secondary">AUDIO_HAPTICS:</span>
          <span className={audioEnabled ? "text-accent" : "text-text-secondary"}>
            {audioEnabled ? "ENABLED" : "DISABLED"}
          </span>
        </div>
      </div>
    </div>
  );
}
