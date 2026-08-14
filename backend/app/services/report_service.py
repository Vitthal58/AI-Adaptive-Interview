from sqlalchemy.orm import Session

from app.database.models import (
    InterviewSession,
    Question,
    InterviewAnswer,
    InterviewReport
)

from app.services.llm_service import (
    generate_final_interview_report
)


def generate_interview_report(
    db: Session,
    session: InterviewSession
):

    # --------------------------------
    # 1. Get candidate
    # --------------------------------

    candidate = session.candidate

    profile = candidate.resume_profile

    if not profile:

        raise ValueError(
            "Resume profile not found."
        )


    # --------------------------------
    # 2. Get questions
    # --------------------------------

    questions = (
        db.query(Question)
        .filter(
            Question.session_id == session.id
        )
        .order_by(
            Question.id
        )
        .all()
    )


    # --------------------------------
    # 3. Build interview data
    # --------------------------------

    interview_data = []

    total_score = 0
    answer_count = 0

    for question in questions:

        answer = (
            db.query(InterviewAnswer)
            .filter(
                InterviewAnswer.question_id
                == question.id
            )
            .first()
        )

        if not answer:
            continue

        total_score += (
            answer.score or 0
        )

        answer_count += 1

        interview_data.append({

            "question":
                question.question_text,

            "topic":
                question.topic,

            "difficulty":
                question.difficulty,

            "answer":
                answer.answer_text,

            "score":
                answer.score,

            "feedback":
                answer.feedback,

            "strengths":
                answer.strengths,

            "weaknesses":
                answer.weaknesses

        })


    if not interview_data:

        raise ValueError(
            "No interview answers found."
        )


    # --------------------------------
    # 4. Calculate average
    # --------------------------------

    average_score = (
        total_score / answer_count
    )


    # --------------------------------
    # 5. Ask Groq for final analysis
    # --------------------------------

    ai_report = (
        generate_final_interview_report(

            role=session.role,

            candidate_skills=profile.skills,

            candidate_technologies=(
                profile.technologies
            ),

            candidate_domains=(
                profile.domains
            ),

            interview_data=interview_data
        )
    )


    # --------------------------------
    # 6. Store report
    # --------------------------------

    report = InterviewReport(

        session_id=session.id,

        overall_score=total_score,

        average_score=round(
            average_score,
            2
        ),

        technical_strengths=(
            ai_report.get(
                "technical_strengths",
                []
            )
        ),

        technical_weaknesses=(
            ai_report.get(
                "technical_weaknesses",
                []
            )
        ),

        improvement_areas=(
            ai_report.get(
                "improvement_areas",
                []
            )
        ),

        overall_feedback=(
            ai_report.get(
                "overall_feedback",
                ""
            )
        ),

        recommendation=(
            ai_report.get(
                "recommendation",
                "Needs Improvement"
            )
        )
    )


    db.add(report)

    db.commit()

    db.refresh(report)

    return report