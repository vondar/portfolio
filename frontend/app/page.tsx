import { TelemetryCard } from "@/components/telemetry-card";
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
        <aside className="system-monitor" aria-label="Portfolio system telemetry">
          <div className="monitor-header">
            <span>SYS.00 / Portfolio</span>
            <span className="monitor-state"><i aria-hidden="true" />Live</span>
          </div>
          <dl>
            <div><dt>Projects</dt><dd>04</dd></div>
            <div><dt>Source</dt><dd>28.3 MB</dd></div>
            <div><dt>Ingest</dt><dd>OK</dd></div>
            <div><dt>Services</dt><dd>03</dd></div>
          </dl>
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
                return (
                  <a href={link.href} key={link.label} target={opensNewTab ? "_blank" : undefined} rel={opensNewTab ? "noreferrer" : undefined}>
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
            <TelemetryCard index={index} key={project.slug} project={project} />
          ))}
        </div>
      </section>

      <section className="architecture" aria-labelledby="architecture-heading">
        <div className="section-heading">
          <div><p className="eyebrow">Built in layers</p><h2 id="architecture-heading">One signal path. Three computational strata.</h2></div>
          <p>Data moves upward. Intent moves down.</p>
        </div>
        <ol className="stack-diagram">
          <li>
            <span className="layer-index">L03</span>
            <div><p>Presentation layer</p><h3>Next.js</h3><span>Editorial interface · routing · composition</span></div>
            <strong>VIEW</strong>
          </li>
          <li>
            <span className="layer-index">L02</span>
            <div><p>Application and aggregation engine</p><h3>Django</h3><span>Catalog API · computed summaries · boundaries</span></div>
            <strong>API</strong>
          </li>
          <li>
            <span className="layer-index">L01</span>
            <div><p>Exploratory analytics workbench</p><h3>Streamlit</h3><span>Plotly views · filters · forensic inspection</span></div>
            <strong>DATA</strong>
          </li>
        </ol>
      </section>
    </>
  );
}
