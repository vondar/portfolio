"""Build compact, browser-ready datasets for the static Next.js dashboards."""

from __future__ import annotations

import csv
import hashlib
import json
import math
from collections import Counter, defaultdict
from pathlib import Path
from statistics import median
from typing import Any


ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data"
OUTPUT = ROOT / "frontend" / "public" / "dashboard-data"


def read_json(path: Path) -> Any:
    return json.loads(path.read_text(encoding="utf-8"))


def write_json(name: str, payload: Any) -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    (OUTPUT / name).write_text(
        json.dumps(payload, ensure_ascii=False, separators=(",", ":")),
        encoding="utf-8",
    )


def percentile(values: list[float], quantile: float) -> float:
    ordered = sorted(values)
    if not ordered:
        return 0.0
    position = (len(ordered) - 1) * quantile
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    return ordered[lower] + (ordered[upper] - ordered[lower]) * (position - lower)


def build_cricket() -> None:
    source = read_json(DATA / "cricaudit" / "wtc_audit_results.json")
    leaderboard = [
        {"player": name, "team": values["team"], "points": values["wcs"], "matches": values["matches"]}
        for name, values in source["leaderboard"]
    ]

    bowling: dict[tuple[str, str], dict[str, float]] = defaultdict(lambda: {"dots": 0.0, "wvi": 0.0, "wickets": 0.0, "rows": 0.0})
    for row in source["bowling_impacts"]:
        item = bowling[(row["player_name"], row["team"])]
        item["dots"] += float(row["dot_percentage"])
        item["wvi"] += float(row["wvi_score"])
        item["wickets"] += float(row["actual_wickets"])
        item["rows"] += 1

    bowling_points = [
        {
            "player": player,
            "team": team,
            "dotPercentage": round(values["dots"] / values["rows"], 2),
            "wvi": round(values["wvi"], 2),
            "wickets": int(values["wickets"]),
        }
        for (player, team), values in bowling.items()
        if values["wickets"] >= 10
    ]

    top_players = {row["player"] for row in leaderboard[:20]}
    batting = [
        {
            "player": row["player_name"],
            "team": row["team"],
            "match": row["match_name"],
            "rbi": row["rbi"],
        }
        for row in source["batting_impacts"]
        if row["player_name"] in top_players
    ]
    collapses = [
        {
            "match": row["match_name"],
            "team": row["team"],
            "collapse": f'{row["start_score"]}/{row["wickets"] - 1} → {row["end_score"]}/{row["to_wicket"]}',
            "runs": row["runs_lost"],
            "matchId": row["match_id"],
        }
        for row in sorted(source["collapses"], key=lambda item: item["runs_lost"])
    ]
    write_json(
        "cricaudit.json",
        {
            "metadata": source["metadata"],
            "leaderboard": leaderboard,
            "bowling": bowling_points,
            "batting": batting,
            "collapses": collapses,
        },
    )


def build_f2p() -> None:
    analysis = read_json(DATA / "f2p" / "results" / "analysis_output.json")
    friction = read_json(DATA / "f2p" / "results" / "friction_analysis.json")
    retention = read_json(DATA / "f2p" / "results" / "retention_analysis.json")
    systems = []
    for path in sorted((DATA / "f2p" / "loot_configs").glob("*.json")):
        if path.name in {"loot_schema.json", "friction_config.json"}:
            continue
        config = read_json(path)
        probability = config.get("base_prob")
        cost = config.get("cost_per_pull_usd")
        if not isinstance(probability, (int, float)) or not isinstance(cost, (int, float)):
            continue
        systems.append(
            {
                "system": config.get("system_name", path.stem.replace("_", " ").title()),
                "game": config.get("game", "Unknown"),
                "dropRate": probability,
                "costPerPull": cost,
                "expectedPulls": round(1 / probability, 2),
                "expectedCost": round(cost / probability, 2),
                "pity": bool(config.get("pity_config")),
            }
        )
    write_json(
        "f2p-games.json",
        {
            "metadata": analysis["metadata"],
            "risk": analysis["risk_metrics"],
            "sensitivity": [
                {"rate": float(rate), "cost": cost}
                for rate, cost in sorted(analysis["sensitivity_sweep"].items(), key=lambda item: float(item[0]))
            ],
            "systems": systems,
            "pressure": {
                "incentiveGap": friction["incentive_gap"]["ig"],
                "exchangeSteps": friction["conversion_obfuscation"]["num_exchange_steps"],
                "recoveryRate": retention["retention_rigidity"]["recovery_interest_rate"],
            },
        },
    )


def classify_attention(rows: list[dict[str, Any]]) -> tuple[list[dict[str, Any]], dict[str, Any]]:
    velocity = [row["velocity"] for row in rows]
    persistence_z = [row["persistenceZ"] for row in rows]
    p25_v, p75_v = percentile(velocity, 0.25), percentile(velocity, 0.75)
    p25_i, p75_i = percentile(persistence_z, 0.25), percentile(persistence_z, 0.75)
    counts: Counter[str] = Counter()
    for row in rows:
        if row["override"] == "Stationary Anchor":
            archetype = "Cultural anchor"
        elif row["velocity"] > p75_v and row["persistenceZ"] < p25_i:
            archetype = "Supernova"
        elif row["velocity"] < p25_v and row["persistenceZ"] > p75_i:
            archetype = "Slow burn"
        elif row["velocity"] > p75_v and row["persistenceZ"] > p75_i:
            archetype = "Cultural anchor"
        elif row["velocity"] < p25_v and row["persistenceZ"] < p25_i:
            archetype = "Ghost"
        else:
            archetype = "Middle field"
        row["archetype"] = archetype
        counts[archetype] += 1

    ranked = sorted(rows, key=lambda row: hashlib.sha256(f'{row["titleId"]}:{row["region"]}'.encode()).hexdigest())
    sample = [
        {key: value for key, value in row.items() if key not in {"titleId", "override", "persistence"}}
        for row in ranked[:64]
    ]
    longest = sorted(rows, key=lambda row: row["halfLife"], reverse=True)[:12]
    summary = {
        "titles": len({row["titleId"] for row in rows}),
        "medianHalfLife": round(median(row["halfLife"] for row in rows), 2),
        "medianPersistence": round(median(row["persistence"] for row in rows), 3),
        "anchors": counts["Cultural anchor"],
        "sample": sample,
        "longest": [
            {"title": row["title"], "format": row["format"], "halfLife": round(row["halfLife"], 2), "archetype": row["archetype"]}
            for row in longest
        ],
    }
    return rows, summary


def build_attention() -> None:
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    diffusion: dict[str, list[float]] = defaultdict(list)
    with (DATA / "attention" / "metrics_summary.csv").open(encoding="utf-8", newline="") as handle:
        for source in csv.DictReader(handle):
            row = {
                "titleId": source["title_id"],
                "title": source["title_name"],
                "format": source["type"],
                "region": source["region"],
                "velocity": float(source["V_p_Z"]),
                "persistenceZ": float(source["I_p_Z"]),
                "persistence": float(source["I_p"]),
                "halfLife": float(source["half_life"]),
                "override": source["archetype_override"],
            }
            groups[f'{source["region"]}|All'].append(row.copy())
            groups[f'{source["region"]}|{source["type"]}'].append(row)
            if source["region"] != "Global":
                diffusion[source["region"]].append(float(source["diffusion_lag"]))

    summaries = {}
    for key, rows in groups.items():
        _, summaries[key] = classify_attention(rows)
    diffusion_rows = sorted(
        ({"region": region, "lag": round(median(values), 2)} for region, values in diffusion.items()),
        key=lambda row: row["lag"],
    )[:15]
    write_json(
        "attention-deficit.json",
        {
            "regions": sorted({key.split("|", 1)[0] for key in groups}),
            "formats": ["All", "Movie", "Show"],
            "views": summaries,
            "diffusion": diffusion_rows,
        },
    )


def build_nostalgia() -> None:
    rows = []
    with (DATA / "nostalgia" / "verification_dry_run.csv").open(encoding="utf-8", newline="") as handle:
        for source in csv.DictReader(handle):
            rows.append(
                {
                    "song": source["norm_title"].title(),
                    "artist": source["norm_artist"].title(),
                    "candidate": source["yt_title"],
                    "score": float(source["score"]),
                    "videoId": source["yt_video_id"],
                }
            )
    write_json(
        "nostalgia.json",
        {
            "rows": rows,
            "artists": len({row["artist"] for row in rows}),
            "meanConfidence": sum(row["score"] for row in rows) / len(rows),
        },
    )


def main() -> None:
    build_cricket()
    build_f2p()
    build_attention()
    build_nostalgia()
    for path in sorted(OUTPUT.glob("*.json")):
        print(f"{path.relative_to(ROOT)}: {path.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
