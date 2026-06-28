# Gym SaaS Platform

A comprehensive multi-tenant gym management system built for ~1000 users, supporting multiple gyms within a single database using **Django + PostgreSQL**.

## Features

### Core Business Management
- **Multi-tenant Architecture**: Shared tables with tenant isolation via `gym_id`
- **Member Management**: Complete member profiles with transformation tracking
- **Attendance System**: Check-in/check-out for members and staff with Celery auto-close
- **Payment Processing**: Subscription management and payment tracking
- **Staff Management**: Role-based access control (RBAC) with Django auth
- **Trainer Sessions**: Personal training scheduling and tracking

### Member Experience
- **Progress Tracking**: Body measurements, weight, and transformation photos
- **Workout Plans**: 30-day programs with JSON exercise storage
- **Membership Plans**: Flexible pricing and duration options
- **Feedback System**: Member ratings and comments

### Business Intelligence
- **Owner KPIs**: Retention rates, pending payments, revenue tracking
- **Attendance Analytics**: Member visit patterns and engagement
- **Financial Reports**: Expense tracking and profit analysis
- **Holiday Management**: Gym closure announcements and scheduling

## Tech Stack

- **Backend**: Django 4.2 + Django REST Framework
- **Database**: PostgreSQL with JSONB support
- **Caching**: Redis for session and query caching
- **Background Tasks**: Celery with Redis broker
- **Authentication**: JWT tokens with gym_id embedding
- **File Storage**: AWS S3 for photos and media
- **Mobile**: Django REST API supports mobile apps

## Quick Start

### Prerequisites
- Python 3.9+
- PostgreSQL 12+
- Redis 6+

### Installation

Choose your preferred package manager:

**Option 1: Using UV (Recommended - 10-100x faster)**
```bash
# Install uv if not already installed
curl -LsSf https://astral.sh/uv/install.sh | sh

# Clone repository
git clone <repository-url>
cd gymsaas

# Sync dependencies and create venv
uv sync

# Activate virtual environment
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

**Option 2: Using Pip**
```bash
# Clone repository
git clone <repository-url>
cd gymsaas

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -e ".[dev]"
```

**Complete Setup (Both Methods)**
```bash
# Configure environment
cp .env.example .env
# Edit .env with your settings

# Database setup
python manage.py makemigrations
python manage.py migrate

# Create superuser
python manage.py createsuperuser

# Run development server
python manage.py runserver
```

See [UV.md](UV.md) for detailed UV documentation.

### Running Development Environment

Start the services in separate terminals:

```bash
# Terminal 1: Celery worker
celery -A gymsaas worker -l info

# Terminal 2: Celery beat scheduler
celery -A gymsaas beat -l info

# Terminal 3: Django development server
python manage.py runserver
```

## Project Structure

```
gymsaas/
├── README.md           # This file
├── CHANGELOG.md        # Version history and changes
├── PROGRESS.md         # Development progress and tasks
├── gymsaas-3.md      # Technical specification
├── requirements.txt     # Python dependencies
├── manage.py          # Django management script
├── gymsaas/          # Django project configuration
│   ├── settings.py     # Main settings file
│   ├── urls.py         # URL routing
│   ├── middleware.py   # Tenant filtering middleware
│   └── celery.py      # Background task configuration
├── accounts/          # User authentication and profiles
├── gyms/             # Gym/tenant management
├── members/           # Member management
├── trainers/          # Trainer management
├── attendance/        # Check-in/check-out system
├── payments/          # Payment processing
├── subscriptions/     # Membership subscriptions
├── progress/          # Progress tracking
└── notifications/     # System notifications
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/login` - User authentication with JWT
- `POST /api/v1/auth/refresh` - Token refresh
- `POST /api/v1/auth/logout` - Token revocation

### Members
- `GET /api/v1/members/` - List members (tenant-scoped)
- `POST /api/v1/members/` - Create new member
- `GET /api/v1/members/search/` - Search members
- `GET /api/v1/members/{id}/` - Get member details
- `PUT /api/v1/members/{id}/` - Update member
- `DELETE /api/v1/members/{id}/` - Delete member
- `GET /api/v1/members/{id}/progress/` - Get member progress
- `GET /api/v1/members/{id}/attendance/` - Get member attendance history

### Attendance
- `POST /api/v1/attendance/checkin/` - Check in member/staff (schedules auto-close)
- `POST /api/v1/attendance/checkout/` - Check out member/staff (cancels auto-close)
- `GET /api/v1/attendance/today/` - Today's attendance
- `GET /api/v1/attendance/history/` - Attendance history with filters
- `GET /api/v1/attendance/stats/` - Attendance statistics

### Payments
- `GET /api/v1/payments` - List payments (tenant-scoped)
- `POST /api/v1/payments` - Process payment
- `GET /api/v1/payments/report` - Payment analytics

### Subscriptions
- `GET /api/v1/subscriptions` - List subscriptions
- `POST /api/v1/subscriptions` - Create subscription
- `GET /api/v1/subscriptions/expiring` - Expiring subscriptions

## Multi-Tenancy

All queries are automatically scoped by `gym_id` through:
- **TenantMiddleware**: Extracts gym_id from JWT token
- **TenantModel**: Base class with automatic filtering
- **TenantManager**: Custom manager for query isolation

This prevents data leakage between gyms and ensures true multi-tenant isolation.

## Development

### Running Tests

#### Quick Start
```bash
# Install test dependencies (included in dev extras)
pip install -e ".[dev]"

# Run all tests
python manage.py test

# Or use the test runner script
python run_tests.py
```

#### Test Categories
```bash
# Run specific test types
python run_tests.py --type security      # Tenant isolation tests
python run_tests.py --type celery        # Background task tests
python run_tests.py --type integration   # End-to-end tests
python run_tests.py --type unit          # Individual unit tests

# Run with coverage
python run_tests.py --coverage

# Verbose output
python run_tests.py --verbose

# Keep test database (faster for repeated runs)
python run_tests.py --keepdb
```

#### Individual Test Files
```bash
# Tenant isolation tests
python manage.py test tests.test_tenant_isolation

# Celery task tests
python manage.py test tests.test_celery_tasks

# Integration tests
python manage.py test tests.test_integration
```

#### Coverage Reports
```bash
# Generate coverage report
coverage run --source='.' manage.py test
coverage report
coverage html  # Opens in htmlcov/index.html
```

#### Security Tests
The test suite includes critical security tests:
- **Tenant Isolation**: Proves Gym A cannot access Gym B data
- **Cross-tenant Validation**: Prevents foreign key attacks
- **Celery Idempotency**: Ensures reliable background tasks
- **Integration Flows**: Tests complete check-in to auto-close process

#### Test Configuration
- Tests use `pytest.ini` configuration
- Database: SQLite in-memory for speed
- Coverage: Reports in `htmlcov/` directory
- Fixtures: Shared test data in `tests/conftest.py`

### Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Django Admin
Access admin panel at `http://localhost:8000/admin/`
- Tenant-aware administration
- Built-in user management
- Bulk operations support

### API Documentation
Swagger UI available at `http://localhost:8000/api/docs/`
OpenAPI schema at `http://localhost:8000/api/schema/`

## Deployment

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection for Celery
- `SECRET_KEY` - Django secret key
- `JWT_SECRET` - JWT signing secret
- `AWS_S3_BUCKET` - S3 bucket for photos

### Production Setup
```bash
# Collect static files
python manage.py collectstatic

# Run with Gunicorn
gunicorn gymsaas.wsgi:application --bind 0.0.0.0:8000

# Run Celery workers
celery -A gymsaas worker -l info
celery -A gymsaas beat -l info
```

## Security

- **Tenant Isolation**: Automatic `gym_id` filtering prevents cross-gym data access
- **JWT Authentication**: Secure token-based auth with gym_id embedding
- **Serializer Validation**: Cross-tenant foreign key protection in API writes
- **Explicit Business Logic**: No signal soup - clear, debuggable code
- **Input Validation**: Django forms and DRF serializers with comprehensive validation
- **CORS Protection**: Configured for production domains
- **SQL Injection Prevention**: Django ORM protects against SQL injection
- **Admin Isolation**: Tenant-aware Django admin prevents data leakage

## Background Tasks

Celery handles:
- **Auto-close attendance**: Closes sessions after configured hours
- **Payment reminders**: Sends notifications for expiring subscriptions
- **Data cleanup**: Removes expired tokens and old data

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Update documentation (README.md, CHANGELOG.md, PROGRESS.md)
5. Submit a pull request

## License

[License information]

## Support

For support and questions, please contact [support information].

---

**Version**: 0.1.0  
**Framework**: Django 4.2 + PostgreSQL  
**Last Updated**: 2025-03-18

# Quantifying Monetization Volatility & Retention Pressure in Mobile F2P Games

## Overview
This project models mobile free-to-play (F2P) monetization as a stochastic financial architecture and behavioral retention framework. It provides a forensic toolset to quantify variance, tail concentration, and structural pressure in systems used by titles like *PUBG: Battlegrounds*, *BGMI*, and *Free Fire*.

**This is a measurement tool, not a moral platform.** We replace emotional rhetoric with distributional mathematics.

## Community & Transparency
Empower yourself with data. 

- **[COMMUNITY.md](file:///d:/opensource/F2P-Games/COMMUNITY.md):** Learn how to locate, extract, and utilize your own pull history for forensic validation.
- **[DATA_REQUIRED.md](file:///d:/opensource/F2P-Games/DATA_REQUIRED.md):** Formal specifications for Ground Truth and Observed Reality data.
- **[GLOSSARY.md](file:///d:/opensource/F2P-Games/GLOSSARY.md):** Non-technical definitions for risk metrics (CTE, WRR, SNT).

---

## System Architecture

```text
project/
├── .venv/                   # Local virtual environment managed by uv
├── data/
│   ├── loot_configs/        # JSON schemas & banner configurations
│   ├── retention_configs/   # Season length/XP requirements
│   ├── ingestion/           # Screenshot archives (for audit trails)
│   └── results/             # Simulation outputs & sensitivity plots
├── src/
│   ├── engine/
│   │   ├── monte_carlo.py   # Multi-stage & Step-Up simulation core
│   │   ├── curves.py        # Pity/Soft-pity & Step-Up curve functions
│   │   └── validator.py     # Module 0: Geometric Baseline & Chi-Squared
│   ├── metrics/
│   │   ├── risk_metrics.py  # CTE, WRR, Safety Net Tax
│   │   ├── retention.py     # SRI, OCA, Recovery Interest
│   │   ├── friction.py      # IG, Top-Up Pressure, LAI (Sunk Cost Trap)
│   │   └── utility_decay.py # Meta-Relevance & Subscription Equivalence
│   ├── analysis/
│   │   ├── sensitivity.py   # Delta-Risk & Pity-Start sweeps
│   │   └── incentives.py    # Logistic regression for RIC
│   ├── utils/
│   │   ├── config_loader.py # JSON Schema validation for configs
│   │   ├── reporter.py      # Forensic reporting engine
│   │   ├── fact_sheet.py    # Standardized PDF/A-ready export
│   │   ├── community_ingestor.py # Observed data ingestion
│   │   └── translator.py    # MBA-to-Noob translation layer
│   ├── app.py               # Streamlit Forensic Dashboard
│   ├── run_analysis.py      # CLI runner for monetization analysis
│   └── run_sensitivity.py   # CLI runner for visualization & sweeps
├── tests/                   # Verification of mathematical convergence
├── PROGRESS.md              # Detailed implementation status
├── CHANGELOG.md             # Version history
└── requirements.txt         # Project dependencies
```

---

## Getting Started

### Prerequisites
- Python 3.12+
- [astral-uv](https://github.com/astral-sh/uv) (for high-performance dependency management)

### Installation
1. Install `uv` (if not already installed):
   ```powershell
   pip install uv
   ```
2. Create virtual environment and install dependencies:
   ```powershell
   uv venv
   uv pip install -r requirements.txt
   ```

### Running Analysis
All tools should be run using `uv run` via the **Unified Runner** (`main.py`) to ensure the correct environment and error handling. Set `PYTHONPATH` to the project root.

**1. Forensic Dashboard (Recommended for Visibility)**
Launch the interactive Streamlit dashboard to visualize tail risk and labor-cost impact:
```powershell
$env:PYTHONPATH = "."; uv run main.py dashboard
```

**2. Unified Runner Entry Point**
The forensic toolset can also be controlled via `main.py` CLI:
```powershell
$env:PYTHONPATH = "."; uv run main.py --help
```

**3. Monetization Risk Analysis**
Analyze a banner's volatility and tail risk with CDF visualization and forensic reporting:
```powershell
uv run main.py monetization --config data/loot_configs/standard_banner.json --plot --report --factsheet
```

**4. State of the Tail (Big Three Comparative Audit)**
Generate a comprehensive comparative audit for PUBG, BGMI, and Free Fire:
```powershell
uv run main.py state-of-the-tail
```

**5. Friction & Obfuscation Analysis**
Quantify mental math load, including **Bonus Currency** and **Top-Up Pressure** penalties:
```powershell
uv run main.py friction --config data/loot_configs/friction_config.json
```

**5. Retention Incentive Curves (RIC)**
Model player retention response using logistic regression with standard error reporting:
```powershell
uv run main.py incentives --simulate
```

**6. Screenshot Audit Utility**
Generate a verifiable SHA256 audit trail for ingested evidence:
```powershell
uv run main.py audit
```

---

## Module Highlights

### Module 0: Integrity & Investigation
- **Geometric Baseline:** Validates that static probability simulations converge to $E[N] = 1/p$ within <0.5% deviation.
- **Step-Up Support:** Engine handles variable costs and probabilities per trial, modeling the "Step-Up Trap" where costs inflate as acquisition nears.
- **Secondary Logic (Genshin/Weapon):** Engine handles complex guarantees like the "50/50" flip and "Epitomized Path" logic (multi-failure guarantees).
- **Exhaustive Mode (CODM):** Specialized **Hypergeometric simulation** for Lucky Draws where items are removed from the pool, causing costs to escalate.
- **Community Data Validation:** Uses **Chi-Squared Goodness-of-Fit** to compare observed community pull data (scraped from Reddit/YouTube) against simulated expectations to detect **"Silent Nerfs."**

### Module 1: Tail Risk (CTE₉₅ & WRR)
Instead of "Average Cost," we focus on **Asymmetric Variance Exposure**:
- **CTE₉₅ (The Nightmare Scenario):** Average cost for the "unlucky" 5%.
- **WRR (The Unlucky Tax):** $CTE_{95} / \text{Median}$. Quantifies revenue reliance on extreme outliers.
- **Safety Net Tax (The Hidden Pity Cost):** Quantifies the premium players pay for the variance protection of pity systems.
- **Transparency Trap (Sensitivity Sweep):** Automated audit for systems with undisclosed or ultra-low rates to show how tail risk explodes without transparency.
- **Utility Decay:** Translates one-time purchases into a daily **Meta-Relevance Cost**, showing the "subscription equivalent" of items that power-creep over time.
- **Forensic Reporting:** Generates human-readable Markdown reports and **Standardized Fact Sheets** contextualizing costs using **Grocery Math**, **Months of Rent**, and **Big Mac Equivalents** across global regions.

### Module 3: Friction & Obfuscation
- **Incentive Gap (IG):** Measures forced surplus spending by comparing required costs to available currency packs.
- **Top-Up Pressure Index:** Quantifies the "residual utility" trap—the forced additional spend required to use up leftover currency balances.
- **The Sunk Cost Trap (LAI):** Quantifies the psychological sunk cost of **Multi-Stage Acquisition** (Shards/Tokens) with visceral warnings.
- **Bonus Obfuscation:** Quantifies the cognitive load added by "Bonus" currency math, making real-time financial assessment harder.

---

## Forensic Dashboard
The **Streamlit Forensic Dashboard** provides a high-visibility interface for:
- **Plain-English Verdicts**: Uses the MBA-to-Noob translation layer to immediately summarize predatory design or fair pricing at a glance.
- **Interactive CDF Analysis (The Money Pit):** Visualize "The Coin Flip", "The Guarantee", and the shaded variance trap.
- **Economic Pain Index & Life Clock:** Translate virtual costs into **Weeks of Groceries**, **Months of Rent**, and working days adjusted for **PPP**.
- **Seasonal Portfolio Sim:** Quantify the probability of being unlucky across multiple banners in a single season.
- **Transparency Grading:** Instant A-F grade with human-centric subtitles for every banner.
- **Transparency Trap Analysis:** Automated sensitivity sweep to expose the cost of undisclosed odds.
- **Multi-Stage & Step-Up Acquisition:** Support for shards/tokens and variable trial costs/probabilities.
- **Community Validation Engine:** Upload observed data to detect statistical discrepancies in published odds.
- **Forensic Documentation:** Generate and download **Standardized Fact Sheets** directly from the UI.
- **Psychological Pressure Simulation:** Toggle **Social Proof Bias** and **Sunk Cost Trap** sliders to see how behavioral hacks affect perceived value.
- **State of the Tail Comparative Audit:** Side-by-side comparison of major F2P titles.

---

## Contributing Configs
Help build the **Forensic Registry of Loot Box Risks**. We encourage contributions of banner configurations from different games and regions.

### How to Submit:
1.  Review the `data/loot_configs/loot_schema.json` for requirements.
2.  Create a new JSON file in `data/contributions/` following the schema.
3.  Include a screenshot of the published rates in `data/ingestion/` for verification.
4.  Submit a Pull Request with your new configuration.

---

## Implementation Standards
- **Vectorization:** Simulation core uses `NumPy` vectorized operations for high performance.
- **Reproducibility:** All runs use a fixed PRNG `seed`.
- **Validation:** JSON Schema validation ensures configuration integrity.

---

### Project Philosophy
Mobile monetization is not a mystery; it is a solved mathematical problem. This repository exists to make those solutions transparent. **Measure twice. Claim once.**

# Billboard Reconstruction & Ingestion Engine (2013–2017)

## Overview
A deterministic, resumable, and state-aware ETL pipeline. This system extracts 5 years of Billboard Hot 100 history (260 weeks, 26,000 entries), anchors identity via SHA256 hashing, and performs policy-driven injection into YouTube Music via a confidence-weighted matching algorithm.

**Status**: Completed (2013-2017 Dataset Fully Acquired & Verified)
**Total Unique Songs**: 2,136
**Dominant Artist**: Drake (73 unique songs)

---

## Tech Stack (The "Final Form")

| Layer | Tech | Purpose |
| :--- | :--- | :--- |
| **Storage** | SQLite + WAL Mode | ACID-compliant persistence with atomic transaction boundaries. |
| **Identity** | SHA256 | Deterministic `song_id` generation to prevent entropy leak. |
| **Logic** | Python 3.11 / Polars | Vectorized data aggregation and history modeling. |
| **Parsing** | BeautifulSoup 4 (Hierarchical) | DOM-drift resistant scraping with canary checks. |
| **Matching** | Weighted Heuristics | Confidence-scored sync logic (Duration + Keyword + Title + Variant Info). |
| **Visualization** | Streamlit + Plotly | Interactive dashboard with drill-down capabilities. |
| **API** | `ytmusicapi` | Unofficial YouTube Music API with session management. |

---

## Data Architecture (Hardened Schema)

### 1. `songs` (The Identity Registry)
- `song_id` (PK): `SHA256(norm_title + "|" + norm_artist)`
- `title`, `artist`: Display names (e.g. "Hotline Bling", "Drake").
- `norm_title`, `norm_artist`: Cleaned strings for search/hashing.
- `variant_info`: Extracted remix/feature data.
- `first_chart_date`, `last_chart_date`: Era context.
- `peak_rank`, `weeks_top_100`, `weeks_top_10`: Computed metrics.
- `yt_video_id`: Found via dry-run.
- `confidence_score`: 0.0 to 1.0 based on match quality.
- `sync_status`: `unsynced`, `dry_run_passed`, `synced`, `rejected`.
- **Constraint:** `UNIQUE(norm_title, norm_artist, variant_info)`

### 2. `chart_entries` (The Temporal Record)
- `song_id` (FK), `chart_date`, `rank`.
- `raw_title`, `raw_artist`: Original text for auditing/re-normalization.
- **Constraint:** `UNIQUE(song_id, chart_date)`

### 3. `scrape_log` (The Drift Detector)
- `chart_date` (PK), `html_hash`, `scraped_at`.
- Used to detect if the source site has changed its structure between runs.

---

## The Pipeline Execution

### Phase 1: Extraction & Fingerprinting (`01_scrape.py`)
- **Hierarchical Selectors**: Uses context-aware DOM parsing to survive layout shifts (e.g., 2014 vs 2015 layouts).
- **Canary Checks**: Fails fast if entry count < 100 to prevent data pollution.
- **Atomic Transactions**: Inserts `chart_entries` and updates `scrape_log` in one block.
- **Exponential Backoff**: Handles rate limits with random jitter.

### Phase 2: Normalization & Variant Extraction (`02_normalize.py`)
- **Registry Authority**: Can re-process the entire raw dataset to fix normalization bugs without re-scraping.
- **Variant Logic**: Extracts metadata like "Remix" or "Radio Edit" into `variant_info` to improve YouTube search accuracy.
- **Identity Drift Detection**: Alerts if a code change would alter existing `song_id` hashes.

### Phase 3: Analytical Aggregation (`03_aggregate.py`)
- **Polars Engine**: High-performance aggregation of 26,000+ rows.
- **Metrics**: Computes `peak_rank`, `weeks_on_chart`, and `weeks_top_10`.
- **Date Snapping**: Ensures all chart dates align to Saturdays for consistency.

### Phase 4: Metadata & Dry-Run (`04_yt_verify.py`)
- **Search Strategy**: Uses `norm_title`, `norm_artist`, and `variant_info` for targeted queries.
- **Confidence Scoring**:
    - **Duration Delta**: `(1 - abs(yt_dur - meta_dur) / meta_dur)` (ISO 8601 parsing).
    - **Keyword Penalty**: Deduct points for "live", "video", "remix" (if not in metadata).
    - **Variant Boost**: Bonus points if `variant_info` matches the video title.
    - **Uploader Bonus**: Extra points for "Official Artist Channel" or "Topic" channels.

### Phase 5: Policy-Driven Deployment (`05_yt_sync.py`)
- **Session Blocks**: Limits sync to **500 songs per session** with a **1-hour cooldown** to avoid Google account flags.
- **Batching**: Commits to YouTube in chunks of 50.
- **Command**:
  ```bash
  python 05_yt_sync.py --live --min-confidence 0.90 --session-limit 500
  ```

---

## Engineering Standards

1.  **Idempotency**: Every script is safe to run $N$ times.
2.  **Atomicity**: SQLite transactions ensure partial failures don't corrupt the DB.
3.  **No Entropy**: String matching is a fallback. Hashing is the primary key.
4.  **Observability**: `PROGRESS.md` tracks the state of the system.

---

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/nostalgia.git
    cd nostalgia
    ```

2.  **Install dependencies**:
    ```bash
    pip install -r requirements.txt
    ```

3.  **Configure YouTube Music Auth** (Required for Deployment):
    To sync playlists, you need to authenticate with YouTube Music.
    
    **Option A: OAuth (Highly Recommended)**
    This is the most stable method for long-running sync jobs.
    1. Run the setup wizard:
       ```bash
       uv run ytmusicapi oauth
       ```
    2. Follow the URL, authenticate with your Google account, and paste the code back into the terminal.
    3. This will generate `oauth.json`. The sync script will automatically prioritize this file.

    **Option B: Browser Headers (Legacy/Advanced)**
    *Note: prone to "OAuth detected" errors and session expiry.*
    1. Run `uv run ytmusicapi browser`
    2. Paste your request headers from Chrome/Firefox Developer Tools (Network tab -> `browse` request -> Copy as cURL/Fetch).
    3. Rename the output to `headers_auth.json`.

---

## Usage Guide

### 1. Ingest (Scrape)
Download the Billboard Hot 100 history.
```bash
python 01_scrape.py
```
*   **Resumable**: Safe to interrupt and restart.
*   **Output**: Populates `chart_entries` and `scrape_log`.

### 2. Refine (Normalize)
Clean and standardize artist names and titles.
```bash
python 02_normalize.py
```
*   **Logic**: extracting "feat." credits, normalizing case, and generating the canonical `song_id`.

### 3. Analyze (Aggregate)
Compute longevity metrics and peak ranks.
```bash
python 03_aggregate.py
```
*   **Output**: Updates `songs` table with `peak_rank`, `weeks_top_10`, etc.

### 4. Visualize (Dashboard)
Explore the dataset interactively.
```bash
streamlit run dashboard.py
```
*   **Features**: Market share analysis, song longevity scatter plots, and drill-down views.

### 5. Verify (Match)
Find the best YouTube video match for each song.
```bash
python 04_yt_verify.py
```
*   **Process**: Performs searches, checks durations, and assigns a `confidence_score` (0.0 - 1.0).
*   **Limit**: Defaults to 10 songs for testing. Use `--limit 3000` to process the full dataset.

### 6. Deploy (Sync)
Create the playlist on your YouTube Music account.
```bash
# Dry run (safe to run, just prints actions)
python 05_yt_sync.py --min-confidence 0.90

# Live sync (actually creates/updates playlist)
python 05_yt_sync.py --live --min-confidence 0.90
```
*   **Safety**: Enforces a session limit (default 500 songs) to prevent rate-limiting.

---

## Why This Matters
You aren't just making a playlist. You are creating a queryable database of a five-year pop-era. By anchoring everything to a `song_id`, you can eventually join this data against anything—Spotify play counts, lyrics sentiment, or BPM data—without ever having to fix a "feat." typo again.

**Build it for the 2028 version of yourself who will want to re-run this and expect it to still work.**


# CricAudit: High-Precision Cricket Event-Sourcing & Reconciliation Engine

## Description

**CricAudit** is a high-integrity data engineering tool designed to reconstruct and reconcile Test cricket match data from atomic event logs. Moving beyond traditional scraping, CricAudit adopts an **Event Sourcing** architecture: it "plays back" ball-by-ball delivery streams from Cricsheet to derive match summaries with accounting-grade precision.

The project treats every match as a financial ledger that must balance. If a reconstructed total deviates from the source metadata, the metadata is flagged as a lie. CricAudit is built for analysts who require a **System of Record** that is more rigorous than the official scoring systems.

## Features

*   **Event-Sourcing Architecture:** Replays the atomic `deliveries` stream (supporting Cricsheet 1.1.0 nested `overs`) to reconstruct innings totals, batting scores, and bowling figures.
*   **Zero-Float Guarantee:** All ball-counting, overs math, and economy rates are calculated in the integer domain (e.g., `(runs * 6) / balls`) to eliminate floating-point drift.
*   **Local Match Discovery:** Uses a private SQLite index of Cricsheet metadata for high-speed, zero-latency match searching by team, date, or venue.
*   **Identity Guardrail:** Decouples bowler identity from innings context, ensuring players are mapped to their correct teams regardless of who is batting.
*   **Advanced Performance Metrics:**
    *   **Match-Winner Points (WCS):** Impact score awarded specifically in winning causes.
    *   **Value Above Average (WBI):** Runs relative to pitch-normalized match means.
    *   **WVI (Wicket Value Index):** Wickets weighted by batting position (Top 4 = 1.5x).
    *   **Suffocation Index:** Combined Dot Ball % and WVI to identify pressure-based dominance.
    *   **Selection Forensics:** Compares Squad Average WBI vs Playing XI WBI to identify selection drift.
*   **The Narrative Dashboard (Streamlit):** A high-fidelity visual engine featuring the **Strangle-O-Meter**, **Structural Failure** registry, and **Match-Winner Leaderboards**.
*   **Edge-Case Hardening:** Specialized logic for **Declarations**, **Penalty Deliveries** (e.g., helmet hits), **Absent Hurt**, and **Concussion Subs**.

## Tech Stack

*   **Language:** Python 3.12+
*   **Package Manager:** uv
*   **Data Models:** Pydantic (strict schema validation)
*   **Storage:** SQLite (Match Index & Player Store)
*   **Visualization:** Streamlit & Plotly
*   **Data Source:** Cricsheet (JSON Event Logs)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/cricaudit.git
    cd cricaudit
    ```

2.  **Install `uv`:**
    Follow instructions at [docs.astral.sh/uv](https://docs.astral.sh/uv/)

3.  **Install dependencies:**
    ```bash
    uv sync
    ```

## Usage

### 1. Indexing & Discovery
Before searching, build your local match index from Cricsheet metadata:
```bash
uv run python 01_index_matches.py
```

### 2. The Narrative Dashboard (Recommended)
Launch the interactive Streamlit app to visualize the WTC 2023-2025 cycle:
```bash
uv run streamlit run app.py
```

### 3. The Unified Auditor (CLI)
Audit a single match or an entire directory using the flag-driven CLI:

```bash
# Basic summary audit
uv run python auditor.py --file data/raw/1439896.json --report summary

# Performance Impact report (WBI/WVI)
uv run python auditor.py --file data/raw/1439896.json --report impact

# Pressure & Suffocation Index
uv run python auditor.py --file data/raw/1439896.json --report pressure

# Structural Failure (Collapse) detection
uv run python auditor.py --file data/raw/1439896.json --report collapse
```

### 4. Bulk WTC Audit
Reconstruct and rank the entire WTC 2023-2025 cycle:
```bash
uv run python wtc_audit.py
```

### 5. Selection Forensics
Compare the impact of the selected XI against the available squad:
```bash
uv run python selection_audit.py --team India
```

## Reconciliation Invariants

CricAudit enforces the following strict truths during playback:

### The Batting Invariant
`Sum(Batting_Runs) + Team_Extras == Reconstructed_Total`

### The Bowling Invariant
`Sum(Bowling_Conceded) + Byes + LegByes + Penalties == Reconstructed_Total`
*Note: This ensures non-bowler runs are accounted for in the ledger.*

### The Legal Delivery Invariant
`len([d for d in deliveries if not (d.wides or d.noballs or d.penalty)]) == Reconstructed_Overs_in_Balls`

## Project Structure

```text
├── core/
│   ├── cricsheet_reconstructor.py # Match playback engine (The Truth)
│   ├── player_store.py            # Cricsheet-to-Cricinfo registry bridge
│   ├── performance.py             # WVI/WBI/Suffocation Index models
│   └── models.py                  # Pydantic schemas for the System of Record
├── data/
│   ├── raw/                       # Atomic JSON event logs
│   ├── matches_index.sqlite       # High-speed local search index
│   └── wtc_audit_results.json     # Processed dashboard source
├── auditor.py                     # Unified CLI Entry point
├── app.py                         # Streamlit Narrative Dashboard
├── wtc_audit.py                   # WTC Cycle Aggregator
├── selection_audit.py             # Squad vs XI analysis tool
└── README.md                      # The Manifesto
```

## License

MIT License. Built for the forensic auditor who doesn't trust the summary.

# The Attention Decay Engine: A Dynamical Systems Approach to Content Lifecycles

## 1. Abstract
This framework formalizes the trajectory of cultural attention using Netflix Top 10 data as a proxy. By transforming discrete ranks into continuous scores and fitting them to decay models, we categorize content into four distinct archetypes based on velocity, persistence, and regional diffusion.

## 2. The Attention Score ($S_t$)
To eliminate boundary issues at Rank 1 and Rank 10, we map the discrete rank $R_t$ to a linear score:
$$S_t = 11 - R_t, \quad \text{for } R_t \in [1, 10]$$
$$S_t = 0, \quad \text{for } R_t > 10 \text{ (The Absorbing State)}$$

## 3. Lifecycle Phases & Metrics

### A. Growth: Peak Velocity ($V_p$)
Measures the rate of ascent toward peak saturation.
$$V_p = 
\begin{cases} 
10 & \text{if } T_{peak} = 0 \\
\frac{S_{peak} - S_{initial}}{T_{peak}} & \text{if } T_{peak} > 0 
\end{cases}$$
*Note: $T_{peak}=0$ denotes a "Day-1 Dominator" with maximal instantaneous velocity.*

### B. Saturation: The Persistence Index ($I_p$)
A non-linear measure of dominance intensity using the sum of inverse ranks:
$$I_p = \sum_{t=1}^{n} \frac{1}{R_t}$$
*This ensures Rank 1 (1.0) is weighted 10x more heavily than Rank 10 (0.1).*

### C. Decay: Half-Life ($\tau$) and Plateau Detection
We fit the post-peak scores to an exponential decay: $S(t) = S_{peak} \cdot e^{-\lambda t}$.
1. **The Half-Life**: $\tau = \ln(2) / \lambda$.
2. **Model Integrity**: If $R^2 < 0.7$, we check for a **Saturation Plateau**.
3. **Plateau Detection**: If $|dS/dt| < \epsilon$ for $> 14$ days, the title is reclassified from "Decaying" to "Stationary Anchor."

## 4. Cross-Regional Normalization
To compare regions with varying competitiveness, we Z-score the Persistence ($I_p$) and Velocity ($V_p$) metrics within each regional dataset:
$$Z(M) = \frac{M - \mu_{region}}{\sigma_{region}}$$
This allows for a mathematically fair comparison of a "Hit" in the US versus a "Hit" in India.

## 5. Diffusion Lag ($\Delta L$)
Measures cultural transmission speed relative to the Global baseline:
$$\Delta L_{region} = T_{peak}^{region} - T_{peak}^{global}$$
*   **$\Delta L > 0$**: Regional Adoption Delay.
*   **$\Delta L < 0$**: Regional Origin (The "Export" effect).

## 6. The Deterministic Quadrant
Classification is driven by $P_{75}$ and $P_{25}$ thresholds of the Z-scored metrics.

| Archetype | Velocity ($V_p$) | Persistence ($I_p$) | Dynamic Profile |
| :--- | :--- | :--- | :--- |
| **Supernova** | $> P_{75}$ | $< P_{75}$ | High-energy, low-retention. |
| **Slow Burn** | $< P_{25}$ | $> P_{75}$ | Organic growth, high-retention. |
| **Cultural Anchor**| $> P_{75}$ | $> P_{75}$ | High-energy, high-retention. |
| **Ghost** | $< P_{25}$ | $< P_{25}$ | Low-energy, low-retention. |

## 7. Operational Constraints & Disclaimers
*   **Temporal Smoothing**: Data is sourced from weekly Netflix TSVs. This aggregation may smooth intra-week volatility or short-lived viral spikes.
*   **Rank as Proxy**: We assume Rank is a proxy for Attention Volume. The model does not account for absolute viewership hours, as these are not published with daily/regional granularity.
*   **Truncation**: The model ignores all activity outside the Top 10. Rank 11 is mathematically equivalent to 0.

