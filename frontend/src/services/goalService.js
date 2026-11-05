
import API from "./api";

// Get all learning goals
export const getGoals = async () => {
    const response = await API.get("/goals");
    return response.data;
};

// Create a new learning goal
export const createGoal = async (goalData) => {
    const response = await API.post("/goals", goalData);
    return response.data;
};

// Update an existing learning goal
export const updateGoal = async (id, goalData) => {
    const response = await API.put(`/goals/${id}`, goalData);
    return response.data;
};

// Delete a learning goal
export const deleteGoal = async (id) => {
    const response = await API.delete(`/goals/${id}`);
    return response.data;
};
