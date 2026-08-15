import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import UploadResume from "./pages/UploadResume";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewPage from "./pages/InterviewPage";
import InterviewReport from "./pages/InterviewReport";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* =========================
                    Landing Page
                ========================== */}

                <Route
                    path="/"
                    element={<LandingPage />}
                />


                {/* =========================
                    Resume Upload
                ========================== */}

                <Route
                    path="/upload-resume"
                    element={<UploadResume />}
                />


                {/* =========================
                    Interview Setup
                ========================== */}

                <Route
                    path="/interview-setup"
                    element={<InterviewSetup />}
                />


                {/* =========================
                    Interview
                ========================== */}

                <Route
                    path="/interview/:sessionId"
                    element={<InterviewPage />}
                />


                {/* =========================
                    Final Report
                ========================== */}

                <Route
                    path="/interview/:sessionId/report"
                    element={<InterviewReport />}
                />


                {/* =========================
                    Unknown Route
                ========================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );
}


export default App;