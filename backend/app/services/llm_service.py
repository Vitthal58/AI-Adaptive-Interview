import json
import re

from groq import Groq

from app.config import settings


# ============================================================
# Groq Client
# ============================================================

client = Groq(
    api_key=settings.GROQ_API_KEY
)


MODEL_NAME = settings.GROQ_MODEL


def parse_json_response(content: str) -> dict:

    cleaned_content = content.strip()

    if cleaned_content.startswith("```"):
        cleaned_content = re.sub(
            r"^```(?:json)?\s*|\s*```$",
            "",
            cleaned_content,
            flags=re.IGNORECASE
        ).strip()

    try:
        return json.loads(cleaned_content)
    except json.JSONDecodeError:
        start = cleaned_content.find("{")

        if start < 0:
            raise ValueError(
                "Groq returned an invalid JSON response"
            )

        return json.JSONDecoder().raw_decode(
            cleaned_content[start:]
        )[0]


def request_json(
    messages: list[dict],
    temperature: float,
    require_question: bool = False
) -> dict:

    request_messages = list(messages)

    for attempt in range(2):
        try:
            response = client.chat.completions.create(
                model=MODEL_NAME,
                temperature=temperature,
                response_format={"type": "json_object"},
                messages=request_messages
            )
        except Exception as error:
            if "json_validate_failed" not in str(error):
                raise

            response = client.chat.completions.create(
                model=MODEL_NAME,
                temperature=temperature,
                messages=request_messages
            )

        result = parse_json_response(
            response.choices[0].message.content
        )

        question = result.get("question")
        if require_question and (
            not isinstance(question, str)
            or question.strip() in {"", "..."}
        ):
            request_messages.append({
                "role": "user",
                "content": (
                    "Generate a complete real technical question now. "
                    "Never use placeholder text such as ... or TODO."
                )
            })
            continue

        return result

    raise ValueError(
        "Groq returned a placeholder instead of a real question"
    )


# ============================================================
# Generate First Interview Question
# ============================================================

def generate_interview_question(
    role: str,
    topic: str,
    candidate_skills: str,
    candidate_technologies: str,
    candidate_domains: str,
    contexts: list[dict]
):

    # --------------------------------------------------------
    # Build knowledge-base context
    # --------------------------------------------------------

    context_text = ""

    for index, context in enumerate(
        contexts,
        start=1
    ):

        context_text += f"""
SOURCE {index}

Book:
{context.get("book")}

Page:
{context.get("page")}

Content:
{context.get("content")}

"""


    # --------------------------------------------------------
    # Prompt
    # --------------------------------------------------------

    prompt = f"""
You are an AI technical interviewer.

Generate ONE technical interview question
for the candidate.

TARGET ROLE:
{role}

INTERVIEW TOPIC:
{topic}

CANDIDATE SKILLS:
{candidate_skills}

CANDIDATE TECHNOLOGIES:
{candidate_technologies}

CANDIDATE DOMAINS:
{candidate_domains}

KNOWLEDGE BASE CONTEXT:
{context_text}

RULES:

1. Generate exactly ONE technical question.

2. The question must be relevant to the
   target role and interview topic.

3. Use the provided knowledge-base context
   as the primary source.

4. Do not ask about information that cannot
   reasonably be supported by the context.

5. Connect the question to the candidate's
   background when appropriate.

6. Do not mention the candidate's resume
   unnecessarily.

7. Do not ask multiple questions at once.

8. Return ONLY valid JSON.

Return exactly this structure:

{{
    "question": "A complete technical interview question",
    "difficulty": "easy",
    "topic": "...",
    "expected_concepts": [
        "...",
        "..."
    ],
    "source_book": "...",
    "source_page": 0
}}

The difficulty must be exactly one of:

easy
medium
hard
"""


    # --------------------------------------------------------
    # Groq request
    # --------------------------------------------------------

    return request_json(
        messages=[
            {
                "role": "system",

                "content": (
                    "You are a precise technical "
                    "interviewer. Follow the JSON "
                    "format exactly."
                )
            },

            {
                "role": "user",

                "content": prompt
            }
        ],
        temperature=0.3,
        require_question=True
    )


# ============================================================
# Generate Adaptive Interview Question
# ============================================================

def generate_next_interview_question(
    role: str,
    topic: str,
    difficulty_direction: str,
    candidate_skills: str,
    candidate_technologies: str,
    candidate_domains: str,
    previous_question: str,
    previous_answer: str,
    previous_score: float,
    previous_feedback: str,
    contexts: list[dict]
):

    # --------------------------------------------------------
    # Build knowledge-base context
    # --------------------------------------------------------

    context_text = ""

    for index, context in enumerate(
        contexts,
        start=1
    ):

        context_text += f"""
SOURCE {index}

Book:
{context.get("book")}

Page:
{context.get("page")}

Content:
{context.get("content")}

"""


    # --------------------------------------------------------
    # Prompt
    # --------------------------------------------------------

    prompt = f"""
You are conducting an adaptive technical interview.

TARGET ROLE:
{role}

CURRENT TOPIC:
{topic}

CANDIDATE SKILLS:
{candidate_skills}

CANDIDATE TECHNOLOGIES:
{candidate_technologies}

CANDIDATE DOMAINS:
{candidate_domains}

PREVIOUS QUESTION:
{previous_question}

PREVIOUS ANSWER:
{previous_answer}

PREVIOUS SCORE:
{previous_score}/10

PREVIOUS FEEDBACK:
{previous_feedback}

REQUIRED DIFFICULTY DIRECTION:
{difficulty_direction}

KNOWLEDGE BASE CONTEXT:
{context_text}

Generate ONE new technical interview question.

ADAPTIVE RULES:

1. Do NOT repeat the previous question.

2. If the candidate performed poorly,
   ask a question that tests the missing
   fundamentals or concepts.

3. If the candidate performed moderately,
   ask a slightly deeper practical question.

4. If the candidate performed very well,
   increase the conceptual or practical
   difficulty.

5. Follow the required difficulty direction:
   {difficulty_direction}

6. Stay relevant to the target role.

7. Use the knowledge-base context as the
   primary source.

8. The new question should test a different
   aspect of the topic when possible.

9. Ask exactly ONE question.

10. Do not ask multiple questions together.

11. Return ONLY valid JSON.

Return exactly:

{{
    "question": "A complete technical interview question",
    "difficulty": "easy",
    "topic": "...",
    "expected_concepts": [
        "...",
        "..."
    ],
    "source_book": "...",
    "source_page": 0
}}

Difficulty must be:

easy
medium
hard
"""


    # --------------------------------------------------------
    # Groq request
    # --------------------------------------------------------

    return request_json(
        messages=[

            {
                "role": "system",

                "content": (
                    "You are an adaptive technical "
                    "interviewer."
                )
            },

            {
                "role": "user",

                "content": prompt
            }

        ],
        temperature=0.3,
        require_question=True
    )

# ============================================================
# Generate Final Interview Report
# ============================================================

def generate_final_interview_report(
    role: str,
    candidate_skills: str,
    candidate_technologies: str,
    candidate_domains: str,
    interview_data: list[dict]
):

    # --------------------------------------------------------
    # Prompt
    # --------------------------------------------------------

    prompt = f"""
You are an expert technical interviewer.

Generate a final technical interview report.

TARGET ROLE:
{role}

CANDIDATE SKILLS:
{candidate_skills}

CANDIDATE TECHNOLOGIES:
{candidate_technologies}

CANDIDATE DOMAINS:
{candidate_domains}

COMPLETE INTERVIEW DATA:
{json.dumps(interview_data, indent=2)}

Analyze the complete interview.

Evaluate:

1. Overall technical performance
2. Understanding of concepts
3. Practical implementation knowledge
4. Problem solving ability
5. Technical strengths
6. Technical weaknesses
7. Topics that need improvement
8. Topics performed well
9. Overall interview performance
10. Hiring recommendation

IMPORTANT:

Base your analysis on the actual
interview questions, answers, scores,
feedback, strengths and weaknesses.

Do not invent experience that is not
present in the interview data.

Return ONLY valid JSON.

Use exactly this structure:

{{
    "overall_feedback": "string",

    "technical_strengths": [
        "string"
    ],

    "technical_weaknesses": [
        "string"
    ],

    "improvement_areas": [
        "string"
    ],

    "topics_performed_well": [
        "string"
    ],

    "topics_to_improve": [
        "string"
    ],

    "recommendation": "Strong"
}}

The recommendation must be exactly
one of:

Strong
Good
Needs Improvement
Weak

Do not include markdown.

Do not include ```json.

Return only JSON.
"""


    # --------------------------------------------------------
    # Groq request
    # --------------------------------------------------------

    return request_json(
        messages=[

            {
                "role": "system",

                "content": (
                    "You are an expert technical "
                    "interviewer and evaluator. "
                    "Return only valid JSON."
                )
            },

            {
                "role": "user",

                "content": prompt
            }

        ],
        temperature=0.2
    )


    # --------------------------------------------------------
    # Parse response
    # --------------------------------------------------------

