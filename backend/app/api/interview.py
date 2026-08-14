from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Candidate, InterviewSession


router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)


class StartInterviewRequest(BaseModel):
    candidate_id: int
    role: str


@router.post("/start")
def start_interview(
    request: StartInterviewRequest,
    db: Session = Depends(get_db)
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == request.candidate_id)
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    session = InterviewSession(
        candidate_id=candidate.id,
        role=request.role,
        status="started"
    )

    db.add(session)
    db.commit()
    db.refresh(session)

    return {
        "message": "Interview session started",
        "session_id": session.id,
        "candidate_id": candidate.id,
        "role": session.role,
        "status": session.status
    }