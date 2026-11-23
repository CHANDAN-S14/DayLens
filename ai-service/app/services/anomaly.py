import pandas as pd
import numpy as np
from typing import List
from app.schemas.analytics_schema import AnomalyItem

def detect_anomalies(df: pd.DataFrame) -> List[AnomalyItem]:
    if len(df) < 5:
        return []
        
    metrics = [
        ('sleepHours', 'Sleep Duration'),
        ('screenTimeHours', 'Screen Time'),
        ('focus', 'Focus Score'),
        ('mood', 'Mood Score')
    ]
    
    anomalies: List[AnomalyItem] = []
    
    for metric, label in metrics:
        if metric not in df.columns:
            continue
            
        series = df[metric].dropna()
        mean = series.mean()
        std = series.std(ddof=1)
        
        if std == 0 or np.isnan(std):
            continue
            
        for idx, row in df.iterrows():
            val = row[metric]
            z = (val - mean) / std
            
            if abs(z) >= 2.0:
                anomaly_type = "high_spike" if z > 0 else "low_drop"
                date_str = str(row['date'])[:10]
                
                desc = (
                    f"Notable {anomaly_type.replace('_', ' ')} in {label} on {date_str}: "
                    f"{round(float(val), 1)} ({round(float(abs(z)), 1)} std deviations "
                    f"from baseline mean {round(float(mean), 1)})."
                )
                
                anomalies.append(AnomalyItem(
                    date=date_str,
                    metric=metric,
                    value=round(float(val), 2),
                    baseline_mean=round(float(mean), 2),
                    z_score=round(float(z), 2),
                    anomaly_type=anomaly_type,
                    description=desc
                ))
                
    return anomalies
