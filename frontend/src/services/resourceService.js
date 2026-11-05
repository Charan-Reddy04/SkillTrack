import API from "./api";

// Get all saved resources
export const getResources = async () => {
    const response = await API.get("/resources");
    return response.data;
};

// Add a new resource
export const createResource = async (resourceData) => {
    const response = await API.post("/resources", resourceData);
    return response.data;
};

// Update a resource
export const updateResource = async (id, resourceData) => {
    const response = await API.put(`/resources/${id}`, resourceData);
    return response.data;
};

// Delete a resource
export const deleteResource = async (id) => {
    const response = await API.delete(`/resources/${id}`);
    return response.data;
};