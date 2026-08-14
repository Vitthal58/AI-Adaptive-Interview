from pathlib import Path

from langchain_community.document_loaders import (
    PyMuPDFLoader
)

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter
)

from langchain_chroma import Chroma

from langchain_huggingface import (
    HuggingFaceEmbeddings
)


# ============================================================
# PATHS
# ============================================================

BASE_DIR = Path(__file__).resolve().parents[2]

BOOKS_DIR = (
    BASE_DIR
    / "knowledge_base"
    / "books"
)

VECTOR_DB_PATH = (
    BASE_DIR
    / "knowledge_base"
    / "chroma_db"
)


# ============================================================
# EMBEDDING MODEL
# ============================================================

EMBEDDING_MODEL = (
    "sentence-transformers/all-MiniLM-L6-v2"
)


# ============================================================
# ROLE FOLDERS
# ============================================================

ROLE_FOLDERS = {

    "AI/ML Engineer":
        BOOKS_DIR / "ai_ml",

    "Data Scientist":
        BOOKS_DIR / "data_science",

    "Advanced ML":
        BOOKS_DIR / "advanced_ml"
}


# ============================================================
# CREATE EMBEDDINGS
# ============================================================

def create_embeddings():

    return HuggingFaceEmbeddings(
        model_name=EMBEDDING_MODEL
    )


# ============================================================
# LOAD ALL PDF DOCUMENTS
# ============================================================

def load_all_documents():

    all_documents = []

    for role, folder in ROLE_FOLDERS.items():

        pdf_files = list(
            folder.glob("*.pdf")
        )

        print(
            f"\nRole: {role}"
        )

        print(
            f"Found {len(pdf_files)} PDF files."
        )

        for pdf_path in pdf_files:

            print(
                f"Loading: {pdf_path.name}"
            )

            loader = PyMuPDFLoader(
                str(pdf_path)
            )

            documents = loader.load()

            for document in documents:

                document.metadata["role"] = role

                document.metadata["book"] = (
                    pdf_path.stem
                )

                document.metadata["source"] = (
                    "provided_knowledge_base"
                )

            all_documents.extend(
                documents
            )

    return all_documents


# ============================================================
# SPLIT DOCUMENTS
# ============================================================

def split_documents(documents):

    splitter = (
        RecursiveCharacterTextSplitter(
            chunk_size=800,
            chunk_overlap=120
        )
    )

    chunks = splitter.split_documents(
        documents
    )

    return chunks


# ============================================================
# BUILD VECTOR DATABASE
# ============================================================

def build_vector_database():

    documents = load_all_documents()

    if not documents:

        raise ValueError(
            "No PDF documents were found. "
            "Check the knowledge_base/books folders."
        )

    chunks = split_documents(
        documents
    )

    if not chunks:

        raise ValueError(
            "PDFs were found, but no "
            "text chunks were created."
        )

    embeddings = create_embeddings()

    vector_db = Chroma.from_documents(

        documents=chunks,

        embedding=embeddings,

        persist_directory=str(
            VECTOR_DB_PATH
        ),

        collection_name=(
            "interview_knowledge"
        )
    )

    return {

        "documents":
            len(documents),

        "chunks":
            len(chunks),

        "vector_db":
            vector_db
    }


# ============================================================
# GET EXISTING VECTOR DATABASE
# ============================================================

def get_vector_database():

    embeddings = create_embeddings()

    return Chroma(

        persist_directory=str(
            VECTOR_DB_PATH
        ),

        embedding_function=embeddings,

        collection_name=(
            "interview_knowledge"
        )
    )


# ============================================================
# NORMALIZE ROLE
# ============================================================

def normalize_role(role: str):

    return (
        role
        .replace(" / ", "/")
        .strip()
    )


# ============================================================
# SEARCH KNOWLEDGE BASE
# ============================================================

def search_knowledge_base(
    query: str,
    role: str,
    k: int = 5
):

    vector_db = get_vector_database()

    normalized_role = normalize_role(
        role
    )

    print(
        f"RAG role filter: {normalized_role}"
    )

    print(
        f"RAG query: {query}"
    )

    results = (
        vector_db
        .max_marginal_relevance_search(

            query,

            k=k,

            fetch_k=15,

            lambda_mult=0.7,

            filter={
                "role":
                    normalized_role
            }
        )
    )

    print(
        f"RAG results found: {len(results)}"
    )

    return results


# ============================================================
# RETRIEVE INTERVIEW CONTEXT
# ============================================================

def retrieve_interview_context(
    role: str,
    query: str,
    k: int = 5
):

    results = search_knowledge_base(

        query=query,

        role=role,

        k=k
    )

    contexts = []

    for document in results:

        contexts.append({

            "content":
                document.page_content,

            "book":
                document.metadata.get(
                    "book"
                ),

            "page":
                document.metadata.get(
                    "page"
                ),

            "role":
                document.metadata.get(
                    "role"
                ),

            "source":
                document.metadata.get(
                    "source"
                )
        })

    return contexts


# ============================================================
# BUILD INTERVIEW QUERY
# ============================================================

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