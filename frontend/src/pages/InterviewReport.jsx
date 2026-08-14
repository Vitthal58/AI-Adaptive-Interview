import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import api from "../services/api";

function InterviewReport() {

    const { sessionId } = useParams();
    const navigate = useNavigate();

    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchReport = async () => {

            try {

                const response = await api.get(
                    `/interview/${sessionId}/report`
                );

                console.log(
                    "Interview report:",
                    response.data
                );

                setReportData(response.data);

            } catch (error) {

                console.error(
                    "Report error:",
                    error
                );

                setError(
                    error.response?.data?.detail ||
                    "Failed to load interview report."
                );

            } finally {

                setLoading(false);

            }
        };

        if (sessionId) {
            fetchReport();
        }

    }, [sessionId]);


    // --------------------------------
    // Loading
    // --------------------------------

    if (loading) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

                <div className="text-center">

                    <div className="w-12 h-12 border-4 border-slate-700 border-t-violet-500 rounded-full animate-spin mx-auto mb-6"></div>

                    <h1 className="text-2xl font-bold text-white">
                        Generating Interview Report...
                    </h1>

                    <p className="text-slate-400 mt-3">
                        Please wait while we prepare your
                        final technical report.
                    </p>

                </div>

            </div>
        );
    }


    // --------------------------------
    // Error
    // --------------------------------

    if (error) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

                <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center">

                    <div className="w-14 h-14 mx-auto mb-5 rounded-full bg-red-500/10 flex items-center justify-center">

                        <span className="text-red-400 text-2xl">
                            !
                        </span>

                    </div>

                    <h1 className="text-2xl font-bold text-white">
                        Failed to Load Report
                    </h1>

                    <p className="text-red-400 mt-4">
                        {error}
                    </p>

                    <button
                        onClick={() =>
                            navigate("/upload-resume")
                        }
                        className="mt-6 px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
                    >
                        Start New Interview
                    </button>

                </div>

            </div>
        );
    }


    // --------------------------------
    // No report
    // --------------------------------

    if (!reportData || !reportData.report) {

        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center px-6">

                <div className="text-center">

                    <h1 className="text-2xl font-bold text-white">
                        No Report Available
                    </h1>

                    <p className="text-slate-400 mt-3">
                        The interview report could not be found.
                    </p>

                </div>

            </div>
        );
    }


    const report = reportData.report;


    return (

        <div className="min-h-screen bg-slate-950 text-white">

            {/* -------------------------------- */}
            {/* Header */}
            {/* -------------------------------- */}

            <div className="border-b border-slate-800">

                <div className="max-w-6xl mx-auto px-6 py-8">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">

                        <div>

                            <p className="text-sm text-violet-400 font-medium mb-2">
                                AI Technical Interview
                            </p>

                            <h1 className="text-3xl md:text-4xl font-bold">
                                Interview Completed
                            </h1>

                            <p className="text-slate-400 mt-2">
                                Your final technical interview performance report.
                            </p>

                        </div>


                        <div className="flex items-center gap-3">

                            <span className="px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium">
                                {reportData.status}
                            </span>

                        </div>

                    </div>

                </div>

            </div>


            {/* -------------------------------- */}
            {/* Main Content */}
            {/* -------------------------------- */}

            <main className="max-w-6xl mx-auto px-6 py-8">

                {/* Interview Information */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

                    <div className="flex items-center gap-3 mb-6">

                        <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center">

                            <span className="text-violet-400">
                                #
                            </span>

                        </div>

                        <div>

                            <h2 className="text-xl font-semibold">
                                Interview Information
                            </h2>

                            <p className="text-sm text-slate-500">
                                Session details
                            </p>

                        </div>

                    </div>


                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        <InfoCard
                            label="Session ID"
                            value={reportData.session_id}
                        />

                        <InfoCard
                            label="Candidate"
                            value={
                                reportData.candidate_name ||
                                "Candidate"
                            }
                        />

                        <InfoCard
                            label="Target Role"
                            value={reportData.role}
                        />

                        <InfoCard
                            label="Status"
                            value={reportData.status}
                        />

                    </div>

                </section>


                {/* Overall Feedback */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

                    <SectionHeader
                        title="Overall Feedback"
                        subtitle="AI assessment of your complete interview"
                    />

                    <div className="mt-5 bg-slate-950/60 border border-slate-800 rounded-xl p-5">

                        <p className="text-slate-300 leading-7">
                            {report.overall_feedback ||
                                "No overall feedback available."}
                        </p>

                    </div>

                </section>


                {/* Strengths & Weaknesses */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Strengths */}

                    <ReportListCard
                        title="Technical Strengths"
                        subtitle="Areas where you performed well"
                        items={report.technical_strengths}
                        type="success"
                        emptyMessage="No strengths recorded."
                    />


                    {/* Weaknesses */}

                    <ReportListCard
                        title="Technical Weaknesses"
                        subtitle="Areas that need more attention"
                        items={report.technical_weaknesses}
                        type="danger"
                        emptyMessage="No weaknesses recorded."
                    />

                </div>


                {/* Improvement Areas */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">

                    <SectionHeader
                        title="Areas for Improvement"
                        subtitle="Focus on these areas to improve your interview performance"
                    />

                    <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">

                        {report.improvement_areas?.length > 0 ? (

                            report.improvement_areas.map(
                                (area, index) => (

                                    <div
                                        key={index}
                                        className="flex items-start gap-3 bg-slate-950/60 border border-slate-800 rounded-xl p-4"
                                    >

                                        <span className="shrink-0 w-7 h-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center text-sm font-semibold">
                                            {index + 1}
                                        </span>

                                        <p className="text-slate-300 leading-6">
                                            {area}
                                        </p>

                                    </div>

                                )
                            )

                        ) : (

                            <p className="text-slate-500">
                                No improvement areas recorded.
                            </p>

                        )}

                    </div>

                </section>


                {/* Topics */}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

                    {/* Performed Well */}

                    <ReportListCard
                        title="Topics Performed Well"
                        subtitle="Topics showing good understanding"
                        items={report.topics_performed_well}
                        type="success"
                        emptyMessage="No topics recorded."
                    />


                    {/* Improve */}

                    <ReportListCard
                        title="Topics To Improve"
                        subtitle="Topics that require additional preparation"
                        items={report.topics_to_improve}
                        type="warning"
                        emptyMessage="No topics recorded."
                    />

                </div>


                {/* Hiring Recommendation */}

                <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">

                    <SectionHeader
                        title="Hiring Recommendation"
                        subtitle="Overall recommendation based on your interview"
                    />

                    <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-5 bg-slate-950/60 border border-violet-500/20 rounded-xl p-6">

                        <div className="w-14 h-14 shrink-0 rounded-2xl bg-violet-500/10 flex items-center justify-center">

                            <span className="text-violet-400 text-2xl">
                                ★
                            </span>

                        </div>

                        <div>

                            <p className="text-sm text-slate-500 mb-1">
                                Final Recommendation
                            </p>

                            <h3 className="text-2xl font-bold text-violet-400">
                                {report.recommendation ||
                                    "Not Available"}
                            </h3>

                        </div>

                    </div>

                </section>


                {/* Footer Actions */}

                <div className="flex flex-col sm:flex-row justify-center gap-4 pb-10">

                    <button
                        onClick={() =>
                            navigate("/upload-resume")
                        }
                        className="px-6 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-medium transition"
                    >
                        Start New Interview
                    </button>

                </div>

            </main>

        </div>
    );
}


/* ================================================= */
/* Info Card */
/* ================================================= */

function InfoCard({ label, value }) {

    return (

        <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">

            <p className="text-xs uppercase tracking-wide text-slate-500">
                {label}
            </p>

            <p className="mt-2 text-white font-medium wrap-break-words">
                {value}
            </p>

        </div>

    );
}


/* ================================================= */
/* Section Header */
/* ================================================= */

function SectionHeader({
    title,
    subtitle
}) {

    return (

        <div>

            <h2 className="text-xl font-semibold text-white">
                {title}
            </h2>

            <p className="text-sm text-slate-500 mt-1">
                {subtitle}
            </p>

        </div>

    );
}


/* ================================================= */
/* Report List Card */
/* ================================================= */

function ReportListCard({
    title,
    subtitle,
    items,
    type,
    emptyMessage
}) {

    const styles = {

        success: {
            icon:
                "bg-green-500/10 text-green-400",
            border:
                "border-green-500/10",
            bullet:
                "bg-green-400"
        },

        danger: {
            icon:
                "bg-red-500/10 text-red-400",
            border:
                "border-red-500/10",
            bullet:
                "bg-red-400"
        },

        warning: {
            icon:
                "bg-amber-500/10 text-amber-400",
            border:
                "border-amber-500/10",
            bullet:
                "bg-amber-400"
        }

    };

    const currentStyle =
        styles[type] || styles.success;


    return (

        <section
            className={`bg-slate-900 border border-slate-800 rounded-2xl p-6`}
        >

            <div className="flex items-start gap-3">

                <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${currentStyle.icon}`}
                >
                    ✓
                </div>

                <div>

                    <h2 className="text-xl font-semibold">
                        {title}
                    </h2>

                    <p className="text-sm text-slate-500 mt-1">
                        {subtitle}
                    </p>

                </div>

            </div>


            <div className="mt-5 space-y-3">

                {items?.length > 0 ? (

                    items.map(
                        (item, index) => (

                            <div
                                key={index}
                                className={`flex items-start gap-3 p-4 rounded-xl bg-slate-950/60 border ${currentStyle.border}`}
                            >

                                <span
                                    className={`w-2 h-2 rounded-full mt-2.5 shrink-0 ${currentStyle.bullet}`}
                                />

                                <p className="text-sm text-slate-300 leading-6">
                                    {item}
                                </p>

                            </div>

                        )
                    )

                ) : (

                    <p className="text-slate-500">
                        {emptyMessage}
                    </p>

                )}

            </div>

        </section>

    );
}


export default InterviewReport;