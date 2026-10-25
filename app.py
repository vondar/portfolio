from __future__ import annotations

import json
from pathlib import Path

import numpy as np
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import streamlit as st


APP_DIR = Path(__file__).resolve().parent
DATA_DIR = APP_DIR / "data"
CRICKET_DATA = DATA_DIR / "cricaudit" / "wtc_audit_results.json"
F2P_ROOT = DATA_DIR / "f2p"
ATTENTION_DATA = DATA_DIR / "attention" / "metrics_summary.csv"
NOSTALGIA_DATA = DATA_DIR / "nostalgia" / "verification_dry_run.csv"

PLOT_LAYOUT = {
    "paper_bgcolor": "rgba(0,0,0,0)",
    "plot_bgcolor": "rgba(0,0,0,0)",
    "font": {"color": "#d8d5ce"},
    "margin": {"l": 20, "r": 20, "t": 55, "b": 20},
    "hoverlabel": {"bgcolor": "#171a1f", "font_color": "#f4f0e8"},
}


st.set_page_config(
    page_title="Signals & Systems — Data Portfolio",
    page_icon="◫",
    layout="wide",
    initial_sidebar_state="expanded",
)


def load_css() -> None:
    st.markdown(f"<style>{(APP_DIR / 'styles.css').read_text(encoding='utf-8')}</style>", unsafe_allow_html=True)


def style_figure(fig: go.Figure, height: int = 430) -> go.Figure:
    fig.update_layout(**PLOT_LAYOUT, height=height, legend_title_text="")
    fig.update_xaxes(gridcolor="rgba(255,255,255,0.06)", zerolinecolor="rgba(255,255,255,0.12)")
    fig.update_yaxes(gridcolor="rgba(255,255,255,0.06)", zerolinecolor="rgba(255,255,255,0.12)")
    return fig


def page_intro(kicker: str, title: str, summary: str) -> None:
    st.markdown(
        f'<section class="hero"><div class="eyebrow">{kicker}</div><h1>{title}</h1><p>{summary}</p></section>',
        unsafe_allow_html=True,
    )


def project_card(kicker: str, title: str, text: str, tags: list[str]) -> None:
    tag_markup = "".join(f'<span class="tag">{tag}</span>' for tag in tags)
    st.markdown(
        f'<article class="project-card"><div class="eyebrow">{kicker}</div><h3>{title}</h3>'
        f'<p>{text}</p><div>{tag_markup}</div></article>',
        unsafe_allow_html=True,
    )


@st.cache_data(show_spinner=False)
def load_cricket(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


@st.cache_data(show_spinner=False)
def load_json(path: str) -> dict:
    with open(path, "r", encoding="utf-8") as handle:
        return json.load(handle)


@st.cache_data(show_spinner=False)
def load_attention(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


@st.cache_data(show_spinner=False)
def load_nostalgia(path: str) -> pd.DataFrame:
    return pd.read_csv(path)


def render_home() -> None:
    page_intro(
        "Data product portfolio · 2026",
        "Signals, systems & human behavior.",
        "Four investigative dashboards built from real project data: sporting truth, monetization risk, cultural attention, and the music that refuses to disappear.",
    )

    c1, c2, c3, c4 = st.columns(4)
    c1.metric("Projects", "04")
    c2.metric("Domains", "04", "sport → culture")
    c3.metric("Primary stack", "Python", "Streamlit + Plotly")
    c4.metric("Design mode", "Forensic", "evidence first")

    st.markdown("### Selected work")
    row_one = st.columns(2)
    with row_one[0]:
        project_card("01 · Sports analytics", "CricAudit", "Reconstructing Test cricket from ball-level events and auditing every total like a financial ledger.", ["Event sourcing", "WTC", "Reconciliation"])
    with row_one[1]:
        project_card("02 · Consumer protection", "F2P Games", "Exposing the true cost and long-tail risk hidden inside free-to-play reward systems.", ["Monte Carlo", "Risk", "Behavior"])
    row_two = st.columns(2)
    with row_two[0]:
        project_card("03 · Cultural analytics", "Attention Deficit", "Modeling how streaming titles accelerate, persist, diffuse, and decay across regions.", ["Lifecycle models", "Netflix", "Clustering"])
    with row_two[1]:
        project_card("04 · Digital archive", "Nostalgia", "Tracing Billboard-era songs into a verified YouTube Music archive with transparent match confidence.", ["Entity resolution", "Billboard", "Archive"])

    st.markdown("### The through-line")
    st.markdown(
        '<p class="section-note">Each project starts with a familiar surface—scores, games, rankings, songs—and asks a harder question about the system underneath. Use the navigation at left to explore the live data.</p>',
        unsafe_allow_html=True,
    )


def render_cricket() -> None:
    page_intro(
        "CricAudit · WTC 2023–2025",
        "Cricket, reconciled.",
        "An event-sourced audit of Test matches that rebuilds outcomes delivery by delivery, then measures pressure, impact, and structural failure.",
    )
    if not CRICKET_DATA.exists():
        st.error(f"Dataset not found: {CRICKET_DATA}")
        return

    data = load_cricket(str(CRICKET_DATA))
    leaderboard = pd.DataFrame(
        [{"Player": name, "Team": values["team"], "Points": values["wcs"], "Matches": values["matches"]} for name, values in data["leaderboard"]]
    )
    bowling = pd.DataFrame(data["bowling_impacts"])
    batting = pd.DataFrame(data["batting_impacts"])
    collapses = pd.DataFrame(data["collapses"])
    metadata = data["metadata"]

    top = leaderboard.iloc[0]
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Matches audited", f"{metadata['matches_audited']:,}", "ball-by-ball")
    k2.metric("Cycle", metadata["cycle"])
    k3.metric("Top match-winner", top["Player"], f"{top['Points']:.1f} pts")
    k4.metric("Collapse events", f"{len(collapses):,}")

    teams = sorted(set(leaderboard["Team"].dropna()))
    selected_teams = st.multiselect("Teams", teams, default=teams, key="cricket_teams")
    filtered_lb = leaderboard[leaderboard["Team"].isin(selected_teams)] if selected_teams else leaderboard.iloc[0:0]

    left, right = st.columns([1.35, 1])
    with left:
        aggregated = (
            bowling.groupby(["player_name", "team"], as_index=False)
            .agg(dot_percentage=("dot_percentage", "mean"), wvi_score=("wvi_score", "sum"), actual_wickets=("actual_wickets", "sum"))
        )
        aggregated = aggregated[(aggregated["actual_wickets"] >= 10) & (aggregated["team"].isin(selected_teams))]
        fig = px.scatter(
            aggregated,
            x="dot_percentage",
            y="wvi_score",
            size="actual_wickets",
            color="team",
            hover_name="player_name",
            labels={"dot_percentage": "Dot-ball pressure (%)", "wvi_score": "Wicket Value Index", "actual_wickets": "Wickets"},
            title="The Strangle-O-Meter",
        )
        st.plotly_chart(style_figure(fig, 500), width="stretch")
    with right:
        leaders = filtered_lb.nlargest(12, "Points").sort_values("Points")
        fig = px.bar(leaders, x="Points", y="Player", color="Team", orientation="h", title="Match-winner leaderboard", hover_data=["Matches"])
        st.plotly_chart(style_figure(fig, 500), width="stretch")

    st.markdown("### Value above average")
    st.caption("Runs above or below the match batting mean; the chart preserves match order from the source audit.")
    options = filtered_lb["Player"].head(20).tolist()
    chosen = st.multiselect("Compare players", options, default=options[:4], key="cricket_players")
    trend = batting[batting["player_name"].isin(chosen)].copy()
    if trend.empty:
        st.info("Choose at least one player to draw the impact trend.")
    else:
        fig = px.line(trend, x="match_name", y="rbi", color="player_name", markers=True, labels={"rbi": "Value above average", "match_name": "Match"})
        fig.add_hline(y=0, line_dash="dot", line_color="#a6a29a")
        fig.update_xaxes(showticklabels=False)
        st.plotly_chart(style_figure(fig), width="stretch")

    if not collapses.empty:
        st.markdown("### Structural failure registry")
        view = collapses.copy()
        view["Collapse"] = view.apply(lambda row: f"{row['start_score']}/{row['wickets'] - 1} → {row['end_score']}/{row['to_wicket']}", axis=1)
        view = view.rename(columns={"match_name": "Match", "team": "Team", "runs_lost": "Runs in collapse"})
        st.dataframe(view[["Match", "Team", "Collapse", "Runs in collapse", "match_id"]].sort_values("Runs in collapse"), hide_index=True, width="stretch")


def load_f2p_configs() -> pd.DataFrame:
    records = []
    for path in sorted((F2P_ROOT / "loot_configs").glob("*.json")):
        if path.name in {"loot_schema.json", "friction_config.json"}:
            continue
        payload = load_json(str(path))
        probability = payload.get("base_prob")
        cost = payload.get("cost_per_pull_usd")
        if not isinstance(probability, (int, float)):
            continue
        records.append(
            {
                "System": payload.get("system_name", path.stem.replace("_", " ").title()),
                "Game": payload.get("game", "Unknown"),
                "Drop rate": probability,
                "Cost / pull": cost,
                "Expected pulls": 1 / probability if probability else np.nan,
                "Expected cost": (cost / probability) if probability and isinstance(cost, (int, float)) else np.nan,
                "Pity system": "Yes" if payload.get("pity_config") else "No",
            }
        )
    return pd.DataFrame(records)


def render_f2p() -> None:
    page_intro(
        "F2P Games · Consumer risk",
        "Free to play. Expensive to finish.",
        "A forensic view of loot-system volatility, retention pressure, conversion friction, and the price paid by the unluckiest players.",
    )
    result_path = F2P_ROOT / "results" / "analysis_output.json"
    if not result_path.exists():
        st.error(f"Dataset not found: {result_path}")
        return

    result = load_json(str(result_path))
    metrics = result["risk_metrics"]
    meta = result["metadata"]
    config = meta["config"]

    st.markdown(
        f'<div class="verdict"><strong>Forensic verdict · Grade {metrics["transparency_grade"]}</strong><br>'
        f'The median acquisition costs ${metrics["median_cost"]:,.0f}, while the 95% safety budget rises to ${metrics["p95_cost"]:,.0f}. '
        f'That tail-risk gap is the product, not a rounding error.</div>',
        unsafe_allow_html=True,
    )
    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Median cost", f"${metrics['median_cost']:,.0f}")
    k2.metric("95% safety budget", f"${metrics['p95_cost']:,.0f}", f"{metrics['p95_cost'] / metrics['median_cost']:.1f}× median", delta_color="inverse")
    k3.metric("Worst 5% average", f"${metrics['cte95_cost']:,.0f}")
    k4.metric("Transparency", f"{metrics['transparency_score']:.0f}/100", f"Grade {metrics['transparency_grade']}")

    left, right = st.columns([1.25, 1])
    with left:
        sweep = pd.DataFrame(
            [{"Drop rate": float(rate), "95% cost": value} for rate, value in result["sensitivity_sweep"].items()]
        ).sort_values("Drop rate")
        sweep["Odds"] = sweep["Drop rate"].map(lambda value: f"{value:.2%}")
        fig = px.line(sweep, x="Drop rate", y="95% cost", markers=True, title="How tiny odds inflate the safety budget", hover_data=["Odds"])
        fig.update_xaxes(tickformat=".2%")
        st.plotly_chart(style_figure(fig), width="stretch")
    with right:
        fig = go.Figure(
            go.Indicator(
                mode="gauge+number",
                value=metrics["wrr"],
                number={"suffix": "×"},
                title={"text": "Unlucky-player revenue ratio"},
                gauge={
                    "axis": {"range": [1, max(6, metrics["wrr"] + 0.5)]},
                    "bar": {"color": "#ef6a67"},
                    "steps": [
                        {"range": [1, 2], "color": "rgba(111,198,192,.25)"},
                        {"range": [2, 3], "color": "rgba(232,180,79,.25)"},
                        {"range": [3, max(6, metrics["wrr"] + 0.5)], "color": "rgba(239,106,103,.18)"},
                    ],
                },
            )
        )
        st.plotly_chart(style_figure(fig), width="stretch")

    configs = load_f2p_configs()
    st.markdown("### System comparison")
    if not configs.empty:
        fig = px.scatter(
            configs,
            x="Drop rate",
            y="Expected cost",
            color="Game",
            symbol="Pity system",
            size="Expected pulls",
            hover_name="System",
            labels={"Expected cost": "Naive expected cost (USD)", "Drop rate": "Published drop rate"},
            log_x=True,
        )
        st.plotly_chart(style_figure(fig), width="stretch")
        display = configs.copy()
        display["Drop rate"] = display["Drop rate"].map(lambda value: f"{value:.3%}")
        st.dataframe(display, hide_index=True, width="stretch")

    friction = load_json(str(F2P_ROOT / "results" / "friction_analysis.json"))
    retention = load_json(str(F2P_ROOT / "results" / "retention_analysis.json"))
    st.markdown("### Pressure beyond the pull")
    p1, p2, p3 = st.columns(3)
    p1.metric("Shop incentive gap", f"${friction['incentive_gap']['ig']:,.0f}", "forced surplus")
    p2.metric("Currency exchanges", friction["conversion_obfuscation"]["num_exchange_steps"])
    p3.metric("1 missed day recovery", f"{retention['retention_rigidity']['recovery_interest_rate']:,.0f}%", delta_color="inverse")
    st.caption(f"Featured audit: {config['system_name']} · {meta['iterations']:,} seeded simulations · source timestamp {meta['timestamp'][:10]}")


def classify_attention(frame: pd.DataFrame) -> pd.DataFrame:
    output = frame.copy()
    p25_v, p75_v = output["V_p_Z"].quantile([0.25, 0.75])
    p25_i, p75_i = output["I_p_Z"].quantile([0.25, 0.75])
    conditions = [
        (output["V_p_Z"] > p75_v) & (output["I_p_Z"] < p25_i),
        (output["V_p_Z"] < p25_v) & (output["I_p_Z"] > p75_i),
        (output["V_p_Z"] > p75_v) & (output["I_p_Z"] > p75_i),
        (output["V_p_Z"] < p25_v) & (output["I_p_Z"] < p25_i),
    ]
    output["Archetype"] = np.select(conditions, ["Supernova", "Slow burn", "Cultural anchor", "Ghost"], default="Middle field")
    output.loc[output["archetype_override"].eq("Stationary Anchor"), "Archetype"] = "Cultural anchor"
    return output


def render_attention() -> None:
    page_intro(
        "Attention Deficit · Cultural dynamics",
        "Every hit leaves a trajectory.",
        "A dynamical-systems model of Netflix Top 10 lifecycles: launch velocity, persistence, half-life, and the lag as stories travel between regions.",
    )
    if not ATTENTION_DATA.exists():
        st.error(f"Dataset not found: {ATTENTION_DATA}")
        return

    data = load_attention(str(ATTENTION_DATA))
    regions = sorted(data["region"].dropna().unique())
    default_region = "Global" if "Global" in regions else regions[0]
    a, b = st.columns([1, 1])
    region = a.selectbox("Region", regions, index=regions.index(default_region))
    content_types = b.multiselect("Format", sorted(data["type"].dropna().unique()), default=sorted(data["type"].dropna().unique()))
    filtered = data[(data["region"] == region) & (data["type"].isin(content_types))]
    classified = classify_attention(filtered)

    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Titles modeled", f"{classified['title_id'].nunique():,}")
    k2.metric("Median half-life", f"{classified['half_life'].median():.1f} days")
    k3.metric("Median persistence", f"{classified['I_p'].median():.2f}")
    k4.metric("Cultural anchors", f"{(classified['Archetype'] == 'Cultural anchor').sum():,}")

    plot_data = classified.sample(min(7000, len(classified)), random_state=42) if len(classified) else classified
    fig = px.scatter(
        plot_data,
        x="I_p_Z",
        y="V_p_Z",
        color="Archetype",
        hover_name="title_name",
        hover_data={"type": True, "half_life": ":.1f", "I_p_Z": ":.2f", "V_p_Z": ":.2f"},
        opacity=0.68,
        labels={"I_p_Z": "Persistence index (regional z-score)", "V_p_Z": "Peak velocity (regional z-score)"},
        title=f"The deterministic quadrant · {region}",
        color_discrete_map={"Supernova": "#ef6a67", "Slow burn": "#6fc6c0", "Cultural anchor": "#e8b44f", "Ghost": "#777b82", "Middle field": "#4b6573"},
    )
    fig.add_hline(y=0, line_dash="dot", line_color="rgba(255,255,255,.22)")
    fig.add_vline(x=0, line_dash="dot", line_color="rgba(255,255,255,.22)")
    st.plotly_chart(style_figure(fig, 590), width="stretch")

    left, right = st.columns([1.1, 1])
    with left:
        st.markdown("### Longest-lived attention")
        longest = classified.nlargest(12, "half_life")[["title_name", "type", "half_life", "Archetype"]].rename(columns={"title_name": "Title", "type": "Format", "half_life": "Half-life"})
        st.dataframe(longest, hide_index=True, width="stretch")
    with right:
        st.markdown("### Regional diffusion")
        diffusion = data.groupby("region", as_index=False)["diffusion_lag"].median().sort_values("diffusion_lag")
        diffusion = diffusion[diffusion["region"] != "Global"].head(15)
        fig = px.bar(diffusion, x="diffusion_lag", y="region", orientation="h", labels={"diffusion_lag": "Median lag (days)", "region": ""})
        st.plotly_chart(style_figure(fig, 430), width="stretch")


def render_nostalgia() -> None:
    page_intro(
        "Nostalgia · Archive verification",
        "Old charts. New links. Provenance intact.",
        "A transparent entity-resolution layer connecting a Billboard-era music archive to YouTube Music, with every normalized title, artist, candidate, and confidence score inspectable.",
    )
    if not NOSTALGIA_DATA.exists():
        st.error(f"Dataset not found: {NOSTALGIA_DATA}")
        return

    data = load_nostalgia(str(NOSTALGIA_DATA))
    data["Artist"] = data["norm_artist"].str.title()
    data["Song"] = data["norm_title"].str.title()
    data["Candidate"] = data["yt_title"]
    data["YouTube"] = "https://music.youtube.com/watch?v=" + data["yt_video_id"].astype(str)

    k1, k2, k3, k4 = st.columns(4)
    k1.metric("Songs verified", f"{len(data):,}")
    k2.metric("Artists", f"{data['norm_artist'].nunique():,}")
    k3.metric("Mean confidence", f"{data['score'].mean():.0%}")
    k4.metric("Video IDs resolved", f"{data['yt_video_id'].notna().sum():,}")

    left, right = st.columns([1, 1.5])
    with left:
        st.markdown("### Confidence distribution")
        fig = px.histogram(data, x="score", nbins=10, labels={"score": "Match confidence"}, color_discrete_sequence=["#e8b44f"])
        fig.update_xaxes(tickformat=".0%", range=[0, 1])
        st.plotly_chart(style_figure(fig, 360), width="stretch")
    with right:
        st.markdown("### Artists represented")
        artists = data["Artist"].value_counts().head(12).rename_axis("Artist").reset_index(name="Songs")
        fig = px.bar(artists.sort_values("Songs"), x="Songs", y="Artist", orientation="h", color_discrete_sequence=["#6fc6c0"])
        st.plotly_chart(style_figure(fig, 360), width="stretch")

    st.markdown("### Verification ledger")
    query = st.text_input("Search song or artist", placeholder="Try Bruno Mars…")
    ledger = data
    if query:
        mask = ledger["Song"].str.contains(query, case=False, na=False) | ledger["Artist"].str.contains(query, case=False, na=False)
        ledger = ledger[mask]
    display = ledger[["Song", "Artist", "Candidate", "score", "YouTube"]].rename(columns={"score": "Confidence"})
    st.dataframe(
        display,
        hide_index=True,
        width="stretch",
        column_config={
            "Confidence": st.column_config.ProgressColumn("Confidence", min_value=0.0, max_value=1.0, format="%.0%%"),
            "YouTube": st.column_config.LinkColumn("YouTube Music", display_text="Open track ↗"),
        },
    )
    st.caption("This view uses the repository's verification dry-run dataset. The full Billboard SQLite archive is not present in the checked-out project, so chart-history views are intentionally not fabricated.")


load_css()

st.sidebar.markdown("## Signals & Systems")
st.sidebar.caption("A data product portfolio")
PAGES = {
    "Overview": render_home,
    "CricAudit": render_cricket,
    "F2P Games": render_f2p,
    "Attention Deficit": render_attention,
    "Nostalgia": render_nostalgia,
}
page = st.sidebar.radio("Explore", list(PAGES), label_visibility="collapsed")
st.sidebar.markdown("---")
st.sidebar.caption("Self-contained data snapshot · No external project paths")
PAGES[page]()

st.markdown('<div class="footer-note">Designed as one portfolio, powered by four independent analytical systems.</div>', unsafe_allow_html=True)
