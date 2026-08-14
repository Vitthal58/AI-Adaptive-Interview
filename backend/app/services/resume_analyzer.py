import re


SKILLS = [
    "python",
    "java",
    "javascript",
    "typescript",
    "c++",
    "sql",
    "html",
    "css",
    "react",
    "node.js",
    "express",
    "fastapi",
    "flask",
    "django",
    "machine learning",
    "deep learning",
    "data science",
    "data analytics",
    "artificial intelligence",
    "natural language processing",
    "computer vision",
    "blockchain",
]


TECHNOLOGIES = [
    "postgresql",
    "mysql",
    "mongodb",
    "sqlite",
    "tensorflow",
    "pytorch",
    "scikit-learn",
    "pandas",
    "numpy",
    "matplotlib",
    "seaborn",
    "langchain",
    "langgraph",
    "docker",
    "git",
    "github",
]


DOMAINS = [
    "backend development",
    "frontend development",
    "full stack development",
    "machine learning",
    "deep learning",
    "artificial intelligence",
    "data science",
    "data analytics",
    "web development",
    "blockchain",
]


def find_keywords(text: str, keywords: list[str]) -> list[str]:
    text_lower = text.lower()

    found = []

    for keyword in keywords:
        if keyword.lower() in text_lower:
            found.append(keyword)

    return found


def analyze_resume(resume_text: str) -> dict:
    skills = find_keywords(
        resume_text,
        SKILLS
    )

    technologies = find_keywords(
        resume_text,
        TECHNOLOGIES
    )

    domains = find_keywords(
        resume_text,
        DOMAINS
    )

    return {
        "skills": skills,
        "technologies": technologies,
        "domains": domains,
    }