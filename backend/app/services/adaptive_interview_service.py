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
    generate_next_interview_question
)


def generate_next_question(
    db: Session,
    session: InterviewSession,
    previous_question: Question,
    previous_answer
):

    # --------------------------------
    # 1. Determine next difficulty
    # --------------------------------

    score = previous_answer.score or 0

    if score < 4:

        difficulty_direction = "easier"

    elif score < 7:

        difficulty_direction = "similar"

    else:

        difficulty_direction = "harder"


    # --------------------------------
    # 2. Determine next topic
    # --------------------------------

    next_topic = (
        previous_question.topic
        or "machine learning"
    )


    # --------------------------------
    # 3. Get candidate profile
    # --------------------------------

    candidate = session.candidate

    profile = candidate.resume_profile

    if not profile:

        raise ValueError(
            "Resume profile not found."
        )


    # --------------------------------
    # 4. Build RAG query
    # --------------------------------

    query = build_interview_query(

        role=session.role,

        skills=profile.skills,

        technologies=profile.technologies,

        domains=profile.domains,

        topic=next_topic
    )


    # --------------------------------
    # 5. Retrieve fresh context
    # --------------------------------

    contexts = retrieve_interview_context(

        role=session.role,

        query=query,

        k=5
    )


    if not contexts:

        raise ValueError(
            "No relevant knowledge found."
        )


    # --------------------------------
    # 6. Generate adaptive question
    # --------------------------------

    generated = (
        generate_next_interview_question(

            role=session.role,

            topic=next_topic,

            difficulty_direction=(
                difficulty_direction
            ),

            candidate_skills=profile.skills,

            candidate_technologies=(
                profile.technologies
            ),

            candidate_domains=(
                profile.domains
            ),

            previous_question=(
                previous_question.question_text
            ),

            previous_answer=(
                previous_answer.answer_text
            ),

            previous_score=(
                previous_answer.score
            ),

            previous_feedback=(
                previous_answer.feedback
            ),

            contexts=contexts
        )
    )


    # --------------------------------
    # 7. Force final difficulty
    # --------------------------------

    if difficulty_direction == "easier":

        final_difficulty = "easy"

    elif difficulty_direction == "similar":

        final_difficulty = "medium"

    else:

        final_difficulty = "hard"


    # --------------------------------
    # 8. Store next question
    # --------------------------------

    question = Question(

        session_id=session.id,

        question_text=generated["question"],

        context=str(contexts),

        difficulty=final_difficulty,

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


    return question