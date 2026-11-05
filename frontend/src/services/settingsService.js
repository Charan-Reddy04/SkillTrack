
import API from "./api";

const updateProfile = async (profileData) => {
    const response = await API.put("/auth/profile", profileData);
    return response.data;
};

const changePassword = async (passwordData) => {
    const response = await API.put(
        "/auth/change-password",
        passwordData
    );
    return response.data;
};

const settingsService = {
    updateProfile,
    changePassword
};

export default settingsService;
