from app.services.rag_service import build_vector_database


if __name__ == "__main__":

    print("Starting multi-book ingestion...")

    result = build_vector_database()

    print()

    print(
        f"Total pages loaded: {result['documents']}"
    )

    print(
        f"Total chunks created: {result['chunks']}"
    )

    print()

    print(
        "All books embedded successfully."
    )