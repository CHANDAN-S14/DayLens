from fastapi import APIRouter, HTTPException
from scipy import stats
from app.schemas.analytics_schema import (
    AnalyticsRequest, 
    ExperimentComparisonRequest, 
    ExperimentComparisonResponse
)
from app.services.preprocessing import to_dataframe
from app.services.baseline import compute_all_baselines
from app.services.correlation import compute_correlations
from app.services.anomaly import detect_anomalies
from app.services.recommendations import generate_recommendations

router = APIRouter(prefix="/analytics", tags=["analytics"])

@router.post("/compute")
async def compute_analytics(payload: AnalyticsRequest):
    df = to_dataframe(payload.records)
    if len(df) == 0:
        return {
            "baselines": {},
            "correlations": [],
            "anomalies": [],
            "recommendations": [],
            "recordCount": 0
        }
        
    baselines = compute_all_baselines(df)
    correlations = compute_correlations(df)
    anomalies = detect_anomalies(df)
    recommendations = generate_recommendations(baselines, correlations, [])
    
    return {
        "baselines": baselines,
        "correlations": [c.model_dump() for c in correlations],
        "anomalies": [a.model_dump() for a in anomalies],
        "recommendations": recommendations,
        "recordCount": len(df)
    }

@router.post("/experiment-comparison", response_model=ExperimentComparisonResponse)
async def compare_experiment(payload: ExperimentComparisonRequest):
    df = to_dataframe(payload.records)
    if len(df) == 0:
        raise HTTPException(status_code=400, detail="No records provided for experiment evaluation.")
        
    df['date_str'] = df['date'].dt.strftime('%Y-%m-%d')
    pre_df = df[df['date_str'] < payload.startDate]
    
    # Active/evaluated days
    if payload.completedDays:
        active_df = df[df['date_str'].isin(payload.completedDays)]
    else:
        active_df = df[df['date_str'] >= payload.startDate]
        
    pre_base = compute_all_baselines(pre_df)
    active_base = compute_all_baselines(active_df)
    
    metrics = ['sleepHours', 'screenTimeHours', 'steps', 'mood', 'focus']
    delta = {}
    for m in metrics:
        pre_val = pre_base.get(m, {}).get('mean', 0.0)
        act_val = active_base.get(m, {}).get('mean', 0.0)
        delta[m] = round(act_val - pre_val, 2)
        
    # Statistical significance on primary outcome (focus)
    is_sig = False
    if len(pre_df['focus'].dropna()) >= 3 and len(active_df['focus'].dropna()) >= 3:
        try:
            _, p_val = stats.ttest_ind(pre_df['focus'].dropna(), active_df['focus'].dropna())
            is_sig = p_val < 0.05
        except Exception:
            is_sig = False
            
    return ExperimentComparisonResponse(
        pre_experiment=pre_base,
        during_experiment=active_base,
        delta=delta,
        evaluated_days=len(active_df),
        is_statistically_significant=is_sig
    )
