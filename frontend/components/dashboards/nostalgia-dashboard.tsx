"use client";

import { useMemo, useState } from "react";

import { DashboardState, Metric, MetricStrip, Panel, formatNumber, useDashboardData } from "./dashboard-ui";


type Song = { song: string; artist: string; candidate: string; score: number; videoId: string };
type NostalgiaData = { rows: Song[]; artists: number; meanConfidence: number };


function ConfidenceHistogram({ rows }: { rows: Song[] }) {
  const bins = Array.from({ length: 10 }, (_, index) => ({ start: index / 10, count: 0 }));
  rows.forEach((row) => { bins[Math.min(Math.floor(row.score * 10), 9)].count += 1; });
  const max = Math.max(...bins.map((bin) => bin.count), 1);
  return <div className="histogram" role="img" aria-label="Distribution of entity-resolution confidence scores">{bins.map((bin) => <div className="histogram-bin" key={bin.start}><i style={{ height: `${(bin.count / max) * 100}%` }} title={`${Math.round(bin.start * 100)}–${Math.round((bin.start + 0.1) * 100)}%: ${bin.count} songs`} /><span>{Math.round(bin.start * 100)}%</span></div>)}</div>;
}


export function NostalgiaDashboard() {
  const { data, error } = useDashboardData<NostalgiaData>("nostalgia");
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!data || !term) return data?.rows ?? [];
    return data.rows.filter((row) => row.song.toLowerCase().includes(term) || row.artist.toLowerCase().includes(term) || row.candidate.toLowerCase().includes(term));
  }, [data, query]);
  const artists = useMemo(() => {
    const counts = new Map<string, number>();
    data?.rows.forEach((row) => counts.set(row.artist, (counts.get(row.artist) ?? 0) + 1));
    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12);
  }, [data]);
  if (!data) return <DashboardState error={error} />;
  const maxArtist = Math.max(...artists.map(([, count]) => count), 1);
  return (
    <div className="native-dashboard" data-dashboard="nostalgia">
      <div className="dashboard-controls"><span className="dataset-status"><i />ENTITY LINKS RESOLVED</span><span className="dataset-caption">Verification dry-run snapshot</span></div>
      <MetricStrip><Metric label="Songs verified" value={formatNumber(data.rows.length)} /><Metric label="Artists" value={formatNumber(data.artists)} /><Metric label="Mean confidence" value={`${Math.round(data.meanConfidence * 100)}%`} /><Metric label="Video IDs resolved" value={formatNumber(data.rows.filter((row) => row.videoId).length)} /></MetricStrip>
      <div className="dashboard-grid"><Panel title="Confidence distribution" note="Resolution score by decile"><ConfidenceHistogram rows={data.rows} /></Panel><Panel title="Artists represented" note="Top 12 in the verification sample"><div className="bar-list artist-bars">{artists.map(([artist, count]) => <div className="bar-row" key={artist}><span>{artist}</span><i><b style={{ width: `${(count / maxArtist) * 100}%` }} /></i><strong>{count}</strong></div>)}</div></Panel></div>
      <Panel title="Verification ledger" note={`${filtered.length} matching records`}><label className="dashboard-field search-field"><span>Search song, artist, or candidate</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Bruno Mars…" /></label><div className="dashboard-table-shell"><table className="dashboard-table"><thead><tr><th>Song</th><th>Artist</th><th>Resolved candidate</th><th>Confidence</th><th>Music</th></tr></thead><tbody>{filtered.map((row) => <tr key={row.videoId}><td>{row.song}</td><td>{row.artist}</td><td>{row.candidate}</td><td><div className="confidence-cell"><i><b style={{ width: `${row.score * 100}%` }} /></i><span>{Math.round(row.score * 100)}%</span></div></td><td><a href={`https://music.youtube.com/watch?v=${row.videoId}`} target="_blank" rel="noreferrer">Open ↗</a></td></tr>)}</tbody></table></div><p className="table-note">The optional Billboard SQLite archive was not present in the source checkout, so this view presents only the available verification records.</p></Panel>
    </div>
  );
}
