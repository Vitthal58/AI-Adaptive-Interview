import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { startInterview } from "../services/api";

function InterviewSetup() {
    const location = useLocation();
    const navigate = useNavigate();

    const candidateId = location.state?.candidateId;

    const [role, setRole] = useState("AI/ML Engineer");
    const [topic, setTopic] = useState("machine learning");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleStartInterview = async () => {
        if (!candidateId) {
            setError(
                "Candidate information is missing. Please upload your resume again."
            );
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await startInterview(
                candidateId,
                role,
                topic
            );

            navigate(
                `/interview/${response.session_id}`,
                {
                    state: {
                        sessionId: response.session_id,
                        question: response.question
                    }
                }
            );

        } catch (error) {
            setError(
                error.response?.data?.detail ||
                "Failed to start interview."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* Header */}

            <header className="border-b border-slate-800">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

                    <div>
                        <h1 className="text-xl font-bold">
                            AI Interviewer
                        </h1>

                        <p className="text-sm text-slate-400">
                            Personalized technical interview
                        </p>
                    </div>

                    <div className="rounded-full border border-green-500/30 bg-green-500/10 px-4 py-2 text-sm text-green-400">
                        Resume Ready ✓
                    </div>

                </div>
            </header>


            {/* Main */}

            <main className="mx-auto flex min-h-[calc(100vh-89px)] max-w-5xl items-center justify-center px-6 py-12">

                <div className="w-full max-w-3xl">

                    {/* Progress */}

                    <div className="mb-10">

                        <div className="mb-3 flex items-center justify-between text-sm">

                            <span className="font-medium text-blue-400">
                                Step 2 of 3
                            </span>

                            <span className="text-slate-500">
                                Interview Setup
                            </span>

                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-slate-800">

                            <div className="h-full w-2/3 rounded-full bg-blue-600" />

                        </div>

                    </div>


                    {/* Heading */}

                    <div className="mb-8 text-center">

                        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-500/10 text-3xl">
                            🎯
                        </div>

                        <h2 className="text-3xl font-bold md:text-4xl">
                            Configure your interview
                        </h2>

                        <p className="mx-auto mt-3 max-w-xl text-slate-400">
                            Choose the role and technical topic you want
                            the AI interviewer to focus on.
                        </p>

                    </div>


                    {/* Candidate */}

                    <div className="mb-6 rounded-xl border border-slate-800 bg-slate-900 px-5 py-4">

                        <div className="flex items-center justify-between">

                            <div>

                                <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Candidate
                                </p>

                                <p className="mt-1 font-medium">
                                    Candidate #{candidateId}
                                </p>

                            </div>

                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
                                👤
                            </div>

                        </div>

                    </div>


                    {/* Configuration Card */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

                        {/* Role */}

                        <div>

                            <label className="mb-3 block text-sm font-medium text-slate-300">
                                Target Role
                            </label>

                            <select
                                value={role}
                                onChange={(event) =>
                                    setRole(event.target.value)
                                }
                                disabled={loading}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <option value="AI/ML Engineer">
                                    AI/ML Engineer
                                </option>

                                <option value="Data Scientist">
                                    Data Scientist
                                </option>

                                <option value="Advanced ML">
                                    Advanced ML
                                </option>

                            </select>

                            <p className="mt-2 text-xs text-slate-500">
                                Questions will be generated according to
                                this target role.
                            </p>

                        </div>


                        {/* Topic */}

                        <div className="mt-6">

                            <label className="mb-3 block text-sm font-medium text-slate-300">
                                Interview Topic
                            </label>

                            <select
                                value={topic}
                                onChange={(event) =>
                                    setTopic(event.target.value)
                                }
                                disabled={loading}
                                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                <option value="machine learning">
                                    Machine Learning
                                </option>

                                <option value="model evaluation">
                                    Model Evaluation
                                </option>

                                <option value="supervised learning">
                                    Supervised Learning
                                </option>

                                <option value="unsupervised learning">
                                    Unsupervised Learning
                                </option>

                                <option value="feature engineering">
                                    Feature Engineering
                                </option>

                                <option value="deep learning">
                                    Deep Learning
                                </option>

                            </select>

                            <p className="mt-2 text-xs text-slate-500">
                                The AI will use this topic as the starting
                                point for your interview.
                            </p>

                        </div>


                        {/* Interview Features */}

                        <div className="mt-8 grid gap-3 sm:grid-cols-3">

                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                <div className="mb-2 text-xl">
                                    🧠
                                </div>

                                <p className="text-sm font-medium">
                                    RAG Powered
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Knowledge-based questions
                                </p>

                            </div>


                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                <div className="mb-2 text-xl">
                                    📈
                                </div>

                                <p className="text-sm font-medium">
                                    Adaptive
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Difficulty adapts to you
                                </p>

                            </div>


                            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                <div className="mb-2 text-xl">
                                    📊
                                </div>

                                <p className="text-sm font-medium">
                                    Evaluation
                                </p>

                                <p className="mt-1 text-xs text-slate-500">
                                    Detailed final report
                                </p>

                            </div>

                        </div>


                        {/* Error */}

                        {error && (

                            <div className="mt-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                                {error}
                            </div>

                        )}


                        {/* Start Button */}

                        <button
                            onClick={handleStartInterview}
                            disabled={loading || !candidateId}
                            className="mt-8 flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-4 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading ? (
                                <>
                                    <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                                    Generating Interview...
                                </>
                            ) : (
                                <>
                                    Start Interview
                                    <span className="ml-2">
                                        →
                                    </span>
                                </>
                            )}

                        </button>


                        <p className="mt-4 text-center text-xs text-slate-500">
                            Your interview will contain adaptive technical
                            questions based on your selected role and topic.
                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default InterviewSetup;