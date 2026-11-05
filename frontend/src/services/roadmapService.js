
import API from "./api";

export const getRoadmaps = async () => {
    const response = await API.get("/roadmaps");
    return response.data;
};

export const createRoadmap = async (data) => {
    const response = await API.post("/roadmaps", data);
    return response.data;
};

export const getRoadmapById = async (id) => {
    const response = await API.get(`/roadmaps/${id}`);
    return response.data;
};

export const addRoadmapStep = async (id, data) => {
    const response = await API.post(`/roadmaps/${id}/steps`, data);
    return response.data;
};

export const updateRoadmapStep = async (id, stepId, data) => {
    const response = await API.put(
        `/roadmaps/${id}/steps/${stepId}`,
        data
    );
    return response.data;
};

export const deleteRoadmapStep = async (id, stepId) => {
    const response = await API.delete(
        `/roadmaps/${id}/steps/${stepId}`
    );
    return response.data;
};

export const deleteRoadmap = async (id) => {
    const response = await API.delete(`/roadmaps/${id}`);
    return response.data;
};
