def build_interview_query(
    role: str,
    skills: str | None,
    technologies: str | None,
    domains: str | None,
    topic: str
) -> str:

    return f"""
Target interview role:
{role}

Candidate skills:
{skills or ""}

Candidate technologies:
{technologies or ""}

Candidate domains:
{domains or ""}

Interview topic:
{topic}

Retrieve technical knowledge specifically related to:
{topic}

Prioritize:
- definitions
- algorithms
- mechanisms
- implementation details
- advantages and disadvantages
- model evaluation
- practical considerations
- common interview concepts

Do not prioritize:
- book recommendations
- career advice
- references
- introductory resource lists
- unrelated background information
"""