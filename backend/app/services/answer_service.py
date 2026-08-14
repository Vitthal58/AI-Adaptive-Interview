from sqlalchemy.orm import Session

from app.database.models import (
    Question,
    InterviewAnswer
)

from app.services.evaluation_service import (
    evaluate_answer
)


def evaluate_and_store_answer(
    db: Session,
    question_id: int,
    candidate_answer: str
):

    # --------------------------------
    # 1. Find question
    # --------------------------------

    question = (
        db.query(Question)
        .filter(
            Question.id == question_id
        )
        .first()
    )

    if not question:

        raise ValueError(
            "Question not found"
        )


    # --------------------------------
    # 2. Evaluate with Groq
    # --------------------------------

    evaluation = evaluate_answer(

        question=question.question_text,

        candidate_answer=candidate_answer,

        expected_concepts=(
            question.expected_concepts
            or []
        )
    )


    # --------------------------------
    # 3. Check existing answer
    # --------------------------------

    existing_answer = (
        db.query(InterviewAnswer)
        .filter(
            InterviewAnswer.question_id
            == question_id
        )
        .first()
    )


    if existing_answer:

        existing_answer.answer_text = (
            candidate_answer
        )

        existing_answer.score = (
            evaluation["score"]
        )

        existing_answer.feedback = (
            evaluation["feedback"]
        )

        existing_answer.strengths = (
            evaluation["strengths"]
        )

        existing_answer.weaknesses = (
            evaluation["weaknesses"]
        )

        answer = existing_answer

    else:

        answer = InterviewAnswer(

            question_id=question_id,

            answer_text=candidate_answer,

            score=evaluation["score"],

            feedback=evaluation["feedback"],

            strengths=evaluation["strengths"],

            weaknesses=evaluation["weaknesses"]
        )

        db.add(answer)


    db.commit()

    db.refresh(answer)


    return answer, evaluation



def get_interview_data(
    db,
    session_id: int
):
    questions = (
        db.query(Question)
        .filter(
            Question.session_id == session_id
        )
        .order_by(Question.id)
        .all()
    )

    interview_data = []

    for question in questions:

        answer = (
            db.query(InterviewAnswer)
            .filter(
                InterviewAnswer.question_id
                == question.id
            )
            .first()
        )

        interview_data.append({

            "question":
                question.question_text,

            "topic":
                question.topic,

            "difficulty":
                question.difficulty,

            "answer":
                answer.answer_text
                if answer else None,

            "score":
                answer.score
                if answer else None,

            "feedback":
                answer.feedback
                if answer else None,

            "strengths":
                answer.strengths
                if answer else [],

            "weaknesses":
                answer.weaknesses
                if answer else []

        })

    return interview_data