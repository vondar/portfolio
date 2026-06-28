"use client";

import React from "react";
import { useStore, UserRole } from "@/store/useStore";
import { Sliders, Volume2, VolumeX } from "lucide-react";
import { sound } from "@/utils/sonification";

interface NavbarProps {
  onToggleA11y: () => void;
}

export default function Navbar({ onToggleA11y }: NavbarProps) {
  const { role, setRole, audioEnabled, toggleAudio } = useStore();

  const handleRoleChange = (newRole: UserRole) => {
    sound.triggerFeedback("click");

    if ("startViewTransition" in document) {
      document.startViewTransition(() => setRole(newRole));
      sound.triggerFeedback("morph");
      return;
    }

    setRole(newRole);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border-color bg-bg-secondary/75 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 sm:px-8">
        {/* Brand / Logo */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-sm tracking-[0.2em] text-text-secondary select-none">
            SYSTEM_SYS //
          </span>
          <span className="font-mono text-base font-bold tracking-wider text-accent drop-shadow-[0_0_8px_var(--accent-glow)]">
            AESTHETIC_CORE
          </span>
        </div>

        {/* Middle Navigation - Role Switcher */}
        <div className="hidden md:flex items-center gap-1 rounded-full border border-border-color bg-bg-primary/50 p-1">
          {(["general", "designer", "developer"] as UserRole[]).map((r) => (
            <button
              key={r}
              onMouseEnter={() => sound.triggerFeedback("hover")}
              onClick={() => handleRoleChange(r)}
              className={`rounded-full px-4 py-1 text-xs font-mono tracking-wider transition-all duration-200 uppercase ${
                role === r
                  ? "bg-accent text-bg-primary font-bold shadow-[0_0_12px_var(--accent-glow)]"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Right Action Icons */}
        <div className="flex items-center gap-4">
          {/* Mobile Role indicator */}
          <span className="md:hidden font-mono text-[10px] uppercase border border-accent/30 rounded px-2 py-0.5 text-accent">
            {role}
          </span>

          {/* Sound Toggle */}
          <button
            onClick={() => {
              toggleAudio();
              sound.triggerFeedback("click");
            }}
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-border-color bg-bg-primary/30 hover:border-accent/50 hover:bg-bg-primary/80 transition-all"
            aria-label="Toggle Audio Feedback"
          >
            {audioEnabled ? (
              <Volume2 className="h-4 w-4 text-accent group-hover:scale-110 transition-transform" />
            ) : (
              <VolumeX className="h-4 w-4 text-text-secondary group-hover:scale-110 transition-transform" />
            )}
          </button>

          {/* Accessibility Slideout Trigger */}
          <button
            onMouseEnter={() => sound.triggerFeedback("hover")}
            onClick={() => {
              sound.triggerFeedback("click");
              onToggleA11y();
            }}
            className="group flex h-9 w-9 items-center justify-center rounded-lg border border-border-color bg-bg-primary/30 hover:border-accent/50 hover:bg-bg-primary/80 transition-all shadow-[0_0_5px_rgba(0,0,0,0.1)]"
            aria-label="Open Accessibility Panel"
          >
            <Sliders className="h-4 w-4 text-text-primary group-hover:rotate-45 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  );
}
