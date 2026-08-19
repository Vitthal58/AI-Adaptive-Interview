import axios from "axios";

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});


// --------------------------------
// Start interview
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
                role: role,
                topic: topic,
            },
        }
    );

    return response.data;
};


// --------------------------------
// Get interview
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
// Submit answer
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
// Get final report
// --------------------------------

export const getInterviewReport = async (
    sessionId
) => {

    const response = await API.get(
        `/interview/${sessionId}/report`
    );

    return response.data;
};