# Signals & Systems — Data Story Portfolio

A self-contained, three-service portfolio for four data projects:

- CricAudit — forensic Test cricket reconstruction
- F2P Games — monetization and consumer-risk analysis
- Attention Deficit — Netflix attention lifecycle modeling
- Nostalgia — Billboard/YouTube archive verification

The Next.js frontend presents the work, Django serves the project catalog and summary API, and Streamlit powers the embedded interactive dashboards. All datasets are versioned inside `data/`, so this repository runs without the original source projects. See [`data/README.md`](data/README.md) for provenance and scope.

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

GitHub Pages only serves static files; it cannot run Django or Streamlit. The portfolio and its lightweight proof artifacts work without those services. To enable the live API link and dashboard iframes, host the Python services separately and add these GitHub repository variables under **Settings → Secrets and variables → Actions → Variables**:

| Variable | Example | Required |
| --- | --- | --- |
| `STREAMLIT_PUBLIC_URL` | `https://your-dashboard.streamlit.app` | Only for live dashboard iframes |
| `DJANGO_PUBLIC_URL` | `https://api.example.com/api/projects/` | Only for the header API link |
| `DJANGO_API_URL` | `https://api.example.com/api` | Optional build-time project metadata |

The hosted services must allow HTTPS browser access. Streamlit must also permit embedding from the GitHub Pages origin.

## Run locally

Open three terminals from the repository root:

```powershell
# Terminal 1 — Django API
uv run python backend/manage.py runserver 8000

# Terminal 2 — Streamlit dashboards
uv run streamlit run app.py --server.port 8501

# Terminal 3 — Next.js frontend
cd frontend
npm run dev
```

Then open `http://localhost:3000`. Each project route embeds its Streamlit dashboard from port 8501. Copy `frontend/.env.example` to `frontend/.env.local` when service URLs differ.

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

The dashboard should then be available at `http://localhost:8501`. Keep that process running while using the Next.js frontend because the project pages load it inside their iframes.

## Services

| Service | Default URL | Responsibility |
| --- | --- | --- |
| Next.js | `http://localhost:3000` | Portfolio UI and project routes |
| Django | `http://localhost:8000/api/` | Project catalog, metrics, and health API |
| Streamlit | `http://localhost:8501` | Interactive Plotly dashboards |

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
│   ├── lib/
│   └── package.json
├── app.py
├── pyproject.toml
├── uv.lock
└── styles.css
```
