import sys
import os

sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from main import app
from app.schemas.analytics_schema import DailyRecordIn
from app.services.preprocessing import to_dataframe
from app.services.baseline import compute_all_baselines
from app.services.correlation import compute_correlations

sample_records = [
    DailyRecordIn(date="2026-11-01", sleepHours=7.5, screenTimeHours=4.0, steps=8000, exerciseDuration=30, mood=8.0, focus=8.0),
    DailyRecordIn(date="2026-11-02", sleepHours=6.5, screenTimeHours=6.0, steps=5000, exerciseDuration=0, mood=5.0, focus=5.5),
    DailyRecordIn(date="2026-11-03", sleepHours=8.0, screenTimeHours=3.5, steps=9500, exerciseDuration=40, mood=9.0, focus=8.5),
    DailyRecordIn(date="2026-11-04", sleepHours=7.2, screenTimeHours=4.5, steps=7800, exerciseDuration=20, mood=7.0, focus=7.0)
]

df = to_dataframe(sample_records)
baselines = compute_all_baselines(df)
correlations = compute_correlations(df)

print(f"Dataframe rows: {len(df)}")
print(f"Sleep baseline mean: {baselines['sleepHours']['mean']}")
print(f"Correlations computed: {len(correlations)}")
print("AI Service verification passed!")
