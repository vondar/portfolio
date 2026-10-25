"use client";

import { useMemo, useState } from "react";

import { DashboardState, Metric, MetricStrip, Panel, SelectField, formatNumber, scale, useDashboardData } from "./dashboard-ui";


type AttentionPoint = { title: string; format: string; region: string; velocity: number; persistenceZ: number; halfLife: number; archetype: string };
type AttentionView = { titles: number; medianHalfLife: number; medianPersistence: number; anchors: number; sample: AttentionPoint[]; longest: { title: string; format: string; halfLife: number; archetype: string }[] };
type AttentionData = { regions: string[]; formats: string[]; views: Record<string, AttentionView>; diffusion: { region: string; lag: number }[] };


const archetypeClass: Record<string, string> = {
  "Supernova": "coral",
  "Slow burn": "cyan",
  "Cultural anchor": "gold",
  "Ghost": "muted",
  "Middle field": "blue",
};


function ClusterChart({ points, region }: { points: AttentionPoint[]; region: string }) {
  const xValues = points.map((point) => point.persistenceZ);
  const yValues = points.map((point) => point.velocity);
  const xLimit = Math.max(...xValues.map(Math.abs), 2);
  const yLimit = Math.max(...yValues.map(Math.abs), 2);
  return (
    <svg className="native-chart cluster-dashboard-chart" viewBox="0 0 760 470" role="img" aria-label={`Attention velocity and persistence clusters for ${region}`}>
      <g className="native-chart-grid"><path d="M58 28V414H736M58 317H736M58 221H736M58 124H736M228 28V414M397 28V414M567 28V414" /></g>
      <path className="chart-zero" d="M397 28V414M58 221H736" />
      {points.map((point, index) => <circle className={`chart-point chart-point-${archetypeClass[point.archetype] ?? "blue"}`} cx={scale(point.persistenceZ, -xLimit, xLimit, 58, 736)} cy={scale(point.velocity, -yLimit, yLimit, 414, 28)} r="5" key={`${point.title}-${point.region}-${index}`}><title>{point.title} · {point.format} · {point.archetype} · {point.halfLife.toFixed(1)} day half-life</title></circle>)}
      <text className="chart-axis-label" x="58" y="447">LOW PERSISTENCE</text><text className="chart-axis-label" x="620" y="447">HIGH PERSISTENCE</text>
      <text className="plot-quadrant" x="70" y="48">SUPERNOVA</text><text className="plot-quadrant" x="612" y="48">CULTURAL ANCHOR</text><text className="plot-quadrant" x="70" y="401">GHOST</text><text className="plot-quadrant" x="654" y="401">SLOW BURN</text>
    </svg>
  );
}


export function AttentionDashboard() {
  const { data, error } = useDashboardData<AttentionData>("attention-deficit");
  const [region, setRegion] = useState("Global");
  const [format, setFormat] = useState("All");
  const activeRegion = data?.regions.includes(region) ? region : data?.regions[0] ?? "Global";
  const availableFormats = data?.formats.filter((item) => data.views[`${activeRegion}|${item}`]) ?? ["All"];
  const activeFormat = availableFormats.includes(format) ? format : "All";
  const view = data?.views[`${activeRegion}|${activeFormat}`];
  const maxLag = useMemo(() => Math.max(...(data?.diffusion.map((item) => item.lag) ?? [1]), 1), [data]);
  if (!data || !view) return <DashboardState error={error} />;
  return (
    <div className="native-dashboard" data-dashboard="attention">
      <div className="dashboard-controls"><div className="control-group"><SelectField label="Region" value={activeRegion} onChange={setRegion}>{data.regions.map((item) => <option key={item}>{item}</option>)}</SelectField><SelectField label="Format" value={activeFormat} onChange={setFormat}>{availableFormats.map((item) => <option key={item}>{item}</option>)}</SelectField></div><span className="dataset-status"><i />REGIONAL MODEL READY</span></div>
      <MetricStrip><Metric label="Titles modeled" value={formatNumber(view.titles)} /><Metric label="Median half-life" value={`${view.medianHalfLife.toFixed(1)} days`} /><Metric label="Median persistence" value={view.medianPersistence.toFixed(2)} /><Metric label="Cultural anchors" value={formatNumber(view.anchors)} /></MetricStrip>
      <Panel title={`The deterministic quadrant · ${activeRegion}`} note={`${view.sample.length} deterministic sample points`}><ClusterChart points={view.sample} region={activeRegion} /><div className="chart-legend">{Object.entries(archetypeClass).map(([label, color]) => <span key={label}><i className={`legend-${color}`} />{label}</span>)}</div></Panel>
      <div className="dashboard-grid"><Panel title="Longest-lived attention" note="Top 12 by modeled half-life"><div className="dashboard-table-shell"><table className="dashboard-table"><thead><tr><th>Title</th><th>Format</th><th>Half-life</th><th>Archetype</th></tr></thead><tbody>{view.longest.map((item, index) => <tr key={`${item.title}-${index}`}><td>{item.title}</td><td>{item.format}</td><td>{item.halfLife.toFixed(1)} days</td><td><span className={`table-badge badge-${archetypeClass[item.archetype] ?? "blue"}`}>{item.archetype}</span></td></tr>)}</tbody></table></div></Panel><Panel title="Regional diffusion" note="Lowest median arrival lag"><div className="bar-list diffusion-bars">{data.diffusion.map((item) => <div className="bar-row" key={item.region}><span>{item.region}</span><i><b style={{ width: `${Math.max((item.lag / maxLag) * 100, 2)}%` }} /></i><strong>{item.lag.toFixed(1)}d</strong></div>)}</div></Panel></div>
    </div>
  );
}
