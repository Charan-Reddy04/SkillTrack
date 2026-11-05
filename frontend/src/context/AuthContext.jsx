
import { createContext, useContext, useEffect, useState } from "react";
import API from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

            try {
                API.defaults.headers.common.Authorization = `Bearer ${token}`;

                const response = await API.get("/auth/profile");
                setUser(response.data.user);
            } catch (error) {
                localStorage.removeItem("token");
                delete API.defaults.headers.common.Authorization;
            }

            setLoading(false);
        };

        checkUser();
    }, []);

    const login = async (email, password) => {
        const response = await API.post("/auth/login", {
            email,
            password
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        API.defaults.headers.common.Authorization = `Bearer ${token}`;

        setUser(user);
    };

    const register = async (name, email, password) => {
        const response = await API.post("/auth/register", {
            name,
            email,
            password
        });

        const { token, user } = response.data;

        localStorage.setItem("token", token);
        API.defaults.headers.common.Authorization = `Bearer ${token}`;

        setUser(user);
    };

    const updateUser = (updatedUser) => {
        setUser(updatedUser);
    };

    const logout = () => {
        localStorage.removeItem("token");
        delete API.defaults.headers.common.Authorization;
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                updateUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
