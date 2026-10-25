"use client";

import Link from "next/link";
import { useState } from "react";

import type { Project } from "@/lib/projects";


const dossiers = {
  cricaudit: {
    file: "wtc_audit_results.json / collapse_events",
    status: "94 MATCHES RECONCILED",
    metrics: [["Matches", "94"], ["Cycle", "2023–25"], ["Players", "187"]],
  },
  "f2p-games": {
    file: "analysis_output.json / tail_risk",
    status: "100K SEEDED RUNS",
    metrics: [["Runs", "100K"], ["95% budget", "$4,853"], ["Grade", "F"]],
  },
  "attention-deficit": {
    file: "metrics_summary.csv / attention_clusters",
    status: "175,260 ROWS MODELED",
    metrics: [["Observations", "175,260"], ["Regions", "95"], ["Titles", "15,710"]],
  },
  nostalgia: {
    file: "verification_dry_run.csv / resolved_entities",
    status: "50 MATCHES VERIFIED",
    metrics: [["Songs", "50"], ["Artists", "44"], ["Mean score", "70%"]],
  },
} as const;

type DossierSlug = keyof typeof dossiers;


function CricAuditArtifact() {
  const rows = [
    ["Australia", "5 → 9", "316 → 408", "+92"],
    ["Australia", "6 → 10", "316 → 416", "+100"],
    ["England", "4 → 8", "208 → 324", "+116"],
    ["England", "6 → 10", "279 → 325", "+46"],
  ];
  return (
    <div className="artifact-table cricket-ledger" role="table" aria-label="Sample collapse events from the CricAudit dataset">
      <div className="artifact-row artifact-row-head" role="row"><span role="columnheader">Team</span><span role="columnheader">Wickets</span><span role="columnheader">Score delta</span><span role="columnheader">Runs</span></div>
      {rows.map((row) => <div className="artifact-row" role="row" key={row.join("-")}>{row.map((cell) => <code role="cell" key={cell}>{cell}</code>)}</div>)}
    </div>
  );
}


function F2PArtifact() {
  return (
    <div className="risk-artifact">
      <svg className="risk-curve" viewBox="0 0 560 260" role="img" aria-labelledby="risk-title risk-desc">
        <title id="risk-title">F2P acquisition cost distribution</title>
        <desc id="risk-desc">The median cost is 1,112 dollars, the 95th percentile is 4,853 dollars, and the worst five percent average is 6,109 dollars.</desc>
        <g className="chart-grid"><path d="M48 32V220H530M48 173H530M48 126H530M48 79H530" /></g>
        <path className="curve-area" d="M48 220C82 218 105 210 129 188C159 160 175 90 207 76C242 61 267 116 291 152C326 203 370 214 530 219V220Z" />
        <path className="curve-line" d="M48 220C82 218 105 210 129 188C159 160 175 90 207 76C242 61 267 116 291 152C326 203 370 214 530 219" />
        <g className="percentile-marker median"><path d="M207 52V220" /><circle cx="207" cy="76" r="4" /><text x="218" y="62">P50 · $1,112</text></g>
        <g className="percentile-marker p95"><path d="M435 52V220" /><circle cx="435" cy="217" r="4" /><text x="424" y="42" textAnchor="end">P95 · $4,853</text></g>
        <text className="axis-label" x="48" y="244">$0</text><text className="axis-label" x="493" y="244">$6,109+</text>
      </svg>
      <div className="risk-readout"><span>Worst 5% average</span><strong>$6,109</strong><span>5.49× median</span></div>
    </div>
  );
}


function AttentionArtifact() {
  const points = [
    ["Girls to Buy · PL", 296, 36, 7], ["Spider-Verse · NZ", 300, 75, 6],
    ["Badhaai Do · IN", 311, 98, 6], ["This World · IT", 78, 101, 5],
    ["Jirisan · SG", 308, 111, 6], ["Badhaai Do · BD", 316, 112, 5],
    ["Rhythm + Flow · FR", 305, 114, 7], ["Rhythm + Flow · MQ", 301, 119, 5],
  ] as const;
  return (
    <div className="attention-artifact">
      <svg className="cluster-plot" viewBox="0 0 560 300" role="img" aria-labelledby="cluster-title cluster-desc">
        <title id="cluster-title">Attention persistence cluster sample</title>
        <desc id="cluster-desc">Eight high-persistence title and region observations plotted by velocity and persistence z scores.</desc>
        <g className="chart-grid"><path d="M48 24V248H532M48 192H532M48 136H532M48 80H532M169 24V248M290 24V248M411 24V248" /></g>
        <path className="quadrant-line" d="M290 24V248M48 136H532" />
        {points.map(([label, x, y, radius]) => <g className="cluster-point" key={label}><circle cx={x} cy={y} r={radius} /><title>{label}</title></g>)}
        <text className="axis-label" x="48" y="274">LOW VELOCITY</text><text className="axis-label" x="442" y="274">HIGH VELOCITY</text>
        <text className="plot-label" x="60" y="43">SLOW BURN</text><text className="plot-label" x="416" y="43">CULTURAL ANCHOR</text>
      </svg>
      <div className="artifact-key"><span><i /> Persistence / velocity sample</span><strong>Hover points to inspect titles</strong></div>
    </div>
  );
}


function NostalgiaArtifact() {
  const rows = [
    ["Locked Out of Heaven", "Bruno Mars", "zuaBRqUBhyw", "0.70"],
    ["Diamonds", "Rihanna", "4mVo93E9wpU", "0.70"],
    ["Ho Hey", "The Lumineers", "SuZytYa71lk", "0.70"],
    ["Beauty and a Beat", "Justin Bieber", "aWkPBCF8rFU", "0.70"],
  ];
  return (
    <div className="artifact-table nostalgia-ledger" role="table" aria-label="Sample resolved songs from the Nostalgia dataset">
      <div className="artifact-row artifact-row-head" role="row"><span role="columnheader">Normalized song</span><span role="columnheader">Artist</span><span role="columnheader">Video ID</span><span role="columnheader">Score</span></div>
      {rows.map((row) => <div className="artifact-row" role="row" key={row[2]}>{row.map((cell, index) => <code className={index === 3 ? "score-cell" : undefined} role="cell" key={cell}>{cell}</code>)}</div>)}
    </div>
  );
}


function Artifact({ slug }: { slug: DossierSlug }) {
  if (slug === "cricaudit") return <CricAuditArtifact />;
  if (slug === "f2p-games") return <F2PArtifact />;
  if (slug === "attention-deficit") return <AttentionArtifact />;
  return <NostalgiaArtifact />;
}


export function ProjectWorkbench({ projects }: { projects: Project[] }) {
  const available = projects.filter((project): project is Project & { slug: DossierSlug } => project.slug in dossiers);
  const [activeSlug, setActiveSlug] = useState<DossierSlug>(available[0]?.slug ?? "cricaudit");
  const active = dossiers[activeSlug];

  return (
    <section className="work portfolio-workbench" id="work" aria-labelledby="workbench-heading">
      <div className="workbench-header">
        <div><p className="eyebrow">01 / Selected work</p><h2 id="workbench-heading">Inspectable system dossiers.</h2></div>
        <p>Real outputs from the bundled project datasets.</p>
      </div>
      <div className="workbench-grid">
        <div className="project-dossier-list" role="list" aria-label="Projects">
          {available.map((project, index) => {
            const dossier = dossiers[project.slug];
            const isActive = project.slug === activeSlug;
            return (
              <article className={`project-record${isActive ? " is-active" : ""}`} data-accent={project.accent} key={project.slug} role="listitem">
                <button className="record-selector" type="button" aria-controls="artifact-viewport" aria-pressed={isActive} onClick={() => setActiveSlug(project.slug)} onFocus={() => setActiveSlug(project.slug)}>
                  <span className="record-meta"><span className="record-id">SYS_0{index + 1}</span><span>{project.eyebrow}</span></span>
                  <strong className="record-title">{project.title}</strong>
                  <span className="record-summary">{project.summary}</span>
                  <span className="record-telemetry">
                    {dossier.metrics.map(([label, value], metricIndex) => <span key={label}><small>{label}</small><b className={metricIndex === 1 ? "highlight" : undefined}>{value}</b></span>)}
                  </span>
                </button>
                <div className="record-links"><Link href={`/projects/${project.slug}`}>Open case study →</Link><Link className="secondary" href={`/projects/${project.slug}#dashboard`}>Live dashboard ↗</Link></div>
              </article>
            );
          })}
        </div>
        <aside className="artifact-viewport" id="artifact-viewport" aria-live="polite" aria-label={`${activeSlug} data artifact`}>
          <div className="viewport-chrome">
            <span className="chrome-dot-group" aria-hidden="true"><i /><i /><i /></span>
            <span className="viewport-title">{active.file}</span>
            <span className="viewport-status">{active.status}</span>
          </div>
          <div className="viewport-content" key={activeSlug}><Artifact slug={activeSlug} /></div>
          <div className="artifact-annotation"><span aria-hidden="true">ⓘ</span><span>Snapshot rendered from the repository&apos;s bundled source data. Open the dashboard for filters and full analysis.</span></div>
        </aside>
      </div>
    </section>
  );
}
