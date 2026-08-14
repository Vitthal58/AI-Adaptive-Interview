from app.services.rag_service import search_knowledge_base


def test_role(role, query):

    print("\n")
    print("=" * 80)
    print(f"ROLE: {role}")
    print(f"QUERY: {query}")
    print("=" * 80)

    results = search_knowledge_base(
        query=query,
        role=role,
        k=4
    )

    if not results:
        print("No results found.")
        return

    for index, document in enumerate(
        results,
        start=1
    ):

        print("\n" + "-" * 80)

        print(f"RESULT {index}")

        print(
            "Book:",
            document.metadata.get("book")
        )

        print(
            "Page:",
            document.metadata.get("page")
        )

        print(
            "Role:",
            document.metadata.get("role")
        )

        print("\nContent:")

        print(
            document.page_content[:700]
        )


test_role(
    "AI/ML Engineer",
    """
    Explain supervised learning,
    classification, regression,
    and model evaluation.
    """
)


test_role(
    "Data Scientist",
    """
    Explain feature engineering,
    data preprocessing,
    and machine learning using Python.
    """
)


test_role(
    "Advanced ML",
    """
    Explain probability,
    statistical pattern recognition,
    neural networks,
    and advanced machine learning concepts.
    """
)