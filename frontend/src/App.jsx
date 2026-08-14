import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import UploadResume from "./pages/UploadResume";
import InterviewSetup from "./pages/InterviewSetup";
import InterviewPage from "./pages/InterviewPage";
import InterviewReport from "./pages/InterviewReport";

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default page */}
                <Route
                    path="/"
                    element={<Navigate to="/upload-resume" replace />}
                />

                {/* Resume upload */}
                <Route
                    path="/upload-resume"
                    element={<UploadResume />}
                />

                {/* Interview configuration */}
                <Route
                    path="/interview-setup"
                    element={<InterviewSetup />}
                />

                {/* Actual interview */}
                <Route
                    path="/interview/:sessionId"
                    element={<InterviewPage />}
                />

                <Route
                    path="/interview/:sessionId/report"
                    element={<InterviewReport />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;