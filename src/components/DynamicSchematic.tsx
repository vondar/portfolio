"use client";

import React, { useEffect, useRef, useState } from "react";
import { useStore } from "@/store/useStore";
import { sound } from "@/utils/sonification";

type SchematicType = "tenant" | "probability" | "chrono" | "decay";
type DecayMode = "RAW" | "Z_SCORE";
type Quadrant = "Supernova" | "Cultural Anchor" | "The Ghost" | "Slow Burn" | "Unclassified";

interface DynamicSchematicProps {
  type: SchematicType;
  title: string;
}

interface Palette {
  accent: string;
  pink: string;
  text: string;
  grid: string;
  muted: string;
}

interface DecayDataPoint {
  name: string;
  longevity: number;
  velocity: number;
  ip: number;
  vp: number;
  quadrant: Quadrant;
  type: "Show" | "Movie";
}

const seededWave = (index: number, offset = 0) => {
  const value = Math.sin(index * 12.9898 + offset * 78.233) * 43758.5453;
  return value - Math.floor(value);
};

const makeCluster = (
  prefix: string,
  count: number,
  quadrant: Quadrant,
  type: "Show" | "Movie",
  ranges: {
    ip: [number, number];
    longevity: [number, number];
    velocity: [number, number];
    vp: [number, number];
  }
) =>
  Array.from({ length: count }, (_, index): DecayDataPoint => ({
    name: `${prefix}_${String(index + 1).padStart(2, "0")}`,
    longevity: ranges.longevity[0] + seededWave(index, 1) * (ranges.longevity[1] - ranges.longevity[0]),
    velocity: ranges.velocity[0] + seededWave(index, 2) * (ranges.velocity[1] - ranges.velocity[0]),
    ip: ranges.ip[0] + seededWave(index, 3) * (ranges.ip[1] - ranges.ip[0]),
    vp: ranges.vp[0] + seededWave(index, 4) * (ranges.vp[1] - ranges.vp[0]),
    quadrant,
    type: index % 3 === 0 ? "Movie" : type,
  }));

const ATTENTION_DATASET: DecayDataPoint[] = [
  {
    name: "KPop Demon Hunters",
    longevity: 245,
    velocity: 10.2,
    ip: 16.1,
    vp: -1.9,
    quadrant: "Cultural Anchor",
    type: "Movie",
  },
  {
    name: "The Investigation of Lucy Letby",
    longevity: 14,
    velocity: 10.4,
    ip: 0.2,
    vp: 0.65,
    quadrant: "Supernova",
    type: "Show",
  },
  {
    name: "Café con aroma de mujer: Season 1",
    longevity: 145,
    velocity: 4.8,
    ip: 8.1,
    vp: -1.1,
    quadrant: "Slow Burn",
    type: "Show",
  },
  {
    name: "Despicable Me",
    longevity: 64,
    velocity: 5.9,
    ip: 3.1,
    vp: -0.9,
    quadrant: "Slow Burn",
    type: "Movie",
  },
  {
    name: "Joe Rogan: Burn the Boats",
    longevity: 16,
    velocity: 5.8,
    ip: 0.1,
    vp: -1.3,
    quadrant: "The Ghost",
    type: "Show",
  },
  ...makeCluster("Ghost", 42, "The Ghost", "Show", {
    longevity: [6, 18],
    velocity: [1.2, 5.2],
    ip: [-0.62, 0.12],
    vp: [-2.28, -0.82],
  }),
  ...makeCluster("Supernova", 34, "Supernova", "Show", {
    longevity: [6, 19],
    velocity: [5.8, 10.3],
    ip: [-0.58, 0.9],
    vp: [0.46, 0.74],
  }),
  ...makeCluster("Anchor", 58, "Cultural Anchor", "Show", {
    longevity: [21, 205],
    velocity: [5.8, 10.1],
    ip: [0.24, 6.2],
    vp: [0.5, 0.75],
  }),
  ...makeCluster("SlowBurn", 46, "Slow Burn", "Show", {
    longevity: [22, 92],
    velocity: [1.6, 5.3],
    ip: [0.28, 3.4],
    vp: [-2.16, -0.74],
  }),
  ...makeCluster("Middle", 54, "Unclassified", "Show", {
    longevity: [8, 72],
    velocity: [4.2, 7.4],
    ip: [-0.45, 1.5],
    vp: [-0.65, 0.58],
  }),
];

const getPalette = (theme: string): Palette => {
  if (theme === "minimal") {
    return {
      accent: "#111111",
      pink: "#ff3366",
      text: "rgba(28, 25, 23, 0.78)",
      grid: "rgba(0, 0, 0, 0.025)",
      muted: "rgba(0, 0, 0, 0.18)",
    };
  }

  if (theme === "light") {
    return {
      accent: "#2563eb",
      pink: "#db2777",
      text: "rgba(17, 24, 39, 0.72)",
      grid: "rgba(37, 99, 235, 0.03)",
      muted: "rgba(37, 99, 235, 0.18)",
    };
  }

  return {
    accent: theme === "dark" ? "#3b82f6" : "#00f3ff",
    pink: theme === "dark" ? "#ec4899" : "#ff007f",
    text: "rgba(255, 255, 255, 0.74)",
    grid: theme === "dark" ? "rgba(59, 130, 246, 0.025)" : "rgba(0, 243, 255, 0.02)",
    muted: "rgba(255, 255, 255, 0.16)",
  };
};

const getRawColor = (quadrant: Quadrant, theme: string) => {
  if (quadrant === "Supernova") return "rgba(96, 165, 250, 0.88)";
  if (quadrant === "Cultural Anchor") return theme === "minimal" ? "rgba(17, 24, 39, 0.78)" : "rgba(251, 146, 60, 0.88)";
  if (quadrant === "The Ghost") return "rgba(74, 222, 128, 0.82)";
  if (quadrant === "Slow Burn") return "rgba(248, 113, 113, 0.86)";
  return "rgba(156, 163, 175, 0.35)";
};

const getZColor = (quadrant: Quadrant) => {
  if (quadrant === "Cultural Anchor") return "rgba(99, 102, 241, 0.9)";
  if (quadrant === "Slow Burn") return "rgba(74, 222, 128, 0.9)";
  return "rgba(156, 163, 175, 0.34)";
};

export default function DynamicSchematic({ type, title }: DynamicSchematicProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const hoveredRef = useRef<string | null>(null);
  const [decayMode, setDecayMode] = useState<DecayMode>("RAW");
  const [hoveredNode, setHoveredNode] = useState<DecayDataPoint | null>(null);
  const theme = useStore((state) => state.theme);
  const motion = useStore((state) => state.motion);

  const updateHoveredNode = (point: DecayDataPoint | null) => {
    const nextName = point?.name ?? null;
    if (hoveredRef.current === nextName) return;
    hoveredRef.current = nextName;
    setHoveredNode(point);
  };

  const toggleAxisMode = () => {
    if (type !== "decay") return;
    sound.triggerFeedback("click");
    setDecayMode((current) => (current === "RAW" ? "Z_SCORE" : "RAW"));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    let rafId = 0;
    let frame = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const palette = getPalette(theme);
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const shouldAnimate = motion !== "reduced" && !prefersReducedMotion;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
      updateHoveredNode(null);
    };

    const drawGrid = () => {
      ctx.strokeStyle = palette.grid;
      ctx.lineWidth = 1;

      for (let x = 0; x < width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }

      for (let y = 0; y < height; y += 25) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
    };

    const label = (text: string, x: number, y: number, color = palette.text, font = "10px ui-monospace, SFMono-Regular, Consolas, monospace") => {
      ctx.fillStyle = color;
      ctx.font = font;
      ctx.fillText(text, x, y);
    };

    const drawCross = (x: number, y: number, color: string, size = 4) => {
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x - size, y - size);
      ctx.lineTo(x + size, y + size);
      ctx.moveTo(x + size, y - size);
      ctx.lineTo(x - size, y + size);
      ctx.stroke();
    };

    const drawPoint = (point: DecayDataPoint, x: number, y: number, color: string, hovered: boolean) => {
      if (point.type === "Movie") {
        drawCross(x, y, color, hovered ? 6 : 4);
        return;
      }

      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, hovered ? 6 : 4.4, 0, Math.PI * 2);
      ctx.fill();
    };

    const drawTenant = () => {
      const wallY = height / 2;
      const activeX = shouldAnimate ? ((frame * 1.45) % Math.max(1, width - 70)) + 35 : width * 0.62;
      const rejectedProgress = shouldAnimate ? (frame * 1.2) % Math.max(1, width * 0.52) : width * 0.48;
      const rejectedY = height - 50 - Math.max(0, rejectedProgress - width * 0.42) * 0.72;

      label("[TENANT_A] ACTIVE DOMAIN", 18, 28);
      label("[TENANT_B] BLOCKED DOMAIN", 18, height - 18);

      ctx.strokeStyle = palette.pink;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 7]);
      ctx.beginPath();
      ctx.moveTo(14, wallY);
      ctx.lineTo(width - 14, wallY);
      ctx.stroke();
      ctx.setLineDash([]);

      label("JWT_SCOPE_BARRIER // MIDDLEWARE_ENFORCED", Math.max(20, width - 282), wallY - 8, palette.pink);
      ctx.fillStyle = palette.accent;
      ctx.beginPath();
      ctx.arc(activeX, 52, 6, 0, Math.PI * 2);
      ctx.fill();
      label("REQ // gym_id=0xAA", Math.max(14, activeX - 46), 72, palette.accent);

      ctx.fillStyle = "rgba(239, 68, 68, 0.86)";
      ctx.beginPath();
      ctx.arc(rejectedProgress, Math.max(wallY + 14, rejectedY), 6, 0, Math.PI * 2);
      ctx.fill();
      label("DENIED // CROSS_TENANT", Math.max(14, rejectedProgress - 48), Math.max(wallY + 34, rejectedY + 20), "rgba(239, 68, 68, 0.9)");
    };

    const drawProbability = () => {
      const left = 42;
      const right = width - 24;
      const top = 24;
      const bottom = height - 36;

      ctx.strokeStyle = palette.text;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left, bottom);
      ctx.lineTo(right, bottom);
      ctx.stroke();

      label("CUMULATIVE PROBABILITY", 14, 16);
      label("TRIALS", right - 44, height - 16);
      ctx.strokeStyle = palette.accent;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(left, bottom);

      for (let x = left; x <= right; x += 2) {
        const t = (x - left) / (right - left);
        const cdf = t < 0.65 ? Math.pow(t, 2.4) * 0.3 : 0.3 + (1 - Math.exp(-(t - 0.65) * 7.4)) * 0.7;
        ctx.lineTo(x, bottom - cdf * (bottom - 42));
      }

      ctx.stroke();
      const cteX = left + (right - left) * 0.95;
      ctx.fillStyle = palette.pink;
      ctx.fillRect(cteX - 1, 40, 2, bottom - 40);
      label("CTE95 // EXTREME TAIL", Math.max(left + 8, cteX - 138), 54, palette.pink);
    };

    const drawChrono = () => {
      const midY = height / 2;
      const start = 44;
      const end = width - 44;
      const nodes = 5;
      const spacing = (end - start) / (nodes - 1);

      ctx.strokeStyle = palette.muted;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(start, midY);
      ctx.lineTo(end, midY);
      ctx.stroke();

      for (let i = 0; i < nodes; i += 1) {
        const x = start + i * spacing;
        const drift = Math.sin((shouldAnimate ? frame : 40) * 0.035 + i) * 16;
        const probeY = midY + drift;
        ctx.fillStyle = palette.muted;
        ctx.beginPath();
        ctx.arc(x, midY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x, midY);
        ctx.lineTo(x, probeY);
        ctx.stroke();
        ctx.fillStyle = palette.accent;
        ctx.beginPath();
        ctx.arc(x, probeY, 4, 0, Math.PI * 2);
        ctx.fill();
        label(`CONF ${(96 - i * 4.3).toFixed(1)}%`, x - 30, probeY - 10, palette.text);
        label(`SHA_${(i * 1234 + 77).toString(16).toUpperCase()}`, x - 28, midY + 28, palette.text);
      }
    };

    const drawAxis = (left: number, top: number, right: number, bottom: number) => {
      ctx.strokeStyle = theme === "minimal" ? "rgba(0, 0, 0, 0.16)" : "rgba(255, 255, 255, 0.16)";
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(left, top);
      ctx.lineTo(left, bottom);
      ctx.lineTo(right, bottom);
      ctx.stroke();
    };

    const drawDecayRaw = () => {
      const left = 58;
      const top = 66;
      const right = width - 22;
      const bottom = height - 42;
      const plotWidth = right - left;
      const plotHeight = bottom - top;
      const mapX = (longevity: number) => left + (Math.min(255, Math.max(0, longevity)) / 255) * plotWidth;
      const mapY = (velocity: number) => bottom - ((Math.min(10.5, Math.max(1, velocity)) - 1) / 9.5) * plotHeight;
      const splitX = mapX(20);
      const splitY = mapY(5.5);
      const mouse = mouseRef.current;

      drawAxis(left, top, right, bottom);
      label("PEAK VELOCITY (11 - PEAK RANK)", left, top - 12);
      label("TOTAL LONGEVITY (DAYS)", Math.max(left, right - 148), height - 16);
      label("Rank 1", 10, mapY(10) + 8);
      label("Rank 5.5", 4, splitY + 3);
      label("Rank 10", 6, bottom);
      label("0", left, bottom + 14);
      label("100", mapX(100) - 6, bottom + 14);
      label("200", mapX(200) - 6, bottom + 14);

      ctx.strokeStyle = "rgba(239, 68, 68, 0.36)";
      ctx.lineWidth = 1;
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(splitX, top);
      ctx.lineTo(splitX, bottom);
      ctx.moveTo(left, splitY);
      ctx.lineTo(right, splitY);
      ctx.stroke();
      ctx.setLineDash([]);
      label("T_LONGEVITY = 20d", splitX + 6, top + 13, "rgba(239, 68, 68, 0.78)");
      label("V_PEAK = Rank 5.5", Math.max(left + 8, right - 142), splitY - 6, "rgba(239, 68, 68, 0.78)");

      let activeHover: DecayDataPoint | null = null;
      for (const point of ATTENTION_DATASET) {
        const cx = mapX(point.longevity);
        const cy = mapY(point.velocity);
        const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
        const hovered = dist < 9;
        if (hovered) activeHover = point;
        drawPoint(point, cx, cy, getRawColor(point.quadrant, theme), hovered);

      }

      if (activeHover) {
        const cx = mapX(activeHover.longevity);
        const cy = mapY(activeHover.velocity);
        ctx.strokeStyle = palette.accent;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 10 + Math.sin(frame * 0.18) * 2, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(left, cy);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, bottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      updateHoveredNode(activeHover);
    };

    const drawDecayZScore = () => {
      const left = 58;
      const top = 66;
      const right = width - 22;
      const bottom = height - 42;
      const plotWidth = right - left;
      const plotHeight = bottom - top;
      const mapX = (ip: number) => left + ((Math.min(17, Math.max(-1, ip)) + 1) / 18) * plotWidth;
      const mapY = (vp: number) => bottom - ((Math.min(0.9, Math.max(-2.5, vp)) + 2.5) / 3.4) * plotHeight;
      const mouse = mouseRef.current;

      drawAxis(left, top, right, bottom);
      label("Z-SCORED PEAK VELOCITY (V_p)", left, top - 12);
      label("Z-SCORED PERSISTENCE INDEX (I_p)", Math.max(left, right - 184), height - 16);

      for (const value of [0.5, 0, -1, -2]) label(value.toFixed(1), 12, mapY(value) + 3);
      for (const value of [0, 5, 10, 15]) label(value.toFixed(value === 0 ? 0 : 1), mapX(value) - 6, bottom + 14);

      ctx.strokeStyle = theme === "minimal" ? "rgba(0, 0, 0, 0.12)" : "rgba(255, 255, 255, 0.12)";
      ctx.lineWidth = 1;
      ctx.setLineDash([7, 7]);
      ctx.beginPath();
      ctx.moveTo(mapX(0.2), top);
      ctx.lineTo(mapX(0.2), bottom);
      ctx.moveTo(left, mapY(0.58));
      ctx.lineTo(right, mapY(0.58));
      ctx.stroke();
      ctx.setLineDash([2, 5]);
      ctx.beginPath();
      ctx.moveTo(mapX(-0.5), top);
      ctx.lineTo(mapX(-0.5), bottom);
      ctx.moveTo(left, mapY(-0.7));
      ctx.lineTo(right, mapY(-0.7));
      ctx.stroke();
      ctx.setLineDash([]);
      const thresholdLabelColor = theme === "minimal" ? "rgba(0, 0, 0, 0.32)" : "rgba(255, 255, 255, 0.26)";
      label("P75_PERSISTENCE", mapX(0.2) + 5, top + 14, thresholdLabelColor);
      label("P75_VELOCITY", Math.max(left + 8, right - 96), mapY(0.58) - 5, thresholdLabelColor);

      let activeHover: DecayDataPoint | null = null;
      for (const point of ATTENTION_DATASET) {
        const cx = mapX(point.ip);
        const cy = mapY(point.vp);
        const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
        const hovered = dist < 9;
        if (hovered) activeHover = point;
        drawPoint(point, cx, cy, getZColor(point.quadrant), hovered);

      }

      if (activeHover) {
        const cx = mapX(activeHover.ip);
        const cy = mapY(activeHover.vp);
        ctx.strokeStyle = palette.pink;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, cy, 11 + Math.sin(frame * 0.18) * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.18)";
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(left, cy);
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx, bottom);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      updateHoveredNode(activeHover);
    };

    const render = () => {
      frame += 1;
      ctx.clearRect(0, 0, width, height);
      drawGrid();

      if (type === "tenant") drawTenant();
      if (type === "probability") drawProbability();
      if (type === "chrono") drawChrono();
      if (type === "decay") {
        if (decayMode === "RAW") drawDecayRaw();
        if (decayMode === "Z_SCORE") drawDecayZScore();
      } else {
        updateHoveredNode(null);
      }

      if (shouldAnimate || type === "decay") {
        rafId = requestAnimationFrame(render);
      }
    };

    resize();
    render();
    window.addEventListener("resize", resize);
    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [type, title, theme, motion, decayMode]);

  const modeLabel = decayMode === "RAW" ? "GRID_CELLS" : "Z_SCORE_AXIS";
  const modelLabel = decayMode === "RAW" ? "ATTENTION_DECAY_QUADRANT" : "Z_SCORED_PERSISTENCE_MATRIX";

  return (
    <div
      className={`relative min-h-[300px] overflow-hidden rounded-lg border border-border-color/40 bg-bg-primary/30 ${
        type === "decay" ? "cursor-crosshair" : ""
      }`}
      role="img"
      aria-label={
        type === "decay"
          ? `Decay schematic in ${modeLabel} mode. Use the toggle axis view button to switch axes.`
          : `${title} schematic reconstruction`
      }
    >
      <div className="absolute inset-x-0 top-0 z-20 flex min-h-11 items-center justify-between gap-3 border-b border-border-color/30 bg-bg-primary/95 px-4 py-2.5 font-mono text-[9px] tracking-wide shadow-[0_10px_24px_rgba(0,0,0,0.18)]">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 text-accent">// MODEL_CORE_ANALYSIS</span>
          <span className="truncate text-text-secondary">{type.toUpperCase()} // {title.toUpperCase()}</span>
        </div>
        {type === "decay" && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              toggleAxisMode();
            }}
            className="shrink-0 rounded border border-accent-pink/30 bg-accent-pink/15 px-2 py-1 text-[8px] uppercase text-accent-pink transition-[background-color,border-color] hover:border-accent-pink/80 hover:bg-accent-pink/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-pink/60"
          >
            {modeLabel} // Toggle Axis
          </button>
        )}
      </div>

      <div className="sr-only" aria-live="polite">
        {type === "decay" ? `Decay visualizer mode: ${modelLabel}` : `${title} schematic`}
      </div>

      {type === "decay" && hoveredNode && (
        <div className="pointer-events-none absolute bottom-3 right-3 z-20 w-[230px] rounded-lg border border-accent/40 bg-bg-primary/95 p-3 font-mono text-[9px] shadow-[0_0_18px_var(--accent-glow)]">
          <div className="mb-1 truncate border-b border-border-color/30 pb-1 font-bold uppercase tracking-wide text-text-primary">{hoveredNode.name}</div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[8px]">
            <span className="text-text-secondary">LONGEVITY</span>
            <span className="text-right text-accent">{hoveredNode.longevity.toFixed(0)} DAYS</span>
            <span className="text-text-secondary">VELOCITY</span>
            <span className="text-right text-accent">RANK {hoveredNode.velocity.toFixed(1)}</span>
            <span className="text-text-secondary">Z-IP</span>
            <span className="text-right text-accent-pink">{hoveredNode.ip.toFixed(2)}</span>
            <span className="text-text-secondary">Z-VP</span>
            <span className="text-right text-accent-pink">{hoveredNode.vp.toFixed(2)}</span>
            <span className="text-text-secondary">QUADRANT</span>
            <span className="text-right uppercase text-text-primary">{hoveredNode.quadrant}</span>
          </div>
        </div>
      )}

      <canvas ref={canvasRef} className="block h-full min-h-[300px] w-full" aria-hidden="true" />
    </div>
  );
}
