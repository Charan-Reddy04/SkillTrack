
import API from "./api";

export const getContests = async () => {
    const response = await API.get("/contests");
    return response.data;
};

export const createContest = async (contestData) => {
    const response = await API.post("/contests", contestData);
    return response.data;
};

export const updateContest = async (id, contestData) => {
    const response = await API.put(`/contests/${id}`, contestData);
    return response.data;
};

export const deleteContest = async (id) => {
    const response = await API.delete(`/contests/${id}`);
    return response.data;
};
