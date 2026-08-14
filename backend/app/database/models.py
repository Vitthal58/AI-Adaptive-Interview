from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    ForeignKey,
    JSON,
    Float
)

from sqlalchemy.orm import relationship

from app.database.database import Base


class Candidate(Base):

    __tablename__ = "candidates"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=True
    )

    email = Column(
        String(150),
        nullable=True
    )

    resume_filename = Column(
        String(255),
        nullable=True
    )

    resume_text = Column(
        Text,
        nullable=True
    )

    sessions = relationship(
        "InterviewSession",
        back_populates="candidate"
    )

    resume_profile = relationship(
        "ResumeProfile",
        back_populates="candidate",
        uselist=False
    )


class InterviewSession(Base):

    __tablename__ = "interview_sessions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False
    )

    role = Column(
        String(100),
        nullable=False
    )

    status = Column(
        String(50),
        default="created"
    )

    candidate = relationship(
        "Candidate",
        back_populates="sessions"
    )

    questions = relationship(
        "Question",
        back_populates="session"
    )

    report = relationship(
        "InterviewReport",
        back_populates="session",
        uselist=False
    )


class Question(Base):

    __tablename__ = "questions"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id"),
        nullable=False
    )

    question_text = Column(
        Text,
        nullable=False
    )

    context = Column(
        Text,
        nullable=True
    )

    difficulty = Column(
        String(20),
        nullable=True
    )

    topic = Column(
        String(100),
        nullable=True
    )

    expected_concepts = Column(
        JSON,
        nullable=True
    )

    source_book = Column(
        String(255),
        nullable=True
    )

    source_page = Column(
        Integer,
        nullable=True
    )

    session = relationship(
        "InterviewSession",
        back_populates="questions"
    )

    # IMPORTANT
    answers = relationship(
        "InterviewAnswer",
        back_populates="question"
    )


class ResumeProfile(Base):

    __tablename__ = "resume_profiles"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    candidate_id = Column(
        Integer,
        ForeignKey("candidates.id"),
        nullable=False,
        unique=True
    )

    skills = Column(
        Text,
        nullable=True
    )

    technologies = Column(
        Text,
        nullable=True
    )

    domains = Column(
        Text,
        nullable=True
    )

    education = Column(
        Text,
        nullable=True
    )

    projects = Column(
        Text,
        nullable=True
    )

    experience = Column(
        Text,
        nullable=True
    )

    candidate = relationship(
        "Candidate",
        back_populates="resume_profile"
    )


class InterviewAnswer(Base):

    __tablename__ = "interview_answers"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    question_id = Column(
        Integer,
        ForeignKey("questions.id"),
        nullable=False
    )

    answer_text = Column(
        Text,
        nullable=False
    )

    score = Column(
        Integer,
        nullable=True
    )

    feedback = Column(
        Text,
        nullable=True
    )

    strengths = Column(
        JSON,
        nullable=True
    )

    weaknesses = Column(
        JSON,
        nullable=True
    )

    question = relationship(
        "Question",
        back_populates="answers"
    )


class InterviewReport(Base):
    __tablename__ = "interview_reports"

    id = Column(Integer, primary_key=True, index=True)

    session_id = Column(
        Integer,
        ForeignKey("interview_sessions.id"),
        nullable=False,
        unique=True
    )

    overall_score = Column(Integer, nullable=True)

    average_score = Column(
        Float,
        nullable=True
    )

    technical_strengths = Column(
        JSON,
        nullable=True
    )

    technical_weaknesses = Column(
        JSON,
        nullable=True
    )

    improvement_areas = Column(
        JSON,
        nullable=True
    )

    overall_feedback = Column(
        Text,
        nullable=True
    )

    recommendation = Column(
        String(100),
        nullable=True
    )

    session = relationship(
        "InterviewSession",
        back_populates="report"
    )