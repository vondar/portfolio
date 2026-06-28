# Himanshu Mahajan

Developer building full-stack systems, data tools, and interactive product surfaces.

I like projects where the interface is only the visible edge of the work: tenant isolation, event replay, probability modeling, data pipelines, accessibility states, and the small engineering decisions that make software feel reliable. This repository is my portfolio, but the point is not the portfolio shell. It is a map of the way I think, build, test, and explain systems.

Live portfolio: [https://vondar.github.io/portfolio/](https://vondar.github.io/portfolio/)

GitHub: [@vondar](https://github.com/vondar)

## What I Build

- Full-stack applications with clear data boundaries, authentication flows, and operational dashboards.
- Data engineering pipelines that turn messy public datasets into queryable, inspectable systems.
- Analytical tools for probability, finance, sports, and cultural trend modeling.
- Interfaces that make complex systems easier to read without hiding the underlying logic.
- Accessibility-aware frontends with theme, motion, contrast, and cognitive-focus controls.

## Featured Work

### Gym SaaS Multi-Tenant Platform

A Django and PostgreSQL platform for managing multiple gyms in one system while keeping tenant data isolated. The work focuses on scoped data access, attendance workflows, membership plans, background jobs, and owner-facing business intelligence.

Core ideas: multi-tenant architecture, JWT-scoped access, Celery jobs, Redis, PostgreSQL JSONB, AWS S3 media handling.

### CricAudit Event-Sourcing Ledger

A cricket analytics project that reconstructs match state from ball-by-ball delivery logs. It treats sports data like an audit ledger: replay events, validate invariants, and expose the evidence through Streamlit dashboards and static visual summaries.

Core ideas: event sourcing, score reconciliation, SQLite, Pydantic schemas, Plotly, Cricsheet data.

### Mobile F2P Monetization Analyzer

A stochastic modeling tool for free-to-play game economies. It simulates gacha systems, pity mechanics, tail-risk spending, and fairness checks against observed pull data.

Core ideas: Monte Carlo simulation, NumPy vectorization, risk curves, Streamlit, Pydantic, JSON Schema.

### Billboard Ingestion and YouTube Music Sync

A resumable ETL pipeline that scrapes Billboard Hot 100 history, normalizes track data, scores YouTube Music matches, and supports playlist sync workflows.

Core ideas: scraping, SQLite WAL mode, Polars, BeautifulSoup, confidence scoring, API rate control.

### Cultural Attention Decay Engine

A data-science project modeling how media attention rises, persists, and decays across global streaming charts.

Core ideas: rank-to-score transforms, exponential decay fitting, persistence metrics, quadrant classification, Matplotlib.

## Technical Range

Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Zustand.

Backend: Django, REST APIs, PostgreSQL, SQLite, Celery, Redis, JWT auth.

Data and analytics: Python, NumPy, Polars, Pydantic, Streamlit, Plotly, Matplotlib.

Engineering habits: static builds, typed interfaces, reproducible pipelines, data validation, focused documentation, and UI states that respect accessibility needs.

## How I Think About Software

I care about systems that can be inspected. If a dashboard shows a number, the path to that number should be traceable. If a platform serves multiple customers, the data boundary should be explicit. If a model makes a claim, the assumptions should be visible. If an interface is visually ambitious, it still has to be usable when motion is reduced, contrast is raised, or the user just wants the answer quickly.

That is the through-line across these projects: build the thing, expose the logic, and make the result understandable.

## Running This Portfolio Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

To verify the production static export:

```bash
npm run build
```

## Repository Notes

The original project architecture README has been preserved in [PORTFOLIO_PROJECT_README.md](PORTFOLIO_PROJECT_README.md).

This portfolio is deployed to GitHub Pages through the workflow in [.github/workflows/pages.yml](.github/workflows/pages.yml).
