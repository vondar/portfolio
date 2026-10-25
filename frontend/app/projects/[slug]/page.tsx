import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { StaticProjectArtifact } from "@/components/project-workbench";
import { dashboardUrl, fallbackProjects, getProject } from "@/lib/projects";


type ProjectPageProps = {
  params: Promise<{ slug: string }>;
};


export function generateStaticParams() {
  return fallbackProjects.map((project) => ({ slug: project.slug }));
}


export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return project ? { title: project.title, description: project.summary } : {};
}


export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();

  const source = dashboardUrl(project.dashboard_view);

  return (
    <article className="project-page">
      <Link className="back-link" href="/">← All projects</Link>
      <header className="project-intro" data-accent={project.accent}>
        <div>
          <p className="eyebrow">{project.eyebrow}</p>
          <h1>{project.title}</h1>
          <p>{project.summary}</p>
        </div>
        <div className="project-metrics">
          {project.metrics.map((metric) => (
            <div key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></div>
          ))}
        </div>
      </header>

      <section className="dashboard-section" id="dashboard" aria-labelledby="dashboard-title">
        <div className="dashboard-heading">
          <div>
            <p className="eyebrow">{source ? "Live analysis" : "Bundled analysis"}</p>
            <h2 id="dashboard-title">{source ? "Interactive dashboard" : "Dataset artifact"}</h2>
          </div>
          {source ? <a href={source} target="_blank" rel="noreferrer">Open full screen ↗</a> : null}
        </div>
        {source ? (
          <>
            <div className="frame-shell">
              <div className="frame-bar" aria-hidden="true"><i></i><i></i><i></i><span>analytics / {project.slug}</span></div>
              <iframe
                src={source}
                title={`${project.title} interactive dashboard`}
                loading="eager"
                sandbox="allow-downloads allow-forms allow-popups allow-same-origin allow-scripts"
              />
            </div>
            <p className="frame-note">The dashboard is served by Streamlit and embedded here without its navigation chrome.</p>
          </>
        ) : (
          <StaticProjectArtifact slug={project.slug} />
        )}
      </section>
    </article>
  );
}
