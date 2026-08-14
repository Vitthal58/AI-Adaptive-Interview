import json

from groq import Groq

from app.config import settings


client = Groq(
    api_key=settings.GROQ_API_KEY
)


def evaluate_answer(
    question: str,
    candidate_answer: str,
    expected_concepts: list | None = None
):

    concepts = expected_concepts or []

    prompt = f"""
You are a strict but fair technical interviewer.

Evaluate the candidate's answer to the technical
interview question.

QUESTION:
{question}

EXPECTED CONCEPTS:
{concepts}

CANDIDATE ANSWER:
{candidate_answer}

Evaluate based on:

1. Technical correctness
2. Understanding of the concept
3. Completeness
4. Practical understanding
5. Accuracy of terminology

Important:

- Do not give a high score merely because the
  answer is long.
- Do not penalize concise but technically correct
  answers.
- Identify incorrect claims.
- Identify important missing concepts.
- Do not invent requirements that are not relevant
  to the question.
- Give useful interview-style feedback.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "score": 0,
    "feedback": "...",
    "strengths": [
        "...",
        "..."
    ],
    "weaknesses": [
        "...",
        "..."
    ],
    "missing_concepts": [
        "...",
        "..."
    ]
}}

The score must be between 0 and 10.
"""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        temperature=0.2,
        response_format={
            "type": "json_object"
        },
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert technical "
                    "interviewer and evaluator."
                )
            },
            {
                "role": "user",
                "content": prompt
            }
        ]
    )

    content = (
        response
        .choices[0]
        .message
        .content
    )

    return json.loads(content)