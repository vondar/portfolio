from __future__ import annotations

import csv
import json
from functools import lru_cache
from pathlib import Path

from django.conf import settings


PROJECTS = (
    {
        "slug": "cricaudit",
        "title": "CricAudit",
        "eyebrow": "Sports analytics",
        "summary": "Reconstructing Test cricket from ball-level events and auditing every total like a financial ledger.",
        "dashboard_view": "CricAudit",
        "accent": "gold",
        "tags": ["Event sourcing", "WTC", "Reconciliation"],
    },
    {
        "slug": "f2p-games",
        "title": "F2P Games",
        "eyebrow": "Consumer protection",
        "summary": "Exposing the true cost and long-tail risk hidden inside free-to-play reward systems.",
        "dashboard_view": "F2P Games",
        "accent": "coral",
        "tags": ["Monte Carlo", "Risk", "Behavior"],
    },
    {
        "slug": "attention-deficit",
        "title": "Attention Deficit",
        "eyebrow": "Cultural analytics",
        "summary": "Modeling how streaming titles accelerate, persist, diffuse, and decay across regions.",
        "dashboard_view": "Attention Deficit",
        "accent": "cyan",
        "tags": ["Lifecycle models", "Netflix", "Clustering"],
    },
    {
        "slug": "nostalgia",
        "title": "Nostalgia",
        "eyebrow": "Digital archive",
        "summary": "Tracing Billboard-era songs into a verified YouTube Music archive with transparent match confidence.",
        "dashboard_view": "Nostalgia",
        "accent": "violet",
        "tags": ["Entity resolution", "Billboard", "Archive"],
    },
)


def _read_json(path: Path) -> dict:
    with path.open(encoding="utf-8") as handle:
        return json.load(handle)


@lru_cache(maxsize=1)
def project_metrics() -> dict[str, list[dict[str, str]]]:
    data_dir = settings.REPOSITORY_DIR / "data"
    cricket = _read_json(data_dir / "cricaudit" / "wtc_audit_results.json")
    f2p = _read_json(data_dir / "f2p" / "results" / "analysis_output.json")

    attention_rows = 0
    attention_titles: set[str] = set()
    attention_regions: set[str] = set()
    with (data_dir / "attention" / "metrics_summary.csv").open(encoding="utf-8", newline="") as handle:
        for row in csv.DictReader(handle):
            attention_rows += 1
            attention_titles.add(row["title_id"])
            attention_regions.add(row["region"])

    nostalgia_rows = []
    with (data_dir / "nostalgia" / "verification_dry_run.csv").open(encoding="utf-8", newline="") as handle:
        nostalgia_rows = list(csv.DictReader(handle))

    risk = f2p["risk_metrics"]
    return {
        "cricaudit": [
            {"label": "Matches audited", "value": f"{cricket['metadata']['matches_audited']:,}"},
            {"label": "Player records", "value": f"{len(cricket['leaderboard']):,}"},
        ],
        "f2p-games": [
            {"label": "Simulations", "value": f"{f2p['metadata']['iterations']:,}"},
            {"label": "95% safety budget", "value": f"${risk['p95_cost']:,.0f}"},
        ],
        "attention-deficit": [
            {"label": "Observations", "value": f"{attention_rows:,}"},
            {"label": "Regions", "value": f"{len(attention_regions):,}"},
            {"label": "Titles", "value": f"{len(attention_titles):,}"},
        ],
        "nostalgia": [
            {"label": "Songs verified", "value": f"{len(nostalgia_rows):,}"},
            {"label": "Artists", "value": f"{len({row['norm_artist'] for row in nostalgia_rows}):,}"},
        ],
    }


def get_projects() -> list[dict]:
    metrics = project_metrics()
    return [{**project, "metrics": metrics[project["slug"]]} for project in PROJECTS]


def get_project(slug: str) -> dict | None:
    return next((project for project in get_projects() if project["slug"] == slug), None)

