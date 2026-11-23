from fastapi import APIRouter
from app.schemas.analytics_schema import AnalyticsRequest
from app.services.preprocessing import to_dataframe
from app.services.correlation import compute_correlations
from app.services.anomaly import detect_anomalies

router = APIRouter(prefix="/insights", tags=["insights"])

@router.post("/discover")
async def discover_insights(payload: AnalyticsRequest):
    df = to_dataframe(payload.records)
    correlations = compute_correlations(df)
    anomalies = detect_anomalies(df)
    
    insights = []
    for c in correlations:
        insights.append({
            "type": "correlation",
            "title": f"{c.x_metric} and {c.y_metric} relationship",
            "description": c.description,
            "metric": f"{c.x_metric}_vs_{c.y_metric}",
            "correlationValue": c.pearson_r,
            "strength": c.strength,
            "direction": c.direction,
            "actionableAdvice": (
                "Reinforce this habit on demanding days." if c.direction == "positive"
                else "Consider managing exposure thresholds."
            )
        })
        
    return {
        "insights": insights,
        "anomalyCount": len(anomalies),
        "anomalies": [a.model_dump() for a in anomalies]
    }
