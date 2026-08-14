from sqlalchemy.orm import Session

from app.database.models import (
    InterviewSession,
    Question
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


def generate_and_store_question(
    db: Session,
    candidate,
    profile,
    role: str,
    topic: str
):

    # --------------------------------
    # 1. Build retrieval query
    # --------------------------------

    query = build_interview_query(
        role=role,
        skills=profile.skills,
        technologies=profile.technologies,
        domains=profile.domains,
        topic=topic
    )

    # --------------------------------
    # 2. Retrieve knowledge
    # --------------------------------

    contexts = retrieve_interview_context(
        role=role,
        query=query,
        k=5
    )

    if not contexts:
        raise ValueError(
            "No relevant knowledge found."
        )

    # --------------------------------
    # 3. Generate question with Groq
    # --------------------------------

    generated = generate_interview_question(
        role=role,
        topic=topic,
        candidate_skills=profile.skills,
        candidate_technologies=profile.technologies,
        candidate_domains=profile.domains,
        contexts=contexts
    )

    # --------------------------------
    # 4. Create interview session
    # --------------------------------

    session = InterviewSession(
        candidate_id=candidate.id,
        role=role,
        status="active"
    )

    db.add(session)

    db.flush()

    # --------------------------------
    # 5. Store question
    # --------------------------------

    question = Question(
        session_id=session.id,

        question_text=generated["question"],

        context=str(contexts),

        difficulty=generated.get(
            "difficulty"
        ),

        topic=generated.get(
            "topic"
        ),

        expected_concepts=generated.get(
            "expected_concepts"
        ),

        source_book=generated.get(
            "source_book"
        ),

        source_page=generated.get(
            "source_page"
        )
    )

    db.add(question)

    db.commit()

    db.refresh(question)

    return session, question