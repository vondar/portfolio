"use client";

import React, { useMemo, useState } from "react";
import { Theme, useStore } from "@/store/useStore";
import { ProjectDetails, projectsData } from "@/data/projects";
import DynamicSchematic from "@/components/DynamicSchematic";
import ProjectModal from "@/components/ProjectModal";
import TelemetryBoard from "@/components/TelemetryBoard";
import { sound } from "@/utils/sonification";
import { withBasePath } from "@/utils/paths";
import { Database, ExternalLink, LineChart, MonitorPlay, Radio, Shield, Timer, Zap } from "lucide-react";

const cartridgeIcons = {
  tenant: Shield,
  probability: LineChart,
  chrono: Timer,
  decay: Database,
};

const visualizerLabels = {
  tenant: "Tenant Sandbox",
  probability: "Probability Pit",
  chrono: "Chrono-Sync Timeline",
  decay: "Decay Half-Life Vector",
};

const decayGraphNotes = [
  {
    title: "GRID_CELLS",
    body:
      "Plots raw attention behavior: X is total days in the Top 10, while Y is peak velocity, derived from rank. The red vertical threshold marks 20 days of longevity; the red horizontal threshold marks the Rank 5.5 velocity split.",
  },
  {
    title: "Z_SCORE_AXIS",
    body:
      "Normalizes the same attention profile into statistical space. X becomes persistence index (I_p), and Y becomes peak velocity (V_p), making anomalies easier to compare across global chart behavior.",
  },
  {
    title: "Archetypes",
    body:
      "Supernova points peak fast and disappear quickly. Cultural Anchors sustain attention for unusually long periods. Ghosts underperform on both axes. Slow Burns persist despite lower initial velocity.",
  },
  {
    title: "Symbols",
    body:
      "Circles represent shows, crosses represent movies. Hovering a point moves the label into the telemetry panel so dense clusters stay readable.",
  },
];

export default function Home() {
  const { role, motion, theme, setTheme } = useStore();
  const [mountedCartridge, setMountedCartridge] = useState<ProjectDetails>(projectsData[0]);
  const [selectedProject, setSelectedProject] = useState<ProjectDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mountedMetrics = useMemo(
    () => [
      mountedCartridge.metrics[role] || mountedCartridge.metrics.general,
      ...mountedCartridge.techStack.slice(0, 2),
    ],
    [mountedCartridge, role]
  );

  const mountProjectCartridge = (project: ProjectDetails) => {
    sound.triggerFeedback("click");
    if ("startViewTransition" in document) {
      document.startViewTransition(() => setMountedCartridge(project));
      sound.triggerFeedback("morph");
      return;
    }
    setMountedCartridge(project);
  };

  const handleThemeChange = (nextTheme: Theme) => {
    sound.triggerFeedback("click");

    const update = () => setTheme(nextTheme);
    if ("startViewTransition" in document) {
      document.startViewTransition(update);
      sound.triggerFeedback("morph");
      return;
    }

    update();
  };

  const openProjectLog = () => {
    sound.triggerFeedback("click");
    setSelectedProject(mountedCartridge);
    setIsModalOpen(true);
  };

  const closeProjectLog = () => {
    setSelectedProject(null);
    setIsModalOpen(false);
  };

  const MountedIcon = cartridgeIcons[mountedCartridge.visualizerType];

  return (
    <div className="relative mx-auto flex w-full max-w-7xl flex-1 flex-col px-6 py-10 sm:px-8 sm:py-14">
      <div className="cognitive-decor pointer-events-none absolute inset-y-0 left-0 right-0 -z-10 grid grid-cols-4 gap-4 px-6 opacity-20 sm:px-8">
        <div className="h-full border-r border-dashed border-accent/15" />
        <div className="h-full border-r border-dashed border-accent/15" />
        <div className="h-full border-r border-dashed border-accent/15" />
        <div className="h-full" />
      </div>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <aside className="lg:col-span-4">
          <div className="mb-4 flex items-center gap-2">
            <Radio className={`h-4 w-4 text-accent ${motion === "normal" ? "animate-pulse" : ""}`} />
            <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-accent-pink">
              Detected Cartridges
            </span>
          </div>

          <div className="space-y-3" role="tablist" aria-label="Project system cartridges">
            {projectsData.map((project) => {
              const isMounted = mountedCartridge.id === project.id;
              const Icon = cartridgeIcons[project.visualizerType];

              return (
                <button
                  key={project.id}
                  id={`cartridge-${project.id}`}
                  role="tab"
                  aria-selected={isMounted}
                  onMouseEnter={() => sound.triggerFeedback("hover")}
                  onClick={() => mountProjectCartridge(project)}
                  className={`spatial-card w-full rounded-lg p-4 text-left transition-[border-color,box-shadow,background-color] ${
                    isMounted ? "border-accent shadow-[0_0_18px_var(--accent-glow)]" : ""
                  }`}
                >
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <div>
                      <span className="font-mono text-[9px] uppercase tracking-wider text-accent">
                        {project.subtitle}
                      </span>
                      <h2 className="mt-1 text-sm font-bold text-text-primary">{project.title}</h2>
                    </div>
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent-pink" />
                  </div>
                  <div className="flex items-center justify-between border-t border-border-color/30 pt-3 font-mono text-[10px] uppercase text-text-secondary">
                    <span>{project.category}</span>
                    <span>{visualizerLabels[project.visualizerType]}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-5">
            <TelemetryBoard />
          </div>
        </aside>

        <main className="lg:col-span-8">
          <article className="spatial-card min-h-[640px] rounded-lg p-5 sm:p-7">
            <div className="mb-5 flex flex-col justify-between gap-4 border-b border-border-color/30 pb-5 sm:flex-row sm:items-start">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
                  // Mounted Cartridge Analysis
                </span>
                <h1 className="mt-2 text-3xl font-black uppercase leading-tight tracking-tight text-text-primary sm:text-4xl">
                  {mountedCartridge.title}
                </h1>
                <p className="mt-2 max-w-2xl font-mono text-[11px] uppercase tracking-wider text-text-secondary">
                  {mountedCartridge.subtitle} // {mountedCartridge.category}
                </p>
              </div>

              <div className="rounded-lg border border-border-color/50 bg-bg-primary/30 p-3 font-mono text-xs">
                <div className="flex items-center gap-2 text-accent">
                  <MountedIcon className="h-4 w-4" />
                  {visualizerLabels[mountedCartridge.visualizerType]}
                </div>
                <div className="mt-2 text-text-secondary">ROLE // {role.toUpperCase()}</div>
              </div>
            </div>

            <DynamicSchematic
              type={mountedCartridge.visualizerType}
              title={mountedCartridge.title}
            />

            {mountedCartridge.id === "attention-decay" && (
              <section className="mt-5 rounded-lg border border-border-color/40 bg-bg-primary/30 p-4">
                <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                      // Graph Reading Protocol
                    </span>
                    <h2 className="mt-1 text-base font-bold text-text-primary">
                      How to read the attention decay field
                    </h2>
                  </div>
                  <span className="font-mono text-[10px] uppercase text-text-secondary">
                    Click graph toggle to switch axes
                  </span>
                </div>

                <p className="max-w-3xl text-sm leading-relaxed text-text-secondary">
                  This graph turns chart attention into a diagnostic map. The raw view shows whether a title rose quickly and how long it survived. The Z-score view strips away raw scale and shows statistical outliers, making titles like KPop Demon Hunters and Café con aroma de mujer stand out as unusually persistent attention events.
                </p>

                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {decayGraphNotes.map((note) => (
                    <div key={note.title} className="rounded border border-border-color/40 bg-white/5 p-3">
                      <div className="font-mono text-[10px] uppercase tracking-wider text-accent-pink">
                        {note.title}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-text-secondary">{note.body}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {mountedCartridge.dashboard && (
              <section className="mt-5 rounded-lg border border-accent/30 bg-bg-primary/30 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                      // Live Project Bridge
                    </span>
                    <h2 className="mt-1 flex items-center gap-2 text-base font-bold text-text-primary">
                      <MonitorPlay className="h-4 w-4 text-accent-pink" />
                      Run the actual project surface
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
                      {mountedCartridge.dashboard.summary} {mountedCartridge.dashboard.explanation}
                    </p>
                  </div>

                  <a
                    href={mountedCartridge.dashboard.localUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex h-10 shrink-0 items-center justify-center gap-2 rounded-lg bg-accent px-4 font-mono text-[11px] font-bold uppercase tracking-wider text-bg-primary shadow-[0_0_12px_var(--accent-glow)] transition-opacity hover:opacity-90"
                  >
                    {mountedCartridge.dashboard.label}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1fr_1.25fr]">
                  <div className="rounded-lg border border-border-color/40 bg-white/5 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-accent-pink">
                      Local source
                    </div>
                    <p className="mt-2 font-mono text-xs text-text-primary">
                      {mountedCartridge.sourcePath}
                    </p>
                    <p className="mt-3 text-xs leading-relaxed text-text-secondary">
                      Start the local process once, then this embedded panel and the launch button point to the real project app.
                    </p>
                  </div>

                  <div className="rounded-lg border border-border-color/40 bg-white/5 p-3">
                    <div className="font-mono text-[10px] uppercase tracking-wider text-accent-pink">
                      Launch command
                    </div>
                    <code className="mt-2 block overflow-x-auto whitespace-nowrap rounded border border-border-color/40 bg-bg-primary/70 px-3 py-2 font-mono text-[11px] text-text-primary">
                      {mountedCartridge.dashboard.launchCommand}
                    </code>
                  </div>
                </div>

                <div className="mt-4 overflow-hidden rounded-lg border border-border-color/40 bg-bg-primary/70">
                  <div className="border-b border-border-color/30 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-text-secondary">
                    Embedded local surface // requires {mountedCartridge.dashboard.localUrl.replace("http://", "")}
                  </div>
                  <iframe
                    src={mountedCartridge.dashboard.embedUrl}
                    title="CricAudit Streamlit dashboard"
                    className="h-[680px] w-full bg-bg-primary"
                    loading="lazy"
                  />
                </div>
              </section>
            )}

            {mountedCartridge.sourcePath && !mountedCartridge.dashboard && (
              <section className="mt-5 rounded-lg border border-border-color/40 bg-bg-primary/30 p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                  // Local Source Root
                </span>
                <h2 className="mt-1 text-base font-bold text-text-primary">
                  Project code lives in your personal workspace
                </h2>
                <p className="mt-2 font-mono text-xs text-text-primary">
                  {mountedCartridge.sourcePath}
                </p>
                <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-secondary">
                  This cartridge is represented by generated assets and mathematical scripts rather than a long-running dashboard server, so the portfolio keeps the canvas visualizer as the live surface.
                </p>
              </section>
            )}

            {mountedCartridge.assets && (
              <section className="mt-5 rounded-lg border border-border-color/40 bg-bg-primary/30 p-4">
                <div className="mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-accent">
                    // CricAudit Static Evidence Fallback
                  </span>
                  <h2 className="mt-1 text-base font-bold text-text-primary">
                    Screenshot archive and panel explanations
                  </h2>
                  <p className="mt-2 max-w-3xl text-sm leading-relaxed text-text-secondary">
                    These images remain as a stable evidence layer when the local Streamlit service is offline. They preserve the dashboard's core arguments: match-level integrity checks, ranked player influence, batting value, bowling pressure, and collapse detection.
                  </p>
                </div>

                <div className="space-y-5">
                  {mountedCartridge.assets.map((asset) => (
                    <figure
                      key={asset.src}
                      className="overflow-hidden rounded-lg border border-border-color/40 bg-white/5"
                    >
                      <div className="border-b border-border-color/30 bg-bg-primary/40 p-3">
                        <div className="font-mono text-[10px] uppercase tracking-wider text-accent-pink">
                          {asset.title}
                        </div>
                        <p className="mt-1 text-xs leading-relaxed text-text-secondary">{asset.summary}</p>
                      </div>
                      <img
                        src={withBasePath(asset.src)}
                        alt={`${asset.title} screenshot`}
                        className="h-auto w-full border-b border-border-color/30 bg-black/20"
                        loading="lazy"
                      />
                      <figcaption className="p-3 text-sm leading-relaxed text-text-secondary">
                        {asset.explanation}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1fr_260px]">
              <div>
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                  // Persona Context Stream
                </span>
                <p className="mt-3 min-h-[96px] text-base leading-relaxed text-text-secondary sm:text-lg">
                  {mountedCartridge.shortDesc[role] || mountedCartridge.shortDesc.general}
                </p>
              </div>

              <div className="rounded-lg border border-border-color/40 bg-bg-primary/30 p-4">
                <span className="font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                  // Cartridge Ledger
                </span>
                <div className="mt-3 space-y-2">
                  {mountedMetrics.map((metric) => (
                    <div
                      key={metric}
                      className="rounded border border-border-color/40 bg-white/5 px-3 py-2 font-mono text-[11px] text-text-primary"
                    >
                      <span className="mr-1.5 text-accent">»</span>
                      {metric}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-7 flex flex-col justify-between gap-4 border-t border-border-color/30 pt-5 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-2">
                <span className="mr-1 font-mono text-[10px] uppercase tracking-widest text-text-secondary">
                  Theme Chassis //
                </span>
                {(["dark", "light", "cyberpunk", "minimal"] as Theme[]).map((item) => (
                  <button
                    key={item}
                    onMouseEnter={() => sound.triggerFeedback("hover")}
                    onClick={() => handleThemeChange(item)}
                    className={`rounded-lg border px-3 py-1.5 font-mono text-[11px] uppercase transition-[border-color,color,background-color,box-shadow] ${
                      theme === item
                        ? "border-accent bg-accent/5 font-bold text-accent shadow-[0_0_12px_var(--accent-glow)]"
                        : "border-border-color text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <button
                onMouseEnter={() => sound.triggerFeedback("hover")}
                onClick={openProjectLog}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-accent px-4 font-mono text-xs font-bold uppercase tracking-wider text-bg-primary shadow-[0_0_15px_var(--accent-glow)] transition-opacity hover:opacity-90"
              >
                <Zap className="h-4 w-4" />
                Inspect Full Log
              </button>
            </div>
          </article>
        </main>
      </section>

      <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border-color/30 py-6 sm:flex-row">
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase text-text-secondary">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Core Agent // Cartridge Lab Operational
        </span>
        <div className="flex items-center gap-4 font-mono text-[11px] uppercase text-text-secondary">
          <span>
            <kbd className="rounded border border-border-color bg-white/5 px-1.5 py-0.5 text-[9px]">A</kbd> Contrast
          </span>
          <span>
            <kbd className="rounded border border-border-color bg-white/5 px-1.5 py-0.5 text-[9px]">C</kbd> Cognitive Focus
          </span>
        </div>
      </footer>

      <ProjectModal project={selectedProject} isOpen={isModalOpen} onClose={closeProjectLog} />
    </div>
  );
}
