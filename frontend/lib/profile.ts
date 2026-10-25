export const profile = {
  name: "Himanshu Mahajan",
  role: "Fullstack Engineer (Python / React)",
  location: "Nagpur, India",
  introduction:
    "I build data-heavy products from ingestion to interface: ETL and ELT pipelines, concurrent Python services, relational data systems, and React experiences that make complex operations easier to use.",
  focus:
    "My recent work spans semantic search with PostgreSQL and pgvector, OCR and local vision-language pipelines, high-throughput APIs, and cloud-hosted products across GCP, AWS, and Cloudflare.",
  links: [
    { label: "Resume", href: "/Himanshu_Mahajan_Resume.pdf" },
    { label: "Email", href: "mailto:himanshu.mahajan.work@proton.me" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/himanshu-mahajan-8a349099/" },
    { label: "GitHub", href: "https://github.com/vondar" },
  ],
  skills: [
    {
      label: "Engineering",
      values: ["Python", "JavaScript", "SQL", "Unix / Bash", "REST APIs", "ETL / ELT"],
    },
    {
      label: "Cloud and delivery",
      values: ["GCP", "AWS", "Docker", "Kubernetes", "CI / CD", "Celery"],
    },
    {
      label: "Data systems",
      values: ["PostgreSQL", "Redis", "pgvector", "MySQL", "MongoDB", "Firebase"],
    },
  ],
  experience: [
    {
      role: "Software Engineer (Full-Stack & Data)",
      company: "Patils Classes",
      period: "Apr 2026 — Present",
      detail:
        "Building an AI-assisted question bank, semantic retrieval with pgvector, OCR and local VLM ingestion, and production learning platforms across Flask, Firebase, Next.js, and Cloudflare.",
    },
    {
      role: "Software Engineer",
      company: "Delphi Analytics",
      period: "Apr 2025 — Dec 2025",
      detail:
        "Designed Python SDKs and high-throughput APIs, improved developer onboarding with OpenAPI specifications, and engineered PostgreSQL data models, backups, and recovery workflows.",
    },
    {
      role: "Software Engineering Intern",
      company: "Delphi Analytics",
      period: "Aug 2024 — Mar 2025",
      detail:
        "Migrated legacy business intelligence workflows to Apache Superset and built ETL pipelines and React dashboards with data and design teams.",
    },
  ],
  education: {
    degree: "B.Tech in Metallurgical and Materials Engineering",
    institution: "Visvesvaraya National Institute of Technology",
    year: "2024",
  },
} as const;
