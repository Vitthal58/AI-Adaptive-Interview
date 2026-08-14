from sqlalchemy.orm import Session

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


db: Session = SessionLocal()


candidate_id = 1

role = "AI/ML Engineer"


candidate = (
    db.query(Candidate)
    .filter(
        Candidate.id == candidate_id
    )
    .first()
)


if not candidate:

    print(
        "Candidate not found."
    )

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

    print(
        "Resume profile not found."
    )

    db.close()

    raise SystemExit


topic = "model evaluation"

query = build_interview_query(
    role=role,
    skills=profile.skills,
    technologies=profile.technologies,
    domains=profile.domains,
    topic=topic
)

print("\n")
print("=" * 80)
print("DYNAMIC QUERY")
print("=" * 80)

print(query)


contexts = retrieve_interview_context(
    role=role,
    query=query,
    k=5
)


print("\n")
print("=" * 80)
print("RETRIEVED CONTEXT")
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
        "\nContent:"
    )

    print(
        context["content"][:800]
    )


db.close()