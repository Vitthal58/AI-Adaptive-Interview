import pymupdf

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import Candidate, ResumeProfile
from app.services.resume_analyzer import analyze_resume


router = APIRouter(
    prefix="/api/resume",
    tags=["Resume"]
)


@router.post("/upload")
async def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No file selected"
        )

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=400,
            detail="Only PDF resumes are supported currently"
        )

    file_content = await file.read()

    try:
        pdf = pymupdf.open(
            stream=file_content,
            filetype="pdf"
        )

        resume_text = ""

        for page in pdf:
            resume_text += page.get_text()

        pdf.close()

    except Exception:
        raise HTTPException(
            status_code=400,
            detail="Could not read the PDF file"
        )

    if not resume_text.strip():
        raise HTTPException(
            status_code=400,
            detail="Could not extract text from the resume"
        )

    candidate = Candidate(
        resume_filename=file.filename,
        resume_text=resume_text
    )

    db.add(candidate)
    db.commit()
    db.refresh(candidate)

    return {
        "message": "Resume uploaded successfully",
        "candidate_id": candidate.id,
        "filename": candidate.resume_filename,
        "text_length": len(candidate.resume_text)
    }


@router.post("/analyze/{candidate_id}")
def analyze_candidate_resume(
    candidate_id: int,
    db: Session = Depends(get_db)
):
    candidate = (
        db.query(Candidate)
        .filter(Candidate.id == candidate_id)
        .first()
    )

    if not candidate:
        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )

    if not candidate.resume_text:
        raise HTTPException(
            status_code=400,
            detail="Candidate does not have resume text"
        )

    analysis = analyze_resume(
        candidate.resume_text
    )

    profile = (
        db.query(ResumeProfile)
        .filter(
            ResumeProfile.candidate_id == candidate_id
        )
        .first()
    )

    if profile:
        profile.skills = ", ".join(
            analysis["skills"]
        )

        profile.technologies = ", ".join(
            analysis["technologies"]
        )

        profile.domains = ", ".join(
            analysis["domains"]
        )

    else:
        profile = ResumeProfile(
            candidate_id=candidate_id,

            skills=", ".join(
                analysis["skills"]
            ),

            technologies=", ".join(
                analysis["technologies"]
            ),

            domains=", ".join(
                analysis["domains"]
            )
        )

        db.add(profile)

    db.commit()
    db.refresh(profile)

    return {
        "message": "Resume analyzed successfully",

        "candidate_id": candidate_id,

        "analysis": {
            "skills": analysis["skills"],
            "technologies": analysis["technologies"],
            "domains": analysis["domains"]
        }
    }