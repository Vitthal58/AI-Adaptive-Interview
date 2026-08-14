# AI Interviewer

AI Interviewer is a full-stack application that conducts personalized technical interviews using AI.

The system analyzes a candidate's resume, creates a candidate profile, generates technical questions using RAG, evaluates answers, adapts question difficulty, and generates a final interview report.

## Features

- Resume upload
- Resume analysis
- Candidate profile generation
- Role-based interview
- Topic-based interview
- RAG-based question generation
- Adaptive interview questions
- AI answer evaluation
- Score, strengths and weaknesses
- Final interview report
- PostgreSQL database
- ChromaDB vector database
- Groq LLM integration

## Tech Stack

### Frontend

- React.js
- Vite
- JavaScript
- Axios
- React Router
- Tailwind CSS

### Backend

- Python
- FastAPI
- SQLAlchemy
- Pydantic
- Uvicorn

### AI / RAG

- Groq
- LangChain
- ChromaDB
- Sentence Transformers

### Database

- PostgreSQL

## Project Flow

```text
Upload Resume
      ↓
Analyze Resume
      ↓
Interview Setup
      ↓
Select Role & Topic
      ↓
Start Interview
      ↓
Generate Question
      ↓
Submit Answer
      ↓
AI Evaluation
      ↓
Generate Next Question
      ↓
Complete Interview
      ↓
Final Interview Report
