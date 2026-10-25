"use client";

import { useMemo, useState } from "react";

import { DashboardState, Metric, MetricStrip, Panel, SelectField, formatNumber, scale, useDashboardData } from "./dashboard-ui";


type Leader = { player: string; team: string; points: number; matches: number };
type BowlingPoint = { player: string; team: string; dotPercentage: number; wvi: number; wickets: number };
type BattingPoint = { player: string; team: string; match: string; rbi: number };
type Collapse = { match: string; team: string; collapse: string; runs: number; matchId: string };
type CricketData = {
  metadata: { matches_audited: number; cycle: string };
  leaderboard: Leader[];
  bowling: BowlingPoint[];
  batting: BattingPoint[];
  collapses: Collapse[];
};


function BowlingScatter({ points }: { points: BowlingPoint[] }) {
  const visible = points.slice(0, 90);
  const maxWvi = Math.max(...visible.map((point) => point.wvi), 1);
  const maxWickets = Math.max(...visible.map((point) => point.wickets), 1);
  return (
    <svg className="native-chart" viewBox="0 0 700 360" role="img" aria-label="Bowling pressure by dot-ball percentage and wicket value">
      <g className="native-chart-grid"><path d="M54 28V312H680M54 241H680M54 170H680M54 99H680" /></g>
      {visible.map((point) => {
        const x = scale(point.dotPercentage, 45, 90, 54, 680);
        const y = scale(point.wvi, 0, maxWvi, 312, 28);
        const radius = scale(point.wickets, 10, maxWickets, 3, 12);
        return <circle className="chart-point chart-point-gold" cx={x} cy={y} r={radius} key={`${point.player}-${point.team}`}><title>{point.player} · {point.team} · {point.dotPercentage}% dots · {point.wvi} WVI · {point.wickets} wickets</title></circle>;
      })}
      <text className="chart-axis-label" x="54" y="340">45% DOT-BALL PRESSURE</text><text className="chart-axis-label" x="536" y="340">90% PRESSURE</text>
    </svg>
  );
}


function LeaderBars({ leaders }: { leaders: Leader[] }) {
  const visible = [...leaders].slice(0, 10).reverse();
  const max = Math.max(...visible.map((leader) => leader.points), 1);
  return <div className="bar-list">{visible.map((leader) => <div className="bar-row" key={leader.player}><span>{leader.player}</span><i><b style={{ width: `${(leader.points / max) * 100}%` }} /></i><strong>{formatNumber(leader.points)}</strong></div>)}</div>;
}


function BattingTrend({ points }: { points: BattingPoint[] }) {
  if (!points.length) return <p className="empty-chart">No innings are available for this player.</p>;
  const min = Math.min(...points.map((point) => point.rbi), -1);
  const max = Math.max(...points.map((point) => point.rbi), 1);
  const coordinates = points.map((point, index) => `${scale(index, 0, Math.max(points.length - 1, 1), 42, 680)},${scale(point.rbi, min, max, 290, 24)}`).join(" ");
  const zero = scale(0, min, max, 290, 24);
  return (
    <svg className="native-chart" viewBox="0 0 700 330" role="img" aria-label="Batting value above average by audited match">
      <path className="chart-zero" d={`M42 ${zero}H680`} />
      <polyline className="chart-line chart-line-gold" points={coordinates} />
      {points.map((point, index) => <circle className="chart-point chart-point-gold" cx={scale(index, 0, Math.max(points.length - 1, 1), 42, 680)} cy={scale(point.rbi, min, max, 290, 24)} r="4" key={`${point.match}-${index}`}><title>{point.match} · {point.rbi > 0 ? "+" : ""}{point.rbi} runs above average</title></circle>)}
      <text className="chart-axis-label" x="42" y="316">MATCH ORDER · HOVER POINTS FOR FIXTURE</text>
    </svg>
  );
}


export function CricAuditDashboard() {
  const { data, error } = useDashboardData<CricketData>("cricaudit");
  const [team, setTeam] = useState("All");
  const [player, setPlayer] = useState("");
  const [collapseQuery, setCollapseQuery] = useState("");
  const teams = useMemo(() => data ? [...new Set(data.leaderboard.map((item) => item.team))].sort() : [], [data]);
  const leaders = useMemo(() => data?.leaderboard.filter((item) => team === "All" || item.team === team) ?? [], [data, team]);
  const bowlers = useMemo(() => data?.bowling.filter((item) => team === "All" || item.team === team) ?? [], [data, team]);
  const playerOptions = leaders.slice(0, 20);
  const activePlayer = player && playerOptions.some((item) => item.player === player) ? player : playerOptions[0]?.player ?? "";
  const batting = data?.batting.filter((item) => item.player === activePlayer) ?? [];
  const collapses = data?.collapses.filter((item) => {
    const matchesTeam = team === "All" || item.team === team;
    const term = collapseQuery.toLowerCase();
    return matchesTeam && (!term || item.match.toLowerCase().includes(term) || item.team.toLowerCase().includes(term));
  }).slice(0, 24) ?? [];

  if (!data) return <DashboardState error={error} />;
  const top = data.leaderboard[0];
  return (
    <div className="native-dashboard" data-dashboard="cricaudit">
      <div className="dashboard-controls"><SelectField label="Team scope" value={team} onChange={setTeam}><option>All</option>{teams.map((item) => <option key={item}>{item}</option>)}</SelectField><span className="dataset-status"><i />BALL-LEVEL AUDIT LOADED</span></div>
      <MetricStrip><Metric label="Matches audited" value={formatNumber(data.metadata.matches_audited)} note="ball-by-ball" /><Metric label="Cycle" value={data.metadata.cycle} /><Metric label="Top match-winner" value={top.player} note={`${formatNumber(top.points)} pts`} /><Metric label="Collapse events" value={formatNumber(data.collapses.length)} /></MetricStrip>
      <div className="dashboard-grid dashboard-grid-wide"><Panel title="The Strangle-O-Meter" note="Dot-ball pressure × wicket value"><BowlingScatter points={bowlers} /></Panel><Panel title="Match-winner leaderboard" note="Weighted contribution score"><LeaderBars leaders={leaders} /></Panel></div>
      <Panel title="Value above average" note="Runs relative to each match batting mean"><div className="panel-toolbar"><SelectField label="Player" value={activePlayer} onChange={setPlayer}>{playerOptions.map((item) => <option key={item.player}>{item.player}</option>)}</SelectField></div><BattingTrend points={batting} /></Panel>
      <Panel title="Structural failure registry" note={`${collapses.length} visible records`}><label className="dashboard-field search-field"><span>Search fixture or team</span><input value={collapseQuery} onChange={(event) => setCollapseQuery(event.target.value)} placeholder="Australia, Lord's…" /></label><div className="dashboard-table-shell"><table className="dashboard-table"><thead><tr><th>Match</th><th>Team</th><th>Collapse</th><th>Runs</th><th>Match ID</th></tr></thead><tbody>{collapses.map((item, index) => <tr key={`${item.matchId}-${item.team}-${index}`}><td>{item.match}</td><td>{item.team}</td><td><code>{item.collapse}</code></td><td>{item.runs}</td><td><code>{item.matchId}</code></td></tr>)}</tbody></table></div></Panel>
    </div>
  );
}
