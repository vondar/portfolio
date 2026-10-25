import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { NativeDashboard } from "@/components/dashboards/native-dashboard";
import { fallbackProjects, getProject } from "@/lib/projects";


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
            <p className="eyebrow">Browser-native analysis</p>
            <h2 id="dashboard-title">Interactive dashboard</h2>
          </div>
          <span className="native-dashboard-label"><i />No server required</span>
        </div>
        <NativeDashboard slug={project.slug} />
      </section>
    </article>
  );
}
