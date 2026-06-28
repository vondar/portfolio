"use client";

import { create } from "zustand";

export type Theme = "cyberpunk" | "minimal" | "dark" | "light";
export type MotionMode = "normal" | "reduced";
export type ContrastMode = "normal" | "high";
export type CognitiveMode = "normal" | "focus";
export type UserRole = "general" | "designer" | "developer";

interface AppState {
  // Theme & Appearance
  theme: Theme;
  setTheme: (theme: Theme) => void;

  // Accessibility Settings
  motion: MotionMode;
  setMotion: (motion: MotionMode) => void;
  toggleMotion: () => void;
  contrast: ContrastMode;
  setContrast: (contrast: ContrastMode) => void;
  toggleContrast: () => void;
  cognitiveMode: CognitiveMode;
  setCognitiveMode: (mode: CognitiveMode) => void;
  toggleCognitiveMode: () => void;
  dyslexiaFont: boolean;
  toggleDyslexiaFont: () => void;

  // Personalization / Context
  role: UserRole;
  setRole: (role: UserRole) => void;

  // Sound/Haptics
  audioEnabled: boolean;
  toggleAudio: () => void;
}

export const useStore = create<AppState>((set) => ({
  // Default values
  theme: "cyberpunk",
  motion: "normal",
  contrast: "normal",
  cognitiveMode: "normal",
  dyslexiaFont: false,
  role: "general",
  audioEnabled: false,

  // Actions
  setTheme: (theme) => set({ theme }),
  setMotion: (motion) => set({ motion }),
  toggleMotion: () =>
    set((state) => ({ motion: state.motion === "normal" ? "reduced" : "normal" })),
  setContrast: (contrast) => set({ contrast }),
  toggleContrast: () =>
    set((state) => ({ contrast: state.contrast === "normal" ? "high" : "normal" })),
  setCognitiveMode: (cognitiveMode) => set({ cognitiveMode }),
  toggleCognitiveMode: () =>
    set((state) => ({ cognitiveMode: state.cognitiveMode === "normal" ? "focus" : "normal" })),
  toggleDyslexiaFont: () => set((state) => ({ dyslexiaFont: !state.dyslexiaFont })),
  setRole: (role) => set({ role }),
  toggleAudio: () => set((state) => ({ audioEnabled: !state.audioEnabled })),
}));
