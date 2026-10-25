# Signals & Systems — Data Story Portfolio

A self-contained portfolio for four data projects:

- CricAudit — forensic Test cricket reconstruction
- F2P Games — monetization and consumer-risk analysis
- Attention Deficit — Netflix attention lifecycle modeling
- Nostalgia — Billboard/YouTube archive verification

The Next.js frontend presents the work and renders all four interactive dashboards directly in the browser. A deterministic preparation script converts the source datasets into compact static JSON before deployment. Django remains available as an optional project catalog API, and Streamlit remains as the Python reference dashboard. All datasets are versioned inside `data/`, so this repository runs without the original source projects. See [`data/README.md`](data/README.md) for provenance and scope.

## Install

```powershell
git clone <repository-url>
cd portfolio
uv sync
cd frontend
npm install
```

Install [`uv`](https://docs.astral.sh/uv/getting-started/installation/) first if needed. The project requires Python 3.12+ and Node.js 20.9+.

## Frontend with npm

Run all frontend commands from the `frontend/` directory:

```powershell
cd frontend

# Install the locked Next.js dependencies
npm install

# Regenerate browser-ready dashboard data from the bundled sources
npm run data:build

# Create a local environment file when service URLs need changing
Copy-Item .env.example .env.local

# Start the frontend development server at http://localhost:3000
npm run dev
```

For a production build:

```powershell
cd frontend
npm run typecheck
npm run build
npm run start
```

Available npm scripts:

| Command | Purpose |
| --- | --- |
| `npm run data:build` | Regenerate compact dashboard JSON from `data/` |
| `npm run dev` | Start the Next.js development server |
| `npm run typecheck` | Validate TypeScript without generating files |
| `npm run build` | Create an optimized production build |
| `npm run start` | Serve the completed production build |

## Deploy the frontend to GitHub Pages

The repository includes [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml). Every push to `main` builds a static Next.js export and publishes `frontend/out` to:

```text
https://vondar.github.io/portfolio/
```

One-time GitHub setup:

1. Push this repository to `https://github.com/vondar/portfolio`.
2. Open **Settings → Pages** in GitHub.
3. Under **Build and deployment**, select **GitHub Actions** as the source.
4. Push to `main`, or run **Deploy frontend to GitHub Pages** manually from the Actions tab.

The workflow regenerates all four browser datasets and exports the site as static files. GitHub Pages therefore serves the complete interactive portfolio without Django, Streamlit, repository variables, or iframes.

## Run locally

The complete portfolio, including all four dashboards, needs only the frontend:

```powershell
cd frontend
npm run data:build
npm run dev
```

Then open `http://localhost:3000`. Filters, charts, tables, searches, and external music links run entirely in the browser.

The Python services are optional during frontend development:

```powershell
# Optional Django catalog API
uv run python backend/manage.py runserver 8000

# Optional Streamlit reference implementation
uv run streamlit run app.py --server.port 8501
```

## Troubleshooting

### `uv run app.py` prints `missing ScriptRunContext`

Do not launch the dashboard as a plain Python script:

```powershell
# Incorrect — no Streamlit server or session is created
uv run app.py
```

Launch it through the Streamlit CLI instead:

```powershell
uv run streamlit run app.py --server.port 8501
```

The reference dashboard should then be available at `http://localhost:8501`. The Next.js dashboards do not depend on this process.

## Services

| Service | Default URL | Responsibility |
| --- | --- | --- |
| Next.js | `http://localhost:3000` | Portfolio UI and browser-native dashboards |
| Django | `http://localhost:8000/api/` | Optional project catalog, metrics, and health API |
| Streamlit | `http://localhost:8501` | Optional Python reference dashboards |

Django endpoints:

- `GET /api/health/`
- `GET /api/projects/`
- `GET /api/projects/<slug>/`

## Repository layout

```text
portfolio/
├── .streamlit/config.toml
├── backend/
│   ├── api/
│   ├── config/
│   └── manage.py
├── data/
│   ├── attention/
│   ├── cricaudit/
│   ├── f2p/
│   └── nostalgia/
├── frontend/
│   ├── app/
│   ├── components/dashboards/
│   ├── lib/
│   ├── public/dashboard-data/
│   └── package.json
├── scripts/prepare_dashboard_data.py
├── app.py
├── pyproject.toml
├── uv.lock
└── styles.css
```
