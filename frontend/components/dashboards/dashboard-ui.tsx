"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";


const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";


export function useDashboardData<T>(name: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${basePath}/dashboard-data/${name}.json`, { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`Dashboard data returned ${response.status}`);
        return response.json() as Promise<T>;
      })
      .then(setData)
      .catch((reason: unknown) => {
        if (!(reason instanceof DOMException && reason.name === "AbortError")) setError(true);
      });
    return () => controller.abort();
  }, [name]);

  return { data, error };
}


export function DashboardState({ error = false }: { error?: boolean }) {
  return (
    <div className="native-dashboard-state" role={error ? "alert" : "status"}>
      <span className="monitor-state"><i aria-hidden="true" />{error ? "Data unavailable" : "Loading dataset"}</span>
      <p>{error ? "The generated dashboard dataset could not be loaded." : "Preparing the browser-native analysis view…"}</p>
    </div>
  );
}


export function MetricStrip({ children }: { children: ReactNode }) {
  return <div className="dashboard-metrics">{children}</div>;
}


export function Metric({ label, value, note }: { label: string; value: string; note?: string }) {
  return <div className="dashboard-metric"><span>{label}</span><strong>{value}</strong>{note ? <small>{note}</small> : null}</div>;
}


export function Panel({ title, note, children, className = "" }: { title: string; note?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`dashboard-panel ${className}`.trim()}>
      <header><div><p className="panel-kicker">Analysis module</p><h3>{title}</h3></div>{note ? <p>{note}</p> : null}</header>
      <div className="panel-body">{children}</div>
    </section>
  );
}


export function SelectField({ label, value, onChange, children }: { label: string; value: string; onChange: (value: string) => void; children: ReactNode }) {
  return <label className="dashboard-field"><span>{label}</span><select value={value} onChange={(event) => onChange(event.target.value)}>{children}</select></label>;
}


export function formatNumber(value: number, digits = 0) {
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: digits }).format(value);
}


export function scale(value: number, minimum: number, maximum: number, start: number, end: number) {
  if (maximum === minimum) return (start + end) / 2;
  return start + ((value - minimum) / (maximum - minimum)) * (end - start);
}
