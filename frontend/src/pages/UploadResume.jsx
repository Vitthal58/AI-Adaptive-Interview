import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    uploadResume,
    analyzeResume
} from "../services/api";

function UploadResume() {

    const navigate = useNavigate();

    const [file, setFile] = useState(null);
    const [candidate, setCandidate] = useState(null);

    const [loading, setLoading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);

    const [analyzed, setAnalyzed] = useState(false);

    const [error, setError] = useState("");


    // --------------------------------
    // Upload Resume
    // --------------------------------

    const handleUpload = async () => {

        if (!file) {

            setError(
                "Please select your resume."
            );

            return;
        }

        setLoading(true);
        setError("");
        setCandidate(null);
        setAnalyzed(false);

        const formData = new FormData();

        formData.append(
            "file",
            file
        );

        try {

            const candidateData =
                await uploadResume(formData);

            console.log(
                "Resume uploaded:",
                candidateData
            );

            setCandidate(
                candidateData
            );

        } catch (error) {

            console.error(
                "Resume upload error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Resume upload failed."
            );

        } finally {

            setLoading(false);
        }
    };


    // --------------------------------
    // Analyze Resume
    // --------------------------------

    const handleAnalyzeResume = async () => {

        if (!candidate?.candidate_id) {

            setError(
                "Candidate information is missing."
            );

            return;
        }

        setAnalyzing(true);
        setError("");

        try {

            const result =
                await analyzeResume(
                    candidate.candidate_id
                );

            console.log(
                "Resume analysis:",
                result
            );

            setAnalyzed(true);

        } catch (error) {

            console.error(
                "Resume analysis error:",
                error
            );

            setError(
                error.response?.data?.detail ||
                "Resume analysis failed."
            );

        } finally {

            setAnalyzing(false);
        }
    };


    // --------------------------------
    // Continue to Interview Setup
    // --------------------------------

    const handleContinue = () => {

        if (!candidate?.candidate_id) {

            setError(
                "Candidate information is missing."
            );

            return;
        }

        if (!analyzed) {

            setError(
                "Please analyze your resume first."
            );

            return;
        }

        navigate(
            "/interview-setup",
            {
                state: {
                    candidateId:
                        candidate.candidate_id
                }
            }
        );
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
                            AI-powered technical interviews
                        </p>

                    </div>

                    <div className="rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

                        Resume Analysis

                    </div>

                </div>

            </header>


            {/* Main */}

            <main className="mx-auto flex min-h-[calc(100vh-89px)] max-w-6xl items-center justify-center px-6 py-12">

                <div className="grid w-full max-w-5xl gap-10 md:grid-cols-2">


                    {/* Left */}

                    <div className="flex flex-col justify-center">

                        <div className="mb-6 inline-flex w-fit rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

                            AI Technical Interview

                        </div>


                        <h2 className="text-4xl font-bold leading-tight md:text-5xl">

                            Prepare for your

                            <span className="block text-blue-500">
                                technical interview.
                            </span>

                        </h2>


                        <p className="mt-6 max-w-lg text-lg leading-8 text-slate-400">

                            Upload your resume, analyze your technical
                            profile and start a personalized AI interview.

                        </p>


                        <div className="mt-8 space-y-4">


                            <div className="flex items-center gap-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                                    ✓

                                </div>

                                <div>

                                    <p className="font-medium">
                                        Resume-based questions
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Questions tailored to your profile
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                                    ✓

                                </div>

                                <div>

                                    <p className="font-medium">
                                        Adaptive difficulty
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Questions adapt to your performance
                                    </p>

                                </div>

                            </div>


                            <div className="flex items-center gap-4">

                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">

                                    ✓

                                </div>

                                <div>

                                    <p className="font-medium">
                                        Detailed final report
                                    </p>

                                    <p className="text-sm text-slate-500">
                                        Get strengths and improvement areas
                                    </p>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Right Card */}

                    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">


                        <div className="mb-8">

                            <h3 className="text-2xl font-semibold">
                                Upload your resume
                            </h3>

                            <p className="mt-2 text-sm text-slate-400">

                                Upload your resume in PDF format.

                            </p>

                        </div>


                        {/* File Input */}

                        <label
                            htmlFor="resume"
                            className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-700 bg-slate-950 px-6 py-12 text-center transition hover:border-blue-500 hover:bg-slate-900"
                        >

                            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-3xl">

                                📄

                            </div>


                            <p className="font-medium">

                                {file
                                    ? file.name
                                    : "Choose your resume"}

                            </p>


                            <p className="mt-2 text-sm text-slate-500">

                                PDF files only

                            </p>


                            <input
                                id="resume"
                                type="file"
                                accept=".pdf"
                                className="hidden"
                                onChange={(event) => {

                                    setFile(
                                        event.target.files[0]
                                    );

                                    setCandidate(null);
                                    setAnalyzed(false);
                                    setError("");

                                }}
                            />

                        </label>


                        {/* Upload Button */}

                        <button
                            onClick={handleUpload}
                            disabled={
                                loading ||
                                analyzing
                            }
                            className="mt-6 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >

                            {loading
                                ? "Uploading Resume..."
                                : "Upload Resume"
                            }

                        </button>


                        {/* Candidate Information */}

                        {candidate && (

                            <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950 p-5">

                                <p className="text-sm text-green-400">

                                    ✓ Resume uploaded successfully

                                </p>


                                <div className="mt-4 space-y-2 text-sm">

                                    <p>

                                        <span className="text-slate-500">
                                            Candidate ID:
                                        </span>{" "}

                                        <span className="font-medium">
                                            {candidate.candidate_id}
                                        </span>

                                    </p>


                                    <p>

                                        <span className="text-slate-500">
                                            File:
                                        </span>{" "}

                                        {candidate.filename}

                                    </p>


                                    <p>

                                        <span className="text-slate-500">
                                            Extracted characters:
                                        </span>{" "}

                                        {candidate.text_length}

                                    </p>

                                </div>

                            </div>

                        )}


                        {/* Analyze Button */}

                        {candidate && !analyzed && (

                            <button
                                onClick={
                                    handleAnalyzeResume
                                }
                                disabled={
                                    analyzing
                                }
                                className="mt-4 w-full rounded-xl border border-purple-500/40 bg-purple-500/10 px-5 py-3.5 font-semibold text-purple-400 transition hover:bg-purple-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                            >

                                {analyzing
                                    ? "Analyzing Resume..."
                                    : "Analyze Resume →"
                                }

                            </button>

                        )}


                        {/* Analysis Success */}

                        {analyzed && (

                            <div className="mt-4 rounded-xl border border-green-500/30 bg-green-500/10 p-4">

                                <p className="font-medium text-green-400">

                                    ✓ Resume analyzed successfully

                                </p>

                                <p className="mt-1 text-sm text-green-400/70">

                                    Your technical profile is ready
                                    for the interview.

                                </p>

                            </div>

                        )}


                        {/* Continue */}

                        {analyzed && (

                            <button
                                onClick={
                                    handleContinue
                                }
                                className="mt-4 w-full rounded-xl bg-blue-600 px-5 py-3.5 font-semibold transition hover:bg-blue-700"
                            >

                                Continue to Interview Setup →

                            </button>

                        )}


                        {/* Error */}

                        {error && (

                            <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">

                                {error}

                            </div>

                        )}


                        <p className="mt-5 text-center text-xs text-slate-500">

                            Your resume will be analyzed to personalize
                            your technical interview.

                        </p>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default UploadResume;