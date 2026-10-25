"use client";

import { useMemo, useState } from "react";
import type { CSSProperties } from "react";

import { DashboardState, Metric, MetricStrip, Panel, SelectField, formatNumber, scale, useDashboardData } from "./dashboard-ui";


type System = { system: string; game: string; dropRate: number; costPerPull: number; expectedPulls: number; expectedCost: number; pity: boolean };
type F2PData = {
  metadata: { system_name: string; iterations: number; timestamp: string };
  risk: { median_cost: number; p95_cost: number; cte95_cost: number; wrr: number; transparency_score: number; transparency_grade: string };
  sensitivity: { rate: number; cost: number }[];
  systems: System[];
  pressure: { incentiveGap: number; exchangeSteps: number; recoveryRate: number };
};


function SensitivityChart({ points }: { points: F2PData["sensitivity"] }) {
  const max = Math.max(...points.map((point) => point.cost));
  const coordinates = points.map((point) => `${scale(Math.log10(point.rate), -3.4, -2, 58, 680)},${scale(point.cost, 0, max, 300, 30)}`).join(" ");
  return <svg className="native-chart" viewBox="0 0 700 340" role="img" aria-label="Drop rate sensitivity of the 95 percent acquisition budget"><g className="native-chart-grid"><path d="M58 30V300H680M58 232H680M58 165H680M58 97H680" /></g><polyline className="chart-line chart-line-coral" points={coordinates} />{points.map((point) => <circle className="chart-point chart-point-coral" cx={scale(Math.log10(point.rate), -3.4, -2, 58, 680)} cy={scale(point.cost, 0, max, 300, 30)} r="6" key={point.rate}><title>{(point.rate * 100).toFixed(3)}% drop rate · ${formatNumber(point.cost)}</title></circle>)}<text className="chart-axis-label" x="58" y="326">0.05% DROP RATE</text><text className="chart-axis-label" x="570" y="326">1.00%</text></svg>;
}


function SystemScatter({ systems, selected }: { systems: System[]; selected: string }) {
  const maxCost = Math.max(...systems.map((item) => item.expectedCost));
  return <svg className="native-chart" viewBox="0 0 700 340" role="img" aria-label="Expected acquisition cost by published drop rate"><g className="native-chart-grid"><path d="M58 30V300H680M58 232H680M58 165H680M58 97H680" /></g>{systems.map((item) => <circle className={`chart-point chart-point-coral${item.system === selected ? " selected" : ""}`} cx={scale(Math.log10(item.dropRate), -3.4, -2, 58, 680)} cy={scale(item.expectedCost, 0, maxCost, 300, 30)} r={item.system === selected ? 11 : 6} key={item.system}><title>{item.system} · {(item.dropRate * 100).toFixed(3)}% · ${formatNumber(item.expectedCost)}</title></circle>)}<text className="chart-axis-label" x="58" y="326">RARER / HIGHER EXPECTED COST</text></svg>;
}


export function F2PDashboard() {
  const { data, error } = useDashboardData<F2PData>("f2p-games");
  const [selectedName, setSelectedName] = useState("");
  const selected = useMemo(() => data?.systems.find((item) => item.system === selectedName) ?? data?.systems[0], [data, selectedName]);
  if (!data || !selected) return <DashboardState error={error} />;
  const risk = data.risk;
  return (
    <div className="native-dashboard" data-dashboard="f2p">
      <div className="dashboard-verdict"><strong>Forensic verdict · Grade {risk.transparency_grade}</strong><span>The median acquisition costs ${formatNumber(risk.median_cost)}, while the 95% safety budget rises to ${formatNumber(risk.p95_cost)}. That tail-risk gap is the product, not a rounding error.</span></div>
      <MetricStrip><Metric label="Median cost" value={`$${formatNumber(risk.median_cost)}`} /><Metric label="95% safety budget" value={`$${formatNumber(risk.p95_cost)}`} note={`${(risk.p95_cost / risk.median_cost).toFixed(1)}× median`} /><Metric label="Worst 5% average" value={`$${formatNumber(risk.cte95_cost)}`} /><Metric label="Transparency" value={`${formatNumber(risk.transparency_score)}/100`} note={`Grade ${risk.transparency_grade}`} /></MetricStrip>
      <div className="dashboard-grid dashboard-grid-wide"><Panel title="How tiny odds inflate cost" note="95% safety budget"><SensitivityChart points={data.sensitivity} /></Panel><Panel title="Unlucky-player revenue ratio" note="Tail spend relative to median"><div className="risk-gauge" style={{ "--gauge": `${Math.min(risk.wrr / 6, 1) * 100}%` } as CSSProperties}><div><strong>{risk.wrr.toFixed(2)}×</strong><span>WRR</span></div></div><p className="chart-caption">The unluckiest cohort generates more than five times the median player revenue.</p></Panel></div>
      <Panel title="System comparison" note="Published probabilities and naive expected cost"><div className="panel-toolbar"><SelectField label="Inspect system" value={selected.system} onChange={setSelectedName}>{data.systems.map((item) => <option key={item.system}>{item.system}</option>)}</SelectField><div className="inline-readout"><span>{selected.game}</span><strong>{(selected.dropRate * 100).toFixed(3)}%</strong><small>{selected.pity ? "Pity disclosed" : "No pity observed"}</small></div></div><SystemScatter systems={data.systems} selected={selected.system} /><div className="dashboard-table-shell"><table className="dashboard-table"><thead><tr><th>System</th><th>Game</th><th>Drop rate</th><th>Cost / pull</th><th>Expected cost</th><th>Pity</th></tr></thead><tbody>{data.systems.map((item) => <tr className={item.system === selected.system ? "is-selected" : ""} key={item.system}><td>{item.system}</td><td>{item.game}</td><td>{(item.dropRate * 100).toFixed(3)}%</td><td>${item.costPerPull.toFixed(2)}</td><td>${formatNumber(item.expectedCost)}</td><td>{item.pity ? "Yes" : "No"}</td></tr>)}</tbody></table></div></Panel>
      <Panel title="Pressure beyond the pull" note={`${formatNumber(data.metadata.iterations)} seeded simulations`}><MetricStrip><Metric label="Shop incentive gap" value={`$${formatNumber(data.pressure.incentiveGap)}`} note="forced surplus" /><Metric label="Currency exchanges" value={String(data.pressure.exchangeSteps)} /><Metric label="1 missed day recovery" value={`${formatNumber(data.pressure.recoveryRate)}%`} /></MetricStrip></Panel>
    </div>
  );
}
