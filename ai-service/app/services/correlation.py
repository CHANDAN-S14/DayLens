import pandas as pd
import numpy as np
from scipy import stats
from typing import List, Dict, Any
from app.schemas.analytics_schema import CorrelationPair

def interpret_correlation_strength(r: float) -> str:
    abs_r = abs(r)
    if abs_r >= 0.65:
        return "Strong"
    elif abs_r >= 0.35:
        return "Moderate"
    elif abs_r >= 0.15:
        return "Mild"
    return "Minimal"

def compute_correlations(df: pd.DataFrame) -> List[CorrelationPair]:
    pairs_to_evaluate = [
        ("sleepHours", "focus", "Sleep Duration", "Focus Score"),
        ("screenTimeHours", "focus", "Screen Time", "Focus Score"),
        ("steps", "mood", "Daily Steps", "Mood Rating"),
        ("exerciseDuration", "sleepHours", "Exercise Duration", "Sleep Duration"),
        ("sleepHours", "mood", "Sleep Duration", "Mood Rating"),
        ("screenTimeHours", "sleepHours", "Screen Time", "Sleep Duration")
    ]
    
    results = []
    if len(df) < 3:
        return results
        
    for x_col, y_col, x_label, y_label in pairs_to_evaluate:
        if x_col in df.columns and y_col in df.columns:
            s1 = df[x_col].dropna()
            s2 = df[y_col].dropna()
            
            # Common index alignment
            common_idx = s1.index.intersection(s2.index)
            if len(common_idx) < 3:
                continue
                
            v1 = s1.loc[common_idx]
            v2 = s2.loc[common_idx]
            
            # Check for zero variance
            if v1.std() == 0 or v2.std() == 0:
                continue
                
            r_val, p_val = stats.pearsonr(v1, v2)
            if np.isnan(r_val):
                continue
                
            r_rounded = round(float(r_val), 3)
            p_rounded = round(float(p_val), 4)
            strength = interpret_correlation_strength(r_rounded)
            direction = "positive" if r_rounded >= 0 else "negative"
            
            desc = (
                f"{strength} {direction} association (r = {'+' if r_rounded > 0 else ''}{r_rounded}) "
                f"between {x_label} and {y_label}."
            )
            
            results.append(CorrelationPair(
                x_metric=x_col,
                y_metric=y_col,
                pearson_r=r_rounded,
                p_value=p_rounded,
                strength=strength,
                direction=direction,
                description=desc
            ))
            
    return results
