from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.database import get_db

from app.database.models import (
    Candidate,
    ResumeProfile,
    InterviewSession,
    Question,
    InterviewAnswer
)

from app.services.interview_service import (
    generate_and_store_question
)

from app.services.answer_service import (
    evaluate_and_store_answer,
    get_interview_data
)

from app.services.adaptive_interview_service import (
    generate_next_question
)

from app.services.report_service import (
    generate_interview_report
)

from app.services.llm_service import (
    generate_final_interview_report
)


# ================================================
# Answer Request Schema
# ================================================

class AnswerRequest(BaseModel):

    question_id: int

    answer: str


# ================================================
# Router
# ================================================

router = APIRouter(
    prefix="/api/interview",
    tags=["Interview"]
)


# ================================================
# START INTERVIEW
# ================================================

@router.post("/start")
def start_interview(
    candidate_id: int,
    role: str,
    topic: str = "machine learning",
    db: Session = Depends(get_db)
):

    # --------------------------------
    # 1. Find candidate
    # --------------------------------

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id == candidate_id
        )
        .first()
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )


    # --------------------------------
    # 2. Find resume profile
    # --------------------------------

    profile = (
        db.query(ResumeProfile)
        .filter(
            ResumeProfile.candidate_id
            == candidate_id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Resume profile not found"
        )


    # --------------------------------
    # 3. Generate first question
    # --------------------------------

    try:

        session, question = (
            generate_and_store_question(

                db=db,

                candidate=candidate,

                profile=profile,

                role=role,

                topic=topic
            )
        )

    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    # --------------------------------
    # 4. Return response
    # --------------------------------

    return {

        "message":
            "Interview started successfully",

        "session_id":
            session.id,

        "role":
            session.role,

        "status":
            session.status,

        "question": {

            "id":
                question.id,

            "question_text":
                question.question_text,

            "difficulty":
                question.difficulty,

            "topic":
                question.topic

        }

    }


# ================================================
# GET INTERVIEW
# ================================================

@router.get("/{session_id}")
def get_interview(
    session_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------
    # 1. Find interview session
    # --------------------------------

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id
            == session_id
        )
        .first()
    )

    if not session:

        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )


    # --------------------------------
    # 2. Get questions
    # --------------------------------

    questions = []

    for question in session.questions:

        questions.append({

            "id":
                question.id,

            "question_text":
                question.question_text,

            "difficulty":
                question.difficulty,

            "topic":
                question.topic,

            "source_book":
                question.source_book,

            "source_page":
                question.source_page

        })


    # --------------------------------
    # 3. Return interview
    # --------------------------------

    return {

        "session_id":
            session.id,

        "candidate_id":
            session.candidate_id,

        "role":
            session.role,

        "status":
            session.status,

        "questions":
            questions

    }


# ================================================
# SUBMIT ANSWER
# ================================================

@router.post("/{session_id}/answer")
def submit_answer(
    session_id: int,
    request: AnswerRequest,
    db: Session = Depends(get_db)
):

    # --------------------------------
    # 1. Find interview session
    # --------------------------------

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id
            == session_id
        )
        .first()
    )

    if not session:

        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )


    # --------------------------------
    # 2. Check if already completed
    # --------------------------------

    if session.status == "completed":

        raise HTTPException(
            status_code=400,
            detail="Interview is already completed"
        )


    # --------------------------------
    # 3. Validate answer
    # --------------------------------

    if not request.answer.strip():

        raise HTTPException(
            status_code=400,
            detail="Answer cannot be empty"
        )


    # --------------------------------
    # 4. Find question
    # --------------------------------

    question = (
        db.query(Question)
        .filter(
            Question.id
            == request.question_id,

            Question.session_id
            == session_id
        )
        .first()
    )

    if not question:

        raise HTTPException(
            status_code=404,
            detail=(
                "Question does not belong "
                "to this interview"
            )
        )


    # ================================================
    # PROCESS ANSWER
    # ================================================

    try:

        # --------------------------------
        # 5. Evaluate answer
        # --------------------------------

        answer, evaluation = (
            evaluate_and_store_answer(

                db=db,

                question_id=
                    request.question_id,

                candidate_answer=
                    request.answer
            )
        )


        # --------------------------------
        # 6. Count questions
        # --------------------------------

        question_count = (
            db.query(Question)
            .filter(
                Question.session_id
                == session_id
            )
            .count()
        )


        # --------------------------------
        # 7. Maximum questions
        # --------------------------------

        MAX_QUESTIONS = 5


        # ================================================
        # INTERVIEW COMPLETED
        # ================================================

        if question_count >= MAX_QUESTIONS:

            # --------------------------------
            # 8. Generate final AI report
            # --------------------------------

            report = (
                generate_interview_report(

                    db=db,

                    session=session
                )
            )


            # --------------------------------
            # 9. Mark interview completed
            # --------------------------------

            session.status = "completed"

            db.commit()


            # --------------------------------
            # 10. Return final report
            # --------------------------------

            return {

                "message":
                    "Interview completed",

                "completed":
                    True,

                "evaluation": {

                    "score":
                        answer.score,

                    "feedback":
                        answer.feedback,

                    "strengths":
                        answer.strengths,

                    "weaknesses":
                        answer.weaknesses

                },

                "result": {

                    "report_id":
                        report.id,

                    "total_questions":
                        question_count,

                    "total_score":
                        report.overall_score,

                    "average_score":
                        report.average_score,

                    "technical_strengths":
                        report.technical_strengths,

                    "technical_weaknesses":
                        report.technical_weaknesses,

                    "improvement_areas":
                        report.improvement_areas,

                    "overall_feedback":
                        report.overall_feedback,

                    "recommendation":
                        report.recommendation

                },

                "next_question":
                    None

            }


        # ================================================
        # CONTINUE INTERVIEW
        # ================================================

        # --------------------------------
        # 11. Generate next adaptive question
        # --------------------------------

        next_question = (
            generate_next_question(

                db=db,

                session=session,

                previous_question=question,

                previous_answer=answer
            )
        )


    except Exception as e:

        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    # ================================================
    # RETURN NEXT QUESTION
    # ================================================

    return {

        "message":
            "Answer evaluated successfully",

        "completed":
            False,

        "evaluation": {

            "score":
                answer.score,

            "feedback":
                answer.feedback,

            "strengths":
                answer.strengths,

            "weaknesses":
                answer.weaknesses

        },

        "next_question": {

            "id":
                next_question.id,

            "question_text":
                next_question.question_text,

            "difficulty":
                next_question.difficulty,

            "topic":
                next_question.topic

        }

    }


@router.get("/{session_id}/report")
def get_interview_report(
    session_id: int,
    db: Session = Depends(get_db)
):

    # --------------------------------
    # 1. Find interview session
    # --------------------------------

    session = (
        db.query(InterviewSession)
        .filter(
            InterviewSession.id == session_id
        )
        .first()
    )

    if not session:

        raise HTTPException(
            status_code=404,
            detail="Interview session not found"
        )


    # --------------------------------
    # 2. Check interview completion
    # --------------------------------

    if session.status != "completed":

        raise HTTPException(
            status_code=400,
            detail="Interview is not completed yet"
        )


    # --------------------------------
    # 3. Get candidate
    # --------------------------------

    candidate = (
        db.query(Candidate)
        .filter(
            Candidate.id
            == session.candidate_id
        )
        .first()
    )

    if not candidate:

        raise HTTPException(
            status_code=404,
            detail="Candidate not found"
        )


    # --------------------------------
    # 4. Get resume profile
    # --------------------------------

    profile = (
        db.query(ResumeProfile)
        .filter(
            ResumeProfile.candidate_id
            == candidate.id
        )
        .first()
    )

    if not profile:

        raise HTTPException(
            status_code=404,
            detail="Resume profile not found"
        )


    # --------------------------------
    # 5. Get complete interview data
    # --------------------------------

    interview_data = get_interview_data(
        db=db,
        session_id=session_id
    )


    if not interview_data:

        raise HTTPException(
            status_code=400,
            detail="No interview data found"
        )


    # --------------------------------
    # 6. Generate final report
    # --------------------------------

    try:

        report = generate_final_interview_report(

            role=session.role,

            candidate_skills=(
                profile.skills
            ),

            candidate_technologies=(
                profile.technologies
            ),

            candidate_domains=(
                profile.domains
            ),

            interview_data=interview_data
        )

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )


    # --------------------------------
    # 7. Return report
    # --------------------------------

    return {

        "session_id":
            session.id,

        "candidate_id":
            candidate.id,

        "candidate_name":
            candidate.name,

        "role":
            session.role,

        "status":
            session.status,

        "report":
            report

    }