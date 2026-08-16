from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine
from app.database import models
from app.api.resume import router as resume_router
from app.api.interview import router as interview_router
from app.routers.interview import router as interview_router
from app.database.database import create_tables


create_tables()


app = FastAPI(
    title="AI Interviewer API",
    description="AI-powered role-based technical interview system",
    version="1.0.0"
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://your-frontend.vercel.app",
    ],
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