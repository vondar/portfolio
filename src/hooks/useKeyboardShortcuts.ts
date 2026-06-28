"use client";

import { useEffect } from "react";
import { useStore } from "@/store/useStore";
import { sound } from "@/utils/sonification";

const runTransition = (update: () => void) => {
  if (typeof document !== "undefined" && "startViewTransition" in document) {
    document.startViewTransition(update);
    return;
  }

  update();
};

export function useKeyboardShortcuts() {
  const setRole = useStore((state) => state.setRole);
  const toggleContrast = useStore((state) => state.toggleContrast);
  const toggleCognitiveMode = useStore((state) => state.toggleCognitiveMode);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if the user is typing in an input, textarea, or select element
      const activeElement = document.activeElement as HTMLElement | null;
      if (
        activeElement &&
        (activeElement.tagName === "INPUT" ||
          activeElement.tagName === "TEXTAREA" ||
          activeElement.isContentEditable)
      ) {
        return;
      }

      const key = event.key.toLowerCase();

      switch (key) {
        case "d":
          sound.triggerFeedback("morph");
          runTransition(() => setRole("designer"));
          break;
        case "e":
          sound.triggerFeedback("morph");
          runTransition(() => setRole("developer"));
          break;
        case "g":
          sound.triggerFeedback("morph");
          runTransition(() => setRole("general"));
          break;
        case "a":
          sound.triggerFeedback("click");
          toggleContrast();
          break;
        case "c":
          sound.triggerFeedback("click");
          toggleCognitiveMode();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setRole, toggleContrast, toggleCognitiveMode]);
}
