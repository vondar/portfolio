"use client";

import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, motion, contrast, cognitiveMode, dyslexiaFont } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    const isReducedMotion = motion === "reduced";
    const isHighContrast = contrast === "high";
    const isCognitiveFocus = cognitiveMode === "focus";

    // Clear existing theme/a11y classes
    const classesToRemove = Array.from(root.classList).filter(
      (c) =>
        c.startsWith("theme-") ||
        c.startsWith("motion-") ||
        c.startsWith("contrast-") ||
        c.startsWith("cognitive-") ||
        c === "font-dyslexic"
    );
    classesToRemove.forEach((c) => root.classList.remove(c));

    // Add current classes
    root.classList.add(`theme-${theme}`);
    root.classList.add(`motion-${motion}`);
    root.classList.add(`contrast-${contrast}`);
    root.classList.add(`cognitive-${cognitiveMode}`);
    if (dyslexiaFont) {
      root.classList.add("font-dyslexic");
    }

    // Data attributes let CSS variables cascade without component-level style churn.
    root.setAttribute("data-theme", theme);
    root.setAttribute("data-dyslexia", String(dyslexiaFont));
    root.setAttribute("data-motion", String(!isReducedMotion));
    root.setAttribute("data-contrast", String(isHighContrast));
    root.setAttribute("data-cognitive", String(isCognitiveFocus));
  }, [theme, motion, contrast, cognitiveMode, dyslexiaFont, mounted]);

  return <>{children}</>;
}
