import API from "./api";

const getSubjects = async () => {
  const response = await API.get("/assessments/subjects");
  return response.data;
};

const getQuiz = async (subject) => {
  const response = await API.get(
    `/assessments/quiz/${encodeURIComponent(subject)}`
  );
  return response.data;
};

const submitAssessment = async (data) => {
  const response = await API.post("/assessments/submit", data);
  return response.data;
};

const getAssessmentHistory = async () => {
  const response = await API.get("/assessments/history");
  return response.data;
};

export default {
  getSubjects,
  getQuiz,
  submitAssessment,
  getAssessmentHistory
};