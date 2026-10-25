import Link from "next/link";

import { getProjects } from "@/lib/projects";
import { profile } from "@/lib/profile";


export const revalidate = 300;


export default async function Home() {
  const projects = await getProjects();

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">{profile.name} · Data product portfolio</p>
          <h1>Find the system<br />beneath the signal.</h1>
          <p className="hero-lead">
            I&apos;m a fullstack engineer working across Python, React, and data systems. These are four investigations into what scores, spending, rankings, and songs reveal when the underlying data is made legible.
          </p>
        </div>
        <div className="hero-index" aria-label="Portfolio summary">
          <div><strong>04</strong><span>Projects</span></div>
          <div><strong>28.3 MB</strong><span>Source data</span></div>
          <div><strong>03</strong><span>Services</span></div>
        </div>
      </section>

      <section className="profile" id="about" aria-labelledby="about-heading">
        <div className="profile-heading">
          <div>
            <p className="eyebrow">About</p>
            <h2 id="about-heading">{profile.name}</h2>
            <p className="profile-role">{profile.role} · {profile.location}</p>
          </div>
          <div className="profile-copy">
            <p>{profile.introduction}</p>
            <p>{profile.focus}</p>
            <div className="profile-links" aria-label="Professional links">
              {profile.links.map((link) => (
                <a href={link.href} key={link.label} target={link.href.startsWith("http") ? "_blank" : undefined} rel={link.href.startsWith("http") ? "noreferrer" : undefined}>
                  {link.label} ↗
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="profile-body">
          <div className="experience" aria-labelledby="experience-heading">
            <p className="eyebrow" id="experience-heading">Experience</p>
            {profile.experience.map((item) => (
              <article className="experience-item" key={`${item.company}-${item.period}`}>
                <div><span>{item.period}</span></div>
                <div>
                  <h3>{item.role}</h3>
                  <p className="company">{item.company}</p>
                  <p>{item.detail}</p>
                </div>
              </article>
            ))}
          </div>

          <aside className="profile-sidebar">
            <div>
              <p className="eyebrow">Core stack</p>
              <div className="skill-groups">
                {profile.skills.map((group) => (
                  <div className="skill-group" key={group.label}>
                    <h3>{group.label}</h3>
                    <p>{group.values.join(" · ")}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="education">
              <p className="eyebrow">Education</p>
              <h3>{profile.education.degree}</h3>
              <p>{profile.education.institution}</p>
              <span>{profile.education.year}</span>
            </div>
          </aside>
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
