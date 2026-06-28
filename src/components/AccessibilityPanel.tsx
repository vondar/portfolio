"use client";

import React, { useRef, useEffect } from "react";
import { useStore, Theme, MotionMode, ContrastMode, CognitiveMode, UserRole } from "@/store/useStore";
import { X, Eye, EyeOff, Sparkles, Smile, Zap, ZapOff, Check } from "lucide-react";

interface AccessibilityPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AccessibilityPanel({ isOpen, onClose }: AccessibilityPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  
  const {
    theme,
    setTheme,
    motion,
    setMotion,
    contrast,
    setContrast,
    cognitiveMode,
    setCognitiveMode,
    dyslexiaFont,
    toggleDyslexiaFont,
    role,
    setRole,
  } = useStore();

  // Close when clicking outside of the panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        !panelRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs transition-opacity duration-300">
      {/* Drawer */}
      <div
        ref={panelRef}
        className="w-full max-w-md border-l border-border-color bg-bg-secondary p-6 shadow-2xl overflow-y-auto flex flex-col justify-between"
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border-color pb-4 mb-6">
            <div className="flex flex-col">
              <span className="font-mono text-xs text-accent tracking-[0.15em] uppercase">
                Control Matrix //
              </span>
              <h2 className="text-xl font-bold tracking-tight text-text-primary">
                A11y & Theme Settings
              </h2>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 hover:bg-bg-primary border border-border-color transition-colors"
              aria-label="Close settings panel"
            >
              <X className="h-5 w-5 text-text-secondary hover:text-text-primary" />
            </button>
          </div>

          {/* Theme Section */}
          <div className="mb-6">
            <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">
              Theme Interface
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(["cyberpunk", "minimal", "dark", "light"] as Theme[]).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`relative flex items-center justify-between rounded-lg border p-3 text-left transition-all ${
                    theme === t
                      ? "border-accent bg-bg-primary text-text-primary shadow-[0_0_8px_var(--accent-glow)]"
                      : "border-border-color bg-bg-primary/20 text-text-secondary hover:border-text-secondary hover:text-text-primary"
                  }`}
                >
                  <span className="text-xs font-mono capitalize tracking-wide">{t}</span>
                  {theme === t && <Check className="h-3.5 w-3.5 text-accent" />}
                </button>
              ))}
            </div>
          </div>

          {/* Accessibility Settings */}
          <div className="mb-6 space-y-4">
            <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider">
              Radical Accessibility
            </h3>

            {/* Dyslexia Toggle */}
            <div className="flex items-center justify-between rounded-lg border border-border-color bg-bg-primary/20 p-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Dyslexia-friendly Font</span>
                <span className="text-xs text-text-secondary">Switches font type and increases spacing</span>
              </div>
              <button
                onClick={toggleDyslexiaFont}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  dyslexiaFont ? "bg-accent" : "bg-border-color"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-bg-primary transition-transform ${
                    dyslexiaFont ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>

            {/* Motion Selector */}
            <div className="flex items-center justify-between rounded-lg border border-border-color bg-bg-primary/20 p-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Motion Profile</span>
                <span className="text-xs text-text-secondary">Toggle hardware animation scaling</span>
              </div>
              <div className="flex items-center gap-1 bg-bg-primary border border-border-color p-0.5 rounded-md">
                {(["normal", "reduced"] as MotionMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMotion(m)}
                    className={`rounded px-2.5 py-1 text-xs font-mono uppercase transition-colors ${
                      motion === m ? "bg-accent text-bg-primary font-semibold" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Contrast Selector */}
            <div className="flex items-center justify-between rounded-lg border border-border-color bg-bg-primary/20 p-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Contrast Boost</span>
                <span className="text-xs text-text-secondary">Increase element boundary outlines</span>
              </div>
              <div className="flex items-center gap-1 bg-bg-primary border border-border-color p-0.5 rounded-md">
                {(["normal", "high"] as ContrastMode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setContrast(c)}
                    className={`rounded px-2.5 py-1 text-xs font-mono uppercase transition-colors ${
                      contrast === c ? "bg-accent text-bg-primary font-semibold" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Cognitive Mode Selector */}
            <div className="flex items-center justify-between rounded-lg border border-border-color bg-bg-primary/20 p-3">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-text-primary">Cognitive Load</span>
                <span className="text-xs text-text-secondary">Focus mode strips decorative animations</span>
              </div>
              <div className="flex items-center gap-1 bg-bg-primary border border-border-color p-0.5 rounded-md">
                {(["normal", "focus"] as CognitiveMode[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCognitiveMode(c)}
                    className={`rounded px-2.5 py-1 text-xs font-mono uppercase transition-colors ${
                      cognitiveMode === c ? "bg-accent text-bg-primary font-semibold" : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Context Role Section (Mobile fallback) */}
          <div className="md:hidden mb-6">
            <h3 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">
              Persona / Role Filter
            </h3>
            <div className="grid grid-cols-3 gap-1 rounded-lg border border-border-color bg-bg-primary/50 p-1">
              {(["general", "designer", "developer"] as UserRole[]).map((r) => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`rounded-md py-2 text-xs font-mono tracking-wider transition-all uppercase ${
                    role === r
                      ? "bg-accent text-bg-primary font-bold shadow-[0_0_8px_var(--accent-glow)]"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Cheat Sheet */}
        <div className="border-t border-border-color pt-6 mt-6">
          <h4 className="font-mono text-xs text-text-secondary uppercase tracking-wider mb-3">
            Keyboard Quantum Links
          </h4>
          <div className="space-y-1 text-xs font-mono">
            <div className="flex justify-between py-1 text-text-secondary">
              <span>Switch to Designer Mode</span>
              <kbd className="rounded border border-border-color bg-bg-primary px-1.5 py-0.5 text-[10px] text-text-primary shadow-sm">D</kbd>
            </div>
            <div className="flex justify-between py-1 text-text-secondary">
              <span>Switch to Developer Mode</span>
              <kbd className="rounded border border-border-color bg-bg-primary px-1.5 py-0.5 text-[10px] text-text-primary shadow-sm">E</kbd>
            </div>
            <div className="flex justify-between py-1 text-text-secondary">
              <span>Reset to General Mode</span>
              <kbd className="rounded border border-border-color bg-bg-primary px-1.5 py-0.5 text-[10px] text-text-primary shadow-sm">G</kbd>
            </div>
            <div className="flex justify-between py-1 text-text-secondary">
              <span>Toggle Contrast Boost</span>
              <kbd className="rounded border border-border-color bg-bg-primary px-1.5 py-0.5 text-[10px] text-text-primary shadow-sm">A</kbd>
            </div>
            <div className="flex justify-between py-1 text-text-secondary">
              <span>Toggle Cognitive Focus</span>
              <kbd className="rounded border border-border-color bg-bg-primary px-1.5 py-0.5 text-[10px] text-text-primary shadow-sm">C</kbd>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
