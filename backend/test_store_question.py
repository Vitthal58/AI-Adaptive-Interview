from app.database.database import SessionLocal

from app.database.models import (
    Candidate,
    ResumeProfile
)

from app.services.interview_service import (
    generate_and_store_question
)


db = SessionLocal()

candidate_id = 1

role = "AI/ML Engineer"

topic = "model evaluation"


candidate = (
    db.query(Candidate)
    .filter(
        Candidate.id == candidate_id
    )
    .first()
)


if not candidate:

    print("Candidate not found.")

    db.close()

    raise SystemExit


profile = (
    db.query(ResumeProfile)
    .filter(
        ResumeProfile.candidate_id
        == candidate_id
    )
    .first()
)


if not profile:

    print("Resume profile not found.")

    db.close()

    raise SystemExit


session, question = (
    generate_and_store_question(

        db=db,

        candidate=candidate,

        profile=profile,

        role=role,

        topic=topic
    )
)


print("=" * 80)

print("INTERVIEW SESSION CREATED")

print("=" * 80)

print(
    "Session ID:",
    session.id
)

print(
    "Question ID:",
    question.id
)

print(
    "Question:",
    question.question_text
)

print(
    "Difficulty:",
    question.difficulty
)

print(
    "Topic:",
    question.topic
)

print(
    "Source Book:",
    question.source_book
)

print(
    "Source Page:",
    question.source_page
)


db.close()