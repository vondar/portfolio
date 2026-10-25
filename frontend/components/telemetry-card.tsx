"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import type { CSSProperties, PointerEvent as ReactPointerEvent } from "react";

import type { Project } from "@/lib/projects";


const projectStatus: Record<string, string> = {
  cricaudit: "Reconciled",
  "f2p-games": "Audited",
  "attention-deficit": "Modeled",
  nostalgia: "Verified",
};


type TelemetryCardProps = {
  project: Project;
  index: number;
};


export function TelemetryCard({ project, index }: TelemetryCardProps) {
  const cardRef = useRef<HTMLElement>(null);
  const rectRef = useRef<DOMRect | null>(null);
  const frameRef = useRef<number | null>(null);

  const updateRect = () => {
    rectRef.current = cardRef.current?.getBoundingClientRect() ?? null;
  };

  useEffect(() => {
    window.addEventListener("resize", updateRect, { passive: true });
    return () => {
      window.removeEventListener("resize", updateRect);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, []);

  const trackPointer = (event: ReactPointerEvent<HTMLElement>) => {
    if (!rectRef.current) updateRect();
    if (!rectRef.current) return;
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);

    const { clientX, clientY } = event;
    frameRef.current = requestAnimationFrame(() => {
      const rect = rectRef.current;
      const card = cardRef.current;
      if (!rect || !card) return;
      const x = ((clientX - rect.left) / rect.width) * 100;
      const y = ((clientY - rect.top) / rect.height) * 100;
      card.style.setProperty("--mouse-x", `${x.toFixed(1)}%`);
      card.style.setProperty("--mouse-y", `${y.toFixed(1)}%`);
    });
  };

  return (
    <article
      className="telemetry-card"
      data-accent={project.accent}
      onPointerEnter={updateRect}
      onPointerMove={trackPointer}
      ref={cardRef}
    >
      <div className="card-edge-markers" aria-hidden="true">
        <span className="marker top-left">+</span>
        <span className="marker top-right">+</span>
        <span className="marker bottom-left">+</span>
        <span className="marker bottom-right">+</span>
      </div>

      <header className="telemetry-header">
        <div className="card-meta">
          <span className="index-badge">SYS.0{index + 1}</span>
          <span aria-hidden="true">/</span>
          <span>{project.eyebrow}</span>
        </div>
        <div className="status-indicator" title={`${project.title} data state`}>
          <span className="pulse-beacon" aria-hidden="true" />
          <span>{projectStatus[project.slug] ?? "Online"}</span>
        </div>
      </header>

      <div className="telemetry-body">
        <h2>{project.title}</h2>
        <p>{project.summary}</p>
      </div>

      <section className="telemetry-grid" aria-label={`${project.title} project metrics`}>
        {project.metrics.slice(0, 2).map((metric, metricIndex) => {
          const fill = 62 + ((index * 13 + metricIndex * 17) % 32);
          return (
            <div className="metric-cell" key={metric.label}>
              <span className="metric-label">{metric.label}</span>
              <strong className="metric-value">{metric.value}</strong>
              <div className="metric-bar" style={{ "--fill-pct": `${fill}%` } as CSSProperties} aria-hidden="true" />
            </div>
          );
        })}
      </section>

      <footer className="telemetry-footer">
        <ul className="tag-list" aria-label={`${project.title} technologies and methods`}>
          {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
        </ul>
        <Link className="inspect-action" href={`/projects/${project.slug}`} aria-label={`Inspect ${project.title} system`}>
          <span>Inspect</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M1 11 11 1M11 1H3m8 0v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>
      </footer>
    </article>
  );
}

