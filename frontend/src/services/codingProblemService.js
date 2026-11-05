
import API from "./api";

// Get all coding problems
export const getCodingProblems = async () => {
    const response = await API.get("/coding-problems");
    return response.data;
};

// Add a coding problem
export const createCodingProblem = async (problemData) => {
    const response = await API.post(
        "/coding-problems",
        problemData
    );

    return response.data;
};

// Update a coding problem
export const updateCodingProblem = async (id, problemData) => {
    const response = await API.put(
        `/coding-problems/${id}`,
        problemData
    );

    return response.data;
};

// Delete a coding problem
export const deleteCodingProblem = async (id) => {
    const response = await API.delete(
        `/coding-problems/${id}`
    );

    return response.data;
};
