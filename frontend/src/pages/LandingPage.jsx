import { useNavigate } from "react-router-dom";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-950 text-white">

            {/* =========================
                NAVBAR
            ========================== */}

            <header className="border-b border-slate-800/80">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

                    {/* Logo */}

                    <button
                        onClick={() => navigate("/")}
                        className="flex items-center gap-3"
                    >

                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
                            AI
                        </div>

                        <div className="text-left">
                            <p className="font-bold">
                                AI Interviewer
                            </p>

                            <p className="text-xs text-slate-500">
                                Technical Interview Platform
                            </p>
                        </div>

                    </button>


                    {/* Navigation */}

                    <nav className="hidden items-center gap-8 md:flex">

                        <a
                            href="#features"
                            className="text-sm text-slate-400 transition hover:text-white"
                        >
                            Features
                        </a>

                        <a
                            href="#how-it-works"
                            className="text-sm text-slate-400 transition hover:text-white"
                        >
                            How It Works
                        </a>

                        <a
                            href="#technology"
                            className="text-sm text-slate-400 transition hover:text-white"
                        >
                            Technology
                        </a>

                    </nav>


                    {/* Start button */}

                    <button
                        onClick={() => navigate("/upload-resume")}
                        className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold transition hover:bg-blue-700"
                    >
                        Get Started
                    </button>

                </div>
            </header>


            {/* =========================
                HERO
            ========================== */}

            <main>

                <section className="relative overflow-hidden">

                    {/* Background glow */}

                    <div className="pointer-events-none absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />


                    <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">

                        {/* Hero content */}

                        <div>

                            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm text-blue-400">

                                <span className="h-2 w-2 rounded-full bg-blue-400" />

                                AI-Powered Technical Interviews

                            </div>


                            <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl">

                                Practice technical
                                <span className="block text-blue-500">
                                    interviews with AI.
                                </span>

                            </h1>


                            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-400">

                                Upload your resume, choose your target role,
                                and experience a personalized technical
                                interview powered by AI.

                            </p>


                            {/* Buttons */}

                            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

                                <button
                                    onClick={() =>
                                        navigate("/upload-resume")
                                    }
                                    className="rounded-xl bg-blue-600 px-7 py-4 font-semibold transition hover:bg-blue-700"
                                >
                                    Start Interview
                                    <span className="ml-2">
                                        →
                                    </span>
                                </button>


                                <a
                                    href="#how-it-works"
                                    className="rounded-xl border border-slate-700 px-7 py-4 text-center font-semibold text-slate-300 transition hover:border-slate-600 hover:bg-slate-900"
                                >
                                    How It Works
                                </a>

                            </div>


                            {/* Small info */}

                            <div className="mt-8 flex flex-wrap gap-6 text-sm text-slate-500">

                                <span>
                                    ✓ Resume Based
                                </span>

                                <span>
                                    ✓ Adaptive Questions
                                </span>

                                <span>
                                    ✓ AI Evaluation
                                </span>

                            </div>

                        </div>


                        {/* Hero visual */}

                        <div className="relative">

                            <div className="rounded-3xl border border-slate-800 bg-slate-900 p-5 shadow-2xl shadow-blue-950/20">

                                {/* Fake browser header */}

                                <div className="mb-5 flex items-center gap-2 border-b border-slate-800 pb-4">

                                    <div className="h-3 w-3 rounded-full bg-red-400/70" />
                                    <div className="h-3 w-3 rounded-full bg-yellow-400/70" />
                                    <div className="h-3 w-3 rounded-full bg-green-400/70" />

                                    <div className="ml-4 h-2 w-32 rounded-full bg-slate-800" />

                                </div>


                                {/* Question */}

                                <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6">

                                    <div className="mb-5 flex items-center justify-between">

                                        <span className="rounded-lg bg-blue-500/10 px-3 py-1.5 text-xs font-medium text-blue-400">
                                            AI/ML Engineer
                                        </span>

                                        <span className="text-xs text-slate-500">
                                            Question 3 / 5
                                        </span>

                                    </div>


                                    <p className="text-lg font-semibold leading-7">
                                        How would you handle an imbalanced
                                        dataset in a machine learning system?
                                    </p>


                                    <div className="mt-6 rounded-xl border border-slate-800 bg-slate-900 p-4">

                                        <p className="text-xs text-slate-500">
                                            YOUR ANSWER
                                        </p>

                                        <div className="mt-3 h-2 w-full rounded-full bg-slate-800" />

                                        <div className="mt-2 h-2 w-4/5 rounded-full bg-slate-800" />

                                        <div className="mt-2 h-2 w-3/5 rounded-full bg-slate-800" />

                                    </div>


                                    <div className="mt-5 flex items-center justify-between">

                                        <span className="text-sm text-slate-500">
                                            Adaptive difficulty
                                        </span>

                                        <span className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs text-orange-400">
                                            Hard
                                        </span>

                                    </div>

                                </div>


                                {/* AI evaluation */}

                                <div className="mt-4 grid grid-cols-3 gap-3">

                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                        <p className="text-xs text-slate-500">
                                            SCORE
                                        </p>

                                        <p className="mt-2 text-2xl font-bold text-green-400">
                                            8/10
                                        </p>

                                    </div>


                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                        <p className="text-xs text-slate-500">
                                            MODE
                                        </p>

                                        <p className="mt-2 text-sm font-semibold">
                                            Adaptive
                                        </p>

                                    </div>


                                    <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">

                                        <p className="text-xs text-slate-500">
                                            RESULT
                                        </p>

                                        <p className="mt-2 text-sm font-semibold text-blue-400">
                                            Evaluated
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* =========================
                    FEATURES
                ========================== */}

                <section
                    id="features"
                    className="border-t border-slate-800 bg-slate-900/30"
                >

                    <div className="mx-auto max-w-7xl px-6 py-24">

                        <div className="mx-auto max-w-2xl text-center">

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                Features
                            </p>

                            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                                Everything you need to practice smarter
                            </h2>

                            <p className="mt-4 text-slate-400">
                                The interview adapts to your background,
                                answers and selected technical domain.
                            </p>

                        </div>


                        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

                            {/* Feature 1 */}

                            <FeatureCard
                                icon="📄"
                                title="Resume-Based Questions"
                                description="Your resume is analyzed to create questions relevant to your skills, technologies and experience."
                            />


                            {/* Feature 2 */}

                            <FeatureCard
                                icon="🧠"
                                title="RAG-Powered Interviews"
                                description="Questions are generated using relevant knowledge retrieved from the technical knowledge base."
                            />


                            {/* Feature 3 */}

                            <FeatureCard
                                icon="📈"
                                title="Adaptive Difficulty"
                                description="Question difficulty changes based on your previous interview performance."
                            />


                            {/* Feature 4 */}

                            <FeatureCard
                                icon="🤖"
                                title="AI Answer Evaluation"
                                description="Every answer is evaluated with a score, feedback, strengths and weaknesses."
                            />


                            {/* Feature 5 */}

                            <FeatureCard
                                icon="🎯"
                                title="Role & Topic Based"
                                description="Choose your target role and technical topic before starting the interview."
                            />


                            {/* Feature 6 */}

                            <FeatureCard
                                icon="📊"
                                title="Final Interview Report"
                                description="Receive a complete report highlighting your performance and areas to improve."
                            />

                        </div>

                    </div>

                </section>


                {/* =========================
                    HOW IT WORKS
                ========================== */}

                <section id="how-it-works">

                    <div className="mx-auto max-w-7xl px-6 py-24">

                        <div className="mx-auto max-w-2xl text-center">

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                How It Works
                            </p>

                            <h2 className="mt-3 text-3xl font-bold md:text-4xl">
                                From resume to interview report
                            </h2>

                        </div>


                        <div className="mt-14 grid gap-6 md:grid-cols-4">

                            <Step
                                number="01"
                                title="Upload Resume"
                                description="Upload your PDF resume and let the system extract your profile."
                            />

                            <Step
                                number="02"
                                title="Configure"
                                description="Select your target role and technical interview topic."
                            />

                            <Step
                                number="03"
                                title="Interview"
                                description="Answer AI-generated questions that adapt to your performance."
                            />

                            <Step
                                number="04"
                                title="Get Report"
                                description="Review your score, strengths, weaknesses and improvement areas."
                            />

                        </div>

                    </div>

                </section>


                {/* =========================
                    TECHNOLOGY
                ========================== */}

                <section
                    id="technology"
                    className="border-t border-slate-800 bg-slate-900/30"
                >

                    <div className="mx-auto max-w-7xl px-6 py-24">

                        <div className="text-center">

                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
                                Technology
                            </p>

                            <h2 className="mt-3 text-3xl font-bold">
                                Built with modern technologies
                            </h2>

                        </div>


                        <div className="mx-auto mt-12 flex max-w-4xl flex-wrap justify-center gap-3">

                            {[
                                "React.js",
                                "Vite",
                                "Tailwind CSS",
                                "FastAPI",
                                "Python",
                                "PostgreSQL",
                                "SQLAlchemy",
                                "LangChain",
                                "RAG",
                                "ChromaDB",
                                "Groq",
                                "Sentence Transformers",
                            ].map((technology) => (

                                <span
                                    key={technology}
                                    className="rounded-xl border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-medium text-slate-300"
                                >
                                    {technology}
                                </span>

                            ))}

                        </div>

                    </div>

                </section>


                {/* =========================
                    CTA
                ========================== */}

                <section>

                    <div className="mx-auto max-w-5xl px-6 py-24">

                        <div className="rounded-3xl border border-blue-500/20 bg-blue-600/10 px-6 py-16 text-center md:px-12">

                            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-500/10 text-2xl">
                                🚀
                            </div>

                            <h2 className="text-3xl font-bold md:text-4xl">
                                Ready to test your technical skills?
                            </h2>

                            <p className="mx-auto mt-4 max-w-xl text-slate-400">
                                Upload your resume and start a personalized
                                AI-powered technical interview.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/upload-resume")
                                }
                                className="mt-8 rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700"
                            >
                                Start Your Interview
                                <span className="ml-2">
                                    →
                                </span>
                            </button>

                        </div>

                    </div>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================== */}

            <footer className="border-t border-slate-800">

                <div className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-center text-sm text-slate-500 md:flex-row md:items-center md:justify-between md:text-left">

                    <p>
                        © {new Date().getFullYear()} AI Interviewer
                    </p>

                    <p>
                        AI-powered technical interview platform
                    </p>

                </div>

            </footer>

        </div>
    );
}


/* =========================
   FEATURE CARD
========================= */

function FeatureCard({
    icon,
    title,
    description
}) {
    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:-translate-y-1 hover:border-slate-700">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
                {icon}
            </div>

            <h3 className="text-lg font-semibold">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
            </p>

        </div>
    );
}


/* =========================
   STEP
========================= */

function Step({
    number,
    title,
    description
}) {
    return (
        <div className="relative rounded-2xl border border-slate-800 bg-slate-900 p-6">

            <span className="text-sm font-bold text-blue-500">
                {number}
            </span>

            <h3 className="mt-5 text-lg font-semibold">
                {title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                {description}
            </p>

        </div>
    );
}


export default LandingPage;