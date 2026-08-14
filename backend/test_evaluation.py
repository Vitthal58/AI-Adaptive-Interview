from app.services.evaluation_service import (
    evaluate_answer
)


question = """
What is the difference between precision
and recall in machine learning?
"""


candidate_answer = """
Precision tells us how many of the samples
predicted as positive are actually positive.

Recall tells us how many of the actual positive
samples were correctly identified.

Precision is TP divided by TP plus FP.

Recall is TP divided by TP plus FN.
"""


expected_concepts = [
    "precision",
    "recall",
    "true positive",
    "false positive",
    "false negative"
]


result = evaluate_answer(
    question=question,
    candidate_answer=candidate_answer,
    expected_concepts=expected_concepts
)


print("=" * 80)

print("EVALUATION RESULT")

print("=" * 80)

print(result)