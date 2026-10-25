export type ProjectMetric = {
  label: string;
  value: string;
};

export type Project = {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  dashboard_view: string;
  accent: "gold" | "coral" | "cyan" | "violet";
  tags: string[];
  metrics: ProjectMetric[];
};

export const fallbackProjects: Project[] = [
  {
    slug: "cricaudit",
    title: "CricAudit",
    eyebrow: "Sports analytics",
    summary: "Reconstructing Test cricket from ball-level events and auditing every total like a financial ledger.",
    dashboard_view: "CricAudit",
    accent: "gold",
    tags: ["Event sourcing", "WTC", "Reconciliation"],
    metrics: [
      { label: "Matches audited", value: "94" },
      { label: "Player records", value: "187" },
    ],
  },
  {
    slug: "f2p-games",
    title: "F2P Games",
    eyebrow: "Consumer protection",
    summary: "Exposing the true cost and long-tail risk hidden inside free-to-play reward systems.",
    dashboard_view: "F2P Games",
    accent: "coral",
    tags: ["Monte Carlo", "Risk", "Behavior"],
    metrics: [
      { label: "Simulations", value: "100,000" },
      { label: "95% safety budget", value: "$4,853" },
    ],
  },
  {
    slug: "attention-deficit",
    title: "Attention Deficit",
    eyebrow: "Cultural analytics",
    summary: "Modeling how streaming titles accelerate, persist, diffuse, and decay across regions.",
    dashboard_view: "Attention Deficit",
    accent: "cyan",
    tags: ["Lifecycle models", "Netflix", "Clustering"],
    metrics: [
      { label: "Observations", value: "175,260" },
      { label: "Regions", value: "95" },
      { label: "Titles", value: "15,710" },
    ],
  },
  {
    slug: "nostalgia",
    title: "Nostalgia",
    eyebrow: "Digital archive",
    summary: "Tracing Billboard-era songs into a verified YouTube Music archive with transparent match confidence.",
    dashboard_view: "Nostalgia",
    accent: "violet",
    tags: ["Entity resolution", "Billboard", "Archive"],
    metrics: [
      { label: "Songs verified", value: "50" },
      { label: "Artists", value: "44" },
    ],
  },
];

const configuredApiBase = process.env.DJANGO_API_URL;
const apiBase = configuredApiBase || "http://127.0.0.1:8000/api";
const useBundledCatalog = process.env.STATIC_EXPORT === "true" && !configuredApiBase;

export async function getProjects(): Promise<Project[]> {
  if (useBundledCatalog) return fallbackProjects;
  try {
    const response = await fetch(`${apiBase}/projects/`, { cache: "force-cache", signal: AbortSignal.timeout(3000) });
    if (!response.ok) throw new Error(`Django API returned ${response.status}`);
    const payload = (await response.json()) as { projects: Project[] };
    return payload.projects;
  } catch {
    return fallbackProjects;
  }
}

export async function getProject(slug: string): Promise<Project | undefined> {
  if (useBundledCatalog) return fallbackProjects.find((project) => project.slug === slug);
  try {
    const response = await fetch(`${apiBase}/projects/${slug}/`, { cache: "force-cache", signal: AbortSignal.timeout(3000) });
    if (!response.ok) return fallbackProjects.find((project) => project.slug === slug);
    return (await response.json()) as Project;
  } catch {
    return fallbackProjects.find((project) => project.slug === slug);
  }
}

export function dashboardUrl(view: string): string | null {
  const configuredUrl = process.env.STREAMLIT_PUBLIC_URL;
  if (process.env.STATIC_EXPORT === "true" && !configuredUrl) return null;

  const url = new URL(configuredUrl || "http://127.0.0.1:8501");
  url.searchParams.set("view", view);
  url.searchParams.set("embed", "true");
  url.searchParams.set("portfolio_embed", "true");
  return url.toString();
}
