import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const API = axios.create({
    baseURL: `${API_BASE_URL}/api`,
});


// --------------------------------
// Upload Resume
// --------------------------------

export const uploadResume = async (formData) => {

    const response = await API.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};


// --------------------------------
// Analyze Resume
// --------------------------------

export const analyzeResume = async (
    candidateId
) => {

    const response = await API.post(
        `/resume/analyze/${candidateId}`
    );

    return response.data;
};


// --------------------------------
// Start Interview
// --------------------------------

export const startInterview = async (
    candidateId,
    role,
    topic
) => {

    const response = await API.post(
        "/interview/start",
        null,
        {
            params: {
                candidate_id: candidateId,
                role,
                topic,
            },
        }
    );

    return response.data;
};


// --------------------------------
// Submit Answer
// --------------------------------

export const submitAnswer = async (
    sessionId,
    questionId,
    answer
) => {

    const response = await API.post(
        `/interview/${sessionId}/answer`,
        {
            question_id: questionId,
            answer: answer,
        }
    );

    return response.data;
};


// --------------------------------
// Get Interview
// --------------------------------

export const getInterview = async (
    sessionId
) => {

    const response = await API.get(
        `/interview/${sessionId}`
    );

    return response.data;
};


// --------------------------------
// Get Final Interview Report
// --------------------------------

export const getInterviewReport = async (sessionId) => {
    const response = await API.get(
        `/interview/${sessionId}/report`
    );

    return response.data;
};


// --------------------------------
// Default Axios Instance
// --------------------------------

export default API;