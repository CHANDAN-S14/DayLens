from fastapi import APIRouter
from app.schemas.analytics_schema import AssistantQueryRequest, AssistantQueryResponse
from app.services.preprocessing import to_dataframe
from app.services.baseline import compute_all_baselines
from app.services.correlation import compute_correlations
from app.services.llm_service import generate_llm_response

router = APIRouter(prefix="/assistant", tags=["assistant"])

@router.post("/generate", response_model=AssistantQueryResponse)
async def generate_response(payload: AssistantQueryRequest):
    df = to_dataframe(payload.records)
    baselines = compute_all_baselines(df)
    correlations = compute_correlations(df)
    corr_dicts = [c.model_dump() for c in correlations]
    recent_dicts = [r.model_dump() for r in payload.records[-7:]]
    
    result = generate_llm_response(
        query=payload.query,
        baselines=baselines,
        correlations=corr_dicts,
        recent_records=recent_dicts,
        experiments=payload.experiments
    )
    
    return AssistantQueryResponse(
        reply=result["reply"],
        source=result["source"],
        model=result["model"]
    )
