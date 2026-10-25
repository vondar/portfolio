# Data Story Portfolio

A self-contained Streamlit portfolio for four data projects:

- CricAudit — forensic Test cricket reconstruction
- F2P Games — monetization and consumer-risk analysis
- Attention Deficit — Netflix attention lifecycle modeling
- Nostalgia — Billboard/YouTube archive verification

All dashboard datasets are versioned inside `data/`, so this folder can be cloned and run without the original source repositories. See [`data/README.md`](data/README.md) for provenance and scope.

## Run

```powershell
git clone <repository-url>
cd portfolio
python -m pip install -r requirements.txt
python -m streamlit run app.py
```

Python 3.12 or newer is recommended.

## Repository layout

```text
portfolio/
├── .streamlit/config.toml
├── data/
│   ├── attention/
│   ├── cricaudit/
│   ├── f2p/
│   └── nostalgia/
├── app.py
├── requirements.txt
└── styles.css
```

