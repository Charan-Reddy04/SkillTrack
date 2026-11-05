import API from "./api";

const getAnalytics = async () => {
    const response = await API.get("/analytics");
    return response.data;
};

export default { getAnalytics };