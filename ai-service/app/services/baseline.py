import pandas as pd
import numpy as np
from typing import Dict, Any

def compute_metric_baseline(series: pd.Series) -> Dict[str, float]:
    clean = series.dropna()
    if len(clean) == 0:
        return {
            "mean": 0.0, "median": 0.0, "std_dev": 0.0,
            "min_val": 0.0, "max_val": 0.0, "q25": 0.0, "q75": 0.0
        }
    
    return {
        "mean": round(float(clean.mean()), 2),
        "median": round(float(clean.median()), 2),
        "std_dev": round(float(clean.std(ddof=1) if len(clean) > 1 else 0.0), 2),
        "min_val": round(float(clean.min()), 2),
        "max_val": round(float(clean.max()), 2),
        "q25": round(float(clean.quantile(0.25)), 2),
        "q75": round(float(clean.quantile(0.75)), 2)
    }

def compute_all_baselines(df: pd.DataFrame) -> Dict[str, Dict[str, float]]:
    metrics = ['sleepHours', 'screenTimeHours', 'steps', 'exerciseDuration', 'mood', 'focus']
    baselines = {}
    for m in metrics:
        if m in df.columns:
            baselines[m] = compute_metric_baseline(df[m])
    return baselines
