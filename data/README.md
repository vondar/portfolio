# Bundled data

This directory contains the complete data snapshot required by the portfolio application. The app does not read files outside this repository.

| Dashboard | Bundled source | Original project artifact |
| --- | --- | --- |
| CricAudit | `cricaudit/wtc_audit_results.json` | `cricaudit/data/wtc_audit_results.json` |
| F2P Games | `f2p/loot_configs/*.json` | `F2P-Games/data/loot_configs/*.json` |
| F2P Games | `f2p/results/*.json` | Analysis, friction, and retention result snapshots from `F2P-Games/data/results/` |
| Attention Deficit | `attention/metrics_summary.csv` | `attention-deficit/metrics_summary.csv` |
| Nostalgia | `nostalgia/verification_dry_run.csv` | `nostalgia/verification_dry_run.csv` |

The files are copied snapshots of the source projects as of 2026-10-25. The Nostalgia source checkout does not contain its optional `billboard.db`, so the portfolio accurately presents the available verification ledger rather than manufacturing chart-history data.

