import { ProjectWorkbench } from "@/components/project-workbench";
import { getProjects } from "@/lib/projects";
import { profile } from "@/lib/profile";


export default async function Home() {
  const projects = await getProjects();
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

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
        <aside className="system-monitor system-topology" aria-label="Portfolio system architecture">
          <div className="monitor-header">
            <span>SYS.00 / System topology</span>
            <span className="monitor-state"><i aria-hidden="true" />Live</span>
          </div>
          <ol className="topology-flow">
            <li><span>01 / Ingestion</span><strong>Python · Streamlit</strong></li>
            <li><span>02 / Core</span><strong>Django · Data API</strong></li>
            <li><span>03 / Interface</span><strong>Next.js · React</strong></li>
          </ol>
          <div className="monitor-scan" aria-hidden="true"><span /></div>
        </aside>
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
              {profile.links.map((link) => {
                const opensNewTab = link.href.startsWith("http") || link.href.endsWith(".pdf");
                const href = link.href.startsWith("/") ? `${basePath}${link.href}` : link.href;
                return (
                  <a href={href} key={link.label} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noreferrer" : undefined}>
                    {link.label} ↗
                  </a>
                );
              })}
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
                  <span className="experience-artifact">↳ Artifact: {item.artifact}</span>
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

      <ProjectWorkbench projects={projects} />
    </>
  );
}
