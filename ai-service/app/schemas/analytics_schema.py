from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class DailyRecordIn(BaseModel):
    date: str
    sleepHours: float = Field(default=7.0, ge=0.0, le=24.0)
    screenTimeHours: float = Field(default=4.0, ge=0.0, le=24.0)
    steps: int = Field(default=0, ge=0)
    exerciseDuration: int = Field(default=0, ge=0)
    mood: float = Field(default=7.0, ge=1.0, le=10.0)
    focus: float = Field(default=7.0, ge=1.0, le=10.0)
    notes: Optional[str] = ""

class AnalyticsRequest(BaseModel):
    records: List[DailyRecordIn]

class MetricBaseline(BaseModel):
    mean: float
    median: float
    std_dev: float
    min_val: float
    max_val: float
    q25: float
    q75: float

class CorrelationPair(BaseModel):
    x_metric: str
    y_metric: str
    pearson_r: float
    p_value: Optional[float] = None
    strength: str
    direction: str
    description: str

class AnomalyItem(BaseModel):
    date: str
    metric: str
    value: float
    baseline_mean: float
    z_score: float
    anomaly_type: str
    description: str

class ExperimentComparisonRequest(BaseModel):
    startDate: str
    completedDays: List[str] = []
    durationDays: int = 14
    records: List[DailyRecordIn]

class ExperimentComparisonResponse(BaseModel):
    pre_experiment: Dict[str, Any]
    during_experiment: Dict[str, Any]
    delta: Dict[str, Any]
    evaluated_days: int
    is_statistically_significant: bool

class AssistantQueryRequest(BaseModel):
    query: str
    records: List[DailyRecordIn] = []
    experiments: List[Dict[str, Any]] = []

class AssistantQueryResponse(BaseModel):
    reply: str
    source: str
    model: str
