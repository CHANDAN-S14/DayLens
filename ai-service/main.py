from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import time
from app.config import settings
from app.routes import analytics, insights, assistant

app = FastAPI(
    title="DayLens AI Analytics Service",
    description="Python microservice performing physiological baseline calculations, Pearson correlation matrices, anomaly detection, and LLM-grounded explanations.",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "DayLens AI Analytics Microservice",
        "version": "1.0.0",
        "hackathon": "wHACKiest 2026 Track 3 - Know Thyself",
        "timestamp": time.time()
    }

# Include routers
app.include_router(analytics.router)
app.include_router(insights.router)
app.include_router(assistant.router)

if __name__ == "__main__":
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=False)
