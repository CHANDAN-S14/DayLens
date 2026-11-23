import pandas as pd
import numpy as np
from typing import List
from app.schemas.analytics_schema import DailyRecordIn

def to_dataframe(records: List[DailyRecordIn]) -> pd.DataFrame:
    if not records:
        return pd.DataFrame(columns=[
            'date', 'sleepHours', 'screenTimeHours', 'steps', 
            'exerciseDuration', 'mood', 'focus', 'notes'
        ])
    
    data = [r.model_dump() for r in records]
    df = pd.DataFrame(data)
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values('date').reset_index(drop=True)
    
    numeric_cols = ['sleepHours', 'screenTimeHours', 'steps', 'exerciseDuration', 'mood', 'focus']
    for col in numeric_cols:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors='coerce').fillna(0)
            
    return df
