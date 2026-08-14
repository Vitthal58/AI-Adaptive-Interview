from sqlalchemy.orm import Session
import json

from app.database.database import SessionLocal

from app.database.models import (
    Candidate,
    ResumeProfile
)

from app.services.query_builder import (
    build_interview_query
)

from app.services.rag_service import (
    retrieve_interview_context
)

from app.services.llm_service import (
    generate_interview_question
)


db: Session = SessionLocal()


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


profile = (
    db.query(ResumeProfile)
    .filter(
        ResumeProfile.candidate_id
        == candidate_id
    )
    .first()
)


if not candidate:

    print("Candidate not found.")

    db.close()

    raise SystemExit


if not profile:

    print("Resume profile not found.")

    db.close()

    raise SystemExit


# -----------------------------------
# BUILD RETRIEVAL QUERY
# -----------------------------------

query = build_interview_query(
    role=role,
    skills=profile.skills,
    technologies=profile.technologies,
    domains=profile.domains,
    topic=topic
)


print("=" * 80)

print("RETRIEVAL QUERY")

print("=" * 80)

print(query)


# -----------------------------------
# RETRIEVE KNOWLEDGE
# -----------------------------------

contexts = retrieve_interview_context(
    role=role,
    query=query,
    k=5
)


print("\n")

print("=" * 80)

print("RETRIEVED CONTEXTS")

print("=" * 80)


for index, context in enumerate(
    contexts,
    start=1
):

    print("\n")

    print("-" * 80)

    print(
        f"CONTEXT {index}"
    )

    print(
        "Book:",
        context["book"]
    )

    print(
        "Page:",
        context["page"]
    )

    print(
        "Role:",
        context["role"]
    )

    print(
        "Content:"
    )

    print(
        context["content"][:500]
    )


# -----------------------------------
# GENERATE QUESTION
# -----------------------------------

print("\n")

print("=" * 80)

print("GENERATING QUESTION WITH GROQ")

print("=" * 80)


question = generate_interview_question(

    role=role,

    topic=topic,

    candidate_skills=profile.skills,

    candidate_technologies=profile.technologies,

    candidate_domains=profile.domains,

    contexts=contexts
)


print("\n")

print("=" * 80)

print("GENERATED QUESTION")

print("=" * 80)


print(
    json.dumps(
        question,
        indent=4
    )
)


db.close()