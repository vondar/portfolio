export interface ProjectDetails {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  visualizerType: "tenant" | "probability" | "chrono" | "decay";
  sourcePath?: string;
  techStack: string[];
  metrics: {
    general: string;
    designer: string;
    developer: string;
  };
  shortDesc: {
    general: string;
    designer: string;
    developer: string;
  };
  features: string[];
  architecture: string[];
  installation: string[];
  assets?: {
    src: string;
    title: string;
    summary: string;
    explanation: string;
  }[];
  dashboard?: {
    label: string;
    localUrl: string;
    embedUrl: string;
    launchCommand: string;
    summary: string;
    explanation: string;
  };
  roleSpecs?: {
    designer?: string;
    developer?: string;
  };
}

export const projectsData: ProjectDetails[] = [
  {
    id: "gym-saas",
    title: "Gym SaaS Multi-Tenant Platform",
    subtitle: "TENANT SANDBOX",
    category: "Full Stack SaaS",
    visualizerType: "tenant",
    sourcePath: "D:\\personal\\gymsaas",
    techStack: ["Django 4.2", "PostgreSQL (JSONB)", "Celery", "Redis", "JWT Auth", "AWS S3", "UV Package Manager"],
    metrics: {
      general: "1000+ Active Users",
      designer: "High-Density Admin Panel",
      developer: "Zero cross-tenant leaks",
    },
    shortDesc: {
      general: "A comprehensive multi-tenant gym management system supporting multiple gyms within a single database with complete data isolation.",
      designer: "User-centered fitness console highlighting workout progress metrics, historical check-ins, and clear financial owner dashboards.",
      developer: "Django REST backend running custom tenant middleware that scopes all SQL transactions by JWT embedded gym_id claims.",
    },
    features: [
      "Multi-tenant architecture isolating client records via DB-level tenant filtering",
      "Robust attendance logging with automatic Celery-driven closure rules",
      "Flexible membership planning with support for exercise arrays stored in JSONB formats",
      "Business Intelligence graphs tracking retention rates, revenue vectors, and owner KPIs",
      "AWS S3 media integration for user profiles and physical transformations"
    ],
    architecture: [
      "TenantMiddleware: Extracts gym_id from JWT tokens on requests",
      "TenantModel: Abstract base class with default managers applying `filter(gym_id=...)` constraints",
      "Celery Beat Scheduler: Handles daily tasks (auto-checks, payment reminders, metadata audits)",
      "JWT Security Layer: Embedded scope validating cross-tenant boundary queries"
    ],
    installation: [
      "git clone <repository-url> && cd gymsaas",
      "uv sync  # Uses UV for 10-100x faster setup",
      "source .venv/bin/activate",
      "cp .env.example .env  # Configure Database & Celery settings",
      "python manage.py migrate",
      "python manage.py createsuperuser",
      "celery -A gymsaas worker -l info  # In a separate terminal",
      "python manage.py runserver"
    ],
    dashboard: {
      label: "Open Django App",
      localUrl: "http://localhost:8000",
      embedUrl: "http://localhost:8000",
      launchCommand: "cd D:\\personal\\gymsaas && python manage.py runserver 8000",
      summary: "Local Django development server for the multi-tenant gym management surface.",
      explanation:
        "This runs the real Gym SaaS application instead of a portfolio mock. Because it is an authenticated operational app, the embedded frame may show the login or be blocked by local security headers, so the external link is the reliable entry point.",
    },
  },
  {
    id: "f2p-monetization",
    title: "Mobile F2P Monetization Analyzer",
    subtitle: "PROBABILITY PIT // CDF PLOT",
    category: "Financial Engine & Analytics",
    visualizerType: "probability",
    sourcePath: "D:\\personal\\F2P-Games",
    techStack: ["Python 3.12", "NumPy", "Streamlit", "Pydantic", "JSON Schema", "Matplotlib"],
    metrics: {
      general: "Stochastic modeling",
      designer: "Forensic Economic Panel",
      developer: "Vectorized Monte Carlo core",
    },
    shortDesc: {
      general: "Models free-to-play monetization loops as a stochastic financial system, predicting player expenses under complex gacha guarantees.",
      designer: "Interactive simulator rendering CDF probability curves ('The Money Pit'), translating virtual costs into groceries and rent PPP equivalents.",
      developer: "NumPy-vectorized Monte Carlo engine executing multi-stage banners, step-up curves, and Chi-Squared goodness-of-fit checks.",
    },
    features: [
      "Asymmetric Variance Quantifier: Captures CTE95 (average cost of worst-case 5% luck)",
      "Incentive Gap (IG) & Top-Up Pressure Index: Evaluates forced excess currency spend",
      "The Sunk Cost Trap (LAI): Modeled warning thresholds for multi-stage shard assembly",
      "Chi-Squared Goodness-of-Fit: Compares actual community drop records against declared odds to expose silent nerfs",
      "Dynamic sensitivity sweeps mapping rates across standard and custom game pools"
    ],
    architecture: [
      "Monte Carlo Core: Simulates millions of gacha draws using vectorized operations",
      "Curves Module: Formulates pity, soft-pity, and lucky-draw step-up pricing behaviors",
      "Friction Calculator: Quantifies bonus currency mathematical obfuscations and leftover coins",
      "Forensic Reporter: PDF/A factsheet generation with regional economic equivalences"
    ],
    installation: [
      "pip install uv",
      "uv venv",
      "uv pip install -r requirements.txt",
      "# Run Streamlit Dashboard",
      "$env:PYTHONPATH = \".\"; uv run main.py dashboard",
      "# CLI risk assessment",
      "uv run main.py monetization --config data/loot_configs/standard_banner.json --plot --report"
    ],
    dashboard: {
      label: "Open Streamlit Lab",
      localUrl: "http://localhost:8502",
      embedUrl: "http://localhost:8502/?embed=true",
      launchCommand: "cd D:\\personal\\F2P-Games; $env:PYTHONPATH='.'; uv run streamlit run src/app.py --server.port 8502",
      summary: "Live Streamlit risk lab for loot-box variance, tail cost, and community odds validation.",
      explanation:
        "The embedded app keeps the probability work interactive: upload observed pull data, inspect risk curves, and compare declared odds against modeled outcomes without flattening the analysis into screenshots.",
    },
  },
  {
    id: "cric-audit",
    title: "CricAudit Event-Sourcing Ledger",
    subtitle: "DECAY HALF-LIFE VECTOR",
    category: "Event Sourcing / Reconciliation",
    visualizerType: "decay",
    sourcePath: "D:\\personal\\cricaudit",
    techStack: ["Python 3.12", "SQLite", "Pydantic", "Streamlit", "Plotly", "Cricsheet Data"],
    metrics: {
      general: "Ledger-grade precision",
      designer: "Strangle-O-Meter Dashboard",
      developer: "Zero floating-point float",
    },
    shortDesc: {
      general: "Replays ball-by-ball Test cricket delivery logs using event-sourcing principles to audit official metadata and scorecards.",
      designer: "Streamlit visual analytics detailing the Strangle-O-Meter, squad vs match XI selection drift, and batsman collapse points.",
      developer: "Replays deliveries in the integer domain to prevent floating-point drift, checking Batting and Bowling reconciliation invariants."
    },
    features: [
      "Replays delivery-level logs to cross-verify structural innings reports",
      "Zero-Float Overs Math: Economy and ball tracking done entirely in integer operations",
      "Value Above Average (WBI): Pitch-normalized batting effectiveness indicators",
      "Wicket Value Index (WVI): Positional-weighted bowler impact scores",
      "Selection Forensics: Audit comparing squad averages against the fielded XI's real impact"
    ],
    architecture: [
      "Cricsheet Reconstructor: The core playback state machine enforcing ledger balance",
      "Player Store: Database mapping player aliases to standard central identity keys",
      "Pydantic schemas: Validating structure of source event stream imports",
      "Invariants Validation: Proving `Sum(Batting_Runs) + Extras == Inning_Total`"
    ],
    installation: [
      "uv sync",
      "uv run python 01_index_matches.py  # Create SQLite index of metadata",
      "uv run streamlit run app.py"
    ],
    dashboard: {
      label: "Open Live App",
      localUrl: "http://localhost:8501",
      embedUrl: "http://localhost:8501/?embed=true",
      launchCommand: "cd D:\\personal\\cricaudit && uv run streamlit run app.py --server.port 8501",
      summary: "Live Streamlit dashboard for the reconstructed WTC 2023-2025 audit ledger.",
      explanation:
        "The portfolio can embed the real CricAudit dashboard when the Streamlit process is running locally. This keeps the project interactive: filtering, Plotly hover states, leaderboard sorting, and match-level forensic views remain available instead of being flattened into static screenshots.",
    },
    assets: [
      {
        src: "/assets_per_project/cricaudit/stats.png",
        title: "Forensic WTC Review Header",
        summary: "Executive integrity panel for the WTC 2023-2025 audit corpus.",
        explanation:
          "This screen establishes the scope and trust boundary of the ledger: 94 unique matches audited, a fixed 2023-2025 cycle, MA Starc as the leading match-winner signal, and an average match-winner score of 228.4. It works as the audit cockpit before drilling into player or innings-level evidence.",
      },
      {
        src: "/assets_per_project/cricaudit/leaderboard.png",
        title: "Official Match-Winner Leaderboard",
        summary: "Ranked player influence table for winning causes.",
        explanation:
          "The leaderboard translates reconstructed match events into a cumulative match-winner score. It shows MA Starc, YBK Jaiswal, JE Root, TM Head, and PJ Cummins near the top, making the model's output inspectable as a simple ranked artifact rather than a hidden score. The match count column is important because it separates sustained influence from one-match spikes.",
      },
      {
        src: "/assets_per_project/cricaudit/battingTrends.png",
        title: "Value Above Average Batting Trends",
        summary: "Player batting performance normalized against match context.",
        explanation:
          "This trend view compares selected batters by Value Above Average, formerly WBI. Positive values mean the batter outperformed the match scoring environment, not merely that they made runs. That distinction matters in difficult conditions: a smaller innings can rank as more valuable if the rest of the match was low-scoring.",
      },
      {
        src: "/assets_per_project/cricaudit/bowlingImpact.png",
        title: "Strangle-O-Meter Bowling Impact",
        summary: "Bowling pressure plotted against wicket-value impact.",
        explanation:
          "The Strangle-O-Meter maps pressure on the X-axis through dot-ball percentage and impact on the Y-axis through wicket value. The upper-right zone identifies bowlers who both constrained scoring and took meaningful wickets. MA Starc's highlighted point demonstrates the model's ideal bowling profile: high pressure, high impact, and a large wicket haul.",
      },
      {
        src: "/assets_per_project/cricaudit/collapseRegistry.png",
        title: "Structural Failure Collapse Registry",
        summary: "Table of rapid wicket-loss events and innings failure signatures.",
        explanation:
          "The collapse registry detects innings where five or more wickets fell rapidly, then records the collapse progression and runs conceded during that failure window. The highlighted Bengaluru 46 case is treated as a black-swan structural failure, showing how the audit moves beyond score totals into sequence-level fragility.",
      },
    ]
  },
  {
    id: "billboard-etl",
    title: "Billboard Ingestion & YT Sync",
    subtitle: "CHRONO-SYNC TIMELINE",
    category: "Data Engineering Pipeline",
    visualizerType: "chrono",
    sourcePath: "D:\\personal\\nostalgia",
    techStack: ["Python 3.11", "SQLite (WAL Mode)", "Polars", "BeautifulSoup 4", "ytmusicapi", "Streamlit"],
    metrics: {
      general: "26,000 temporal rows",
      designer: "Longevity Scatter Plots",
      developer: "WAL-persisted pipeline",
    },
    shortDesc: {
      general: "A deterministic, resumable ETL pipeline scraping 5 years of Billboard Hot 100 history and matching songs on YouTube Music.",
      designer: "Visualizing market share analysis, pop era shifts, and song longevity through interactive scatter plots.",
      developer: "Resumable SQLite pipeline featuring BeautifulSoup DOM scraping, Polars aggregations, and confidence-scored YouTube search syncing.",
    },
    features: [
      "Deterministic SHA256 song identifier keys preventing entropy leakage",
      "Scraping log tracking document hash changes to detect DOM selector drift",
      "Confidence Matching Model: Employs keyword penalties and duration-delta calculations",
      "Google API Rate Gates: Controls operations to 500 tracks per hour to avoid account flags",
      "ACID-compliant SQLite with Write-Ahead Logging (WAL) for persistent state tracking"
    ],
    architecture: [
      "01_scrape: DOM parsing with safety threshold check (< 100 entries triggers abort)",
      "02_normalize: Separates featured artist tags, normalizes strings, hashes ids",
      "04_yt_verify: Queries YouTube Music, parses duration strings, calculates confidence scores",
      "05_yt_sync: OAuth connection managing session playlist writes"
    ],
    installation: [
      "git clone https://github.com/username/nostalgia.git && cd nostalgia",
      "pip install -r requirements.txt",
      "uv run ytmusicapi oauth  # Follow URL prompts to authorize playlist management",
      "python 01_scrape.py",
      "python 02_normalize.py",
      "python 03_aggregate.py",
      "python 04_yt_verify.py",
      "python 05_yt_sync.py --live --min-confidence 0.90"
    ],
    dashboard: {
      label: "Open Streamlit Dashboard",
      localUrl: "http://localhost:8503",
      embedUrl: "http://localhost:8503/?embed=true",
      launchCommand: "cd D:\\personal\\nostalgia && streamlit run dashboard.py --server.port 8503",
      summary: "Live Streamlit dashboard for Billboard chart restoration and YouTube Music matching analysis.",
      explanation:
        "This surface exposes the actual ETL outputs: chart-entry volume, market-share exploration, longevity views, and confidence-driven music matching diagnostics from the local Nostalgia project.",
    },
  },
  {
    id: "attention-decay",
    title: "Cultural Attention Decay Engine",
    subtitle: "DECAY HALF-LIFE VECTOR",
    category: "Data Science & Mathematics",
    visualizerType: "decay",
    sourcePath: "D:\\personal\\attention-deficit",
    techStack: ["Python 3", "SciPy", "LaTeX", "Matplotlib", "Netflix Datasets"],
    metrics: {
      general: "Netflix Top 10 data",
      designer: "Diffusion lag maps",
      developer: "Exponential fit (R² > 0.7)",
    },
    shortDesc: {
      general: "Analyzes and models content attention lifecycles from global charts using continuous decay equations.",
      designer: "Maps titles into a four-quadrant matrix (Supernova, Slow Burn, Cultural Anchor, Ghost) based on velocity and retention metrics.",
      developer: "Transforms discrete rank records into continuous scores, fitting them to exponential decay models with plateau thresholds.",
    },
    features: [
      "Linear attention score mapping to eliminate bounds issues at rank endpoints",
      "Peak Growth Velocity: Quantitative assessment of ascent speeds",
      "Non-linear Persistence Index: Sum of inverse ranks weighting peak slots 10x higher",
      "Exponential half-life fitting using SciPy curve algorithms",
      "Diffusion Lag Indicator: Quantifies transmission rates compared to global norms"
    ],
    architecture: [
      "Continuous score formula mapping discrete values to [0, 10] range",
      "Exponential decay core ($S(t) = S_{peak} \\cdot e^{-\\lambda t}$)",
      "Plateau check fallback: Reclassifies titles when $|dS/dt| < \\epsilon$ persists",
      "Z-score normalizer: Standardizes metrics across global regions"
    ],
    installation: [
      "# Mathematical formulation only - see codebase for scipy fit tools",
      "python fitting_engine.py --dataset netflix_global_weekly.csv"
    ]
  }
];
