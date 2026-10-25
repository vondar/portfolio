import Link from "next/link";

import { getProjects } from "@/lib/projects";


export const revalidate = 300;


export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Data product portfolio · 2026</p>
          <h1>Find the system<br />beneath the signal.</h1>
          <p className="hero-lead">
            Four investigations into what scores, spending, rankings, and songs reveal when the underlying data is made legible.
          </p>
        </div>
        <div className="hero-index" aria-label="Portfolio summary">
          <div><strong>04</strong><span>Projects</span></div>
          <div><strong>28.3 MB</strong><span>Source data</span></div>
          <div><strong>03</strong><span>Services</span></div>
        </div>
      </section>

      <section className="work" id="work">
        <div className="section-heading">
          <p className="eyebrow">Selected work</p>
          <p>Interactive dashboards, embedded in context.</p>
        </div>
        <div className="project-grid">
          {projects.map((project, index) => (
            <Link className="project-card" data-accent={project.accent} href={`/projects/${project.slug}`} key={project.slug}>
              <div className="card-topline">
                <span>0{index + 1}</span>
                <span>{project.eyebrow}</span>
              </div>
              <div>
                <h2>{project.title}</h2>
                <p>{project.summary}</p>
              </div>
              <div className="metric-row">
                {project.metrics.slice(0, 2).map((metric) => (
                  <div key={metric.label}>
                    <strong>{metric.value}</strong>
                    <span>{metric.label}</span>
                  </div>
                ))}
              </div>
              <div className="card-footer">
                <div className="tag-list">
                  {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
                </div>
                <span className="arrow" aria-hidden="true">↗</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="architecture">
        <p className="eyebrow">Built in layers</p>
        <div className="architecture-grid">
          <div><span>01</span><h3>Next.js</h3><p>Editorial frontend and project navigation.</p></div>
          <div><span>02</span><h3>Django</h3><p>Typed project catalog and data summaries.</p></div>
          <div><span>03</span><h3>Streamlit</h3><p>Interactive analytics embedded per project.</p></div>
        </div>
      </section>
    </>
  );
}

