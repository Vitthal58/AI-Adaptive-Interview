import { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { submitAnswer } from "../services/api";

function InterviewPage() {

    const { sessionId } = useParams();

    const location = useLocation();

    const navigate = useNavigate();

    /*
     * --------------------------------
     * Initial question
     * --------------------------------
     */

    const initialQuestion =
        location.state?.question;

    const [question, setQuestion] =
        useState(initialQuestion);

    const [answer, setAnswer] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [evaluation, setEvaluation] =
        useState(null);

    /*
     * Current question number.
     *
     * The backend allows 5 questions.
     */

    const [questionNumber, setQuestionNumber] =
        useState(1);

    const MAX_QUESTIONS = 5;


    /*
     * --------------------------------
     * Submit Answer
     * --------------------------------
     */

    const handleSubmitAnswer = async () => {

        if (!sessionId) {

            setError(
                "Interview session information is missing."
            );

            return;
        }

        if (!question?.id) {

            setError(
                "Question information is missing."
            );

            return;
        }

        if (!answer.trim()) {

            setError(
                "Please enter your answer."
            );

            return;
        }

        setLoading(true);

        setError("");

        try {

            const response =
                await submitAnswer(
                    sessionId,
                    question.id,
                    answer
                );

            console.log(
                "Submit answer response:",
                response
            );


            /*
             * --------------------------------
             * Store evaluation
             * --------------------------------
             */

            setEvaluation(
                response.evaluation
            );


            /*
             * --------------------------------
             * Interview completed
             * --------------------------------
             */

            if (response.completed) {

                navigate(
                    `/interview/${sessionId}/report`
                );

                return;
            }


            /*
             * --------------------------------
             * Next question
             * --------------------------------
             */

            if (response.next_question) {

                setQuestion(
                    response.next_question
                );

                setAnswer("");

                setQuestionNumber(
                    previous =>
                        previous + 1
                );

            } else {

                setError(
                    "Next question was not returned by the server."
                );

            }

        } catch (error) {

            console.error(
                "Submit answer error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Failed to submit answer."
            );

        } finally {

            setLoading(false);
        }
    };


    /*
     * --------------------------------
     * Missing session
     * --------------------------------
     */

    if (!sessionId) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Interview Session Missing
                    </h1>

                    <p className="mt-2">
                        Please start the interview again.
                    </p>

                </div>

            </div>
        );
    }


    /*
     * --------------------------------
     * Missing question
     * --------------------------------
     */

    if (!question) {

        return (

            <div className="min-h-screen flex items-center justify-center">

                <div className="text-center">

                    <h1 className="text-2xl font-bold">
                        Interview Question Missing
                    </h1>

                    <p className="mt-2">
                        Please start the interview again.
                    </p>

                </div>

            </div>
        );
    }


    /*
     * Progress
     */

    const progress =
        (questionNumber / MAX_QUESTIONS) * 100;


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* --------------------------------
                Header
            -------------------------------- */}

            <header className="border-b border-slate-800">

                <div className="max-w-5xl mx-auto px-6 py-5">

                    <div className="flex items-center justify-between">

                        <div>

                            <h1 className="text-xl font-bold">
                                AI Technical Interview
                            </h1>

                            <p className="text-sm text-slate-400 mt-1">
                                Session #{sessionId}
                            </p>

                        </div>


                        <div className="text-right">

                            <p className="text-sm text-slate-400">
                                Question
                            </p>

                            <p className="text-lg font-semibold">
                                {questionNumber} / {MAX_QUESTIONS}
                            </p>

                        </div>

                    </div>


                    {/* Progress bar */}

                    <div className="mt-5">

                        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">

                            <div
                                className="h-full bg-violet-500 transition-all duration-500"
                                style={{
                                    width: `${progress}%`
                                }}
                            />

                        </div>

                    </div>

                </div>

            </header>


            {/* --------------------------------
                Main
            -------------------------------- */}

            <main className="max-w-5xl mx-auto px-6 py-10">

                {/* Question Card */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7">

                    <div className="flex flex-wrap gap-3 mb-6">

                        <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400 text-sm">

                            {question.topic}

                        </span>


                        <span className="px-3 py-1 rounded-full bg-slate-800 text-slate-300 text-sm">

                            {question.difficulty}

                        </span>

                    </div>


                    <h2 className="text-sm uppercase tracking-wider text-slate-400 mb-3">

                        Interview Question

                    </h2>


                    <p className="text-xl leading-8 text-slate-100">

                        {question.question_text}

                    </p>

                </div>


                {/* Answer Card */}

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mt-6">

                    <div className="flex items-center justify-between mb-4">

                        <h2 className="text-lg font-semibold">

                            Your Answer

                        </h2>

                        <span className="text-sm text-slate-500">

                            Be clear and explain your reasoning

                        </span>

                    </div>


                    <textarea
                        value={answer}
                        onChange={(event) =>
                            setAnswer(event.target.value)
                        }
                        placeholder="Type your answer here..."
                        rows={10}
                        disabled={loading}
                        className="w-full rounded-xl bg-slate-950 border border-slate-700 px-4 py-4 text-white placeholder-slate-500 outline-none focus:border-violet-500 resize-none"
                    />


                    <div className="flex justify-end mt-5">

                        <button
                            onClick={handleSubmitAnswer}
                            disabled={loading}
                            className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
                        >

                            {loading
                                ? "Evaluating Answer..."
                                : "Submit Answer"
                            }

                        </button>

                    </div>


                    {error && (

                        <div className="mt-5 p-4 rounded-xl border border-red-500/30 bg-red-500/10 text-red-400">

                            {error}

                        </div>

                    )}

                </div>


                {/* --------------------------------
                    Previous Evaluation
                -------------------------------- */}

                {evaluation && (

                    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-7 mt-6">

                        <div className="flex items-center justify-between">

                            <h2 className="text-lg font-semibold">

                                Previous Answer Evaluation

                            </h2>


                            <div className="text-2xl font-bold text-violet-400">

                                {evaluation.score}/10

                            </div>

                        </div>


                        <div className="mt-5">

                            <h3 className="text-sm uppercase tracking-wider text-slate-400">

                                Feedback

                            </h3>

                            <p className="mt-2 text-slate-300 leading-7">

                                {evaluation.feedback}

                            </p>

                        </div>


                        {/* Strengths */}

                        <div className="mt-6">

                            <h3 className="font-semibold text-green-400">

                                Strengths

                            </h3>


                            {evaluation.strengths?.length > 0 ? (

                                <ul className="mt-3 space-y-2">

                                    {evaluation.strengths.map(
                                        (strength, index) => (

                                            <li
                                                key={index}
                                                className="text-slate-300"
                                            >
                                                • {strength}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p className="text-slate-500 mt-2">
                                    No strengths recorded.
                                </p>

                            )}

                        </div>


                        {/* Weaknesses */}

                        <div className="mt-6">

                            <h3 className="font-semibold text-red-400">

                                Weaknesses

                            </h3>


                            {evaluation.weaknesses?.length > 0 ? (

                                <ul className="mt-3 space-y-2">

                                    {evaluation.weaknesses.map(
                                        (weakness, index) => (

                                            <li
                                                key={index}
                                                className="text-slate-300"
                                            >
                                                • {weakness}
                                            </li>

                                        )
                                    )}

                                </ul>

                            ) : (

                                <p className="text-slate-500 mt-2">
                                    No weaknesses recorded.
                                </p>

                            )}

                        </div>

                    </div>

                )}

            </main>

        </div>
    );
}

export default InterviewPage;