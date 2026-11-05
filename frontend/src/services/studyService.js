import API from "./api";

const getStudySessions = async () => {
  const response = await API.get("/study");
  return response.data;
};

const createStudySession = async (data) => {
  const response = await API.post("/study", data);
  return response.data;
};

const updateStudySession = async (id, data) => {
  const response = await API.put(`/study/${id}`, data);
  return response.data;
};

const deleteStudySession = async (id) => {
  const response = await API.delete(`/study/${id}`);
  return response.data;
};

export default {
  getStudySessions,
  createStudySession,
  updateStudySession,
  deleteStudySession
};