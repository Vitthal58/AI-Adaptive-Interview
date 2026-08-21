from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.resume import router as resume_router
from app.routers.interview import router as interview_router

from app.database.database import create_tables
from app.config import settings


create_tables()


app = FastAPI(
    title="AI Interviewer API",
    description="AI-powered role-based technical interview system",
    version="1.0.0"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(resume_router)
app.include_router(interview_router)


@app.get("/")
def root():
    return {
        "message": "AI Interviewer API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }