import { createContext, useContext, useState, useEffect } from "react";
import api from "../src/lib/api.js";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check authentication status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            const response = await api.get("/check");
            if (response.data.success) {
                setUser(response.data.user);
                setIsAuthenticated(true);
            }
        } catch (error) {
            console.error("Auth check failed:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userData) => {
        try {
            const response = await api.post("/signup", userData);

            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                setIsAuthenticated(true);
                toast.success("Account created successfully!");
                return { success: true, user };
            }
        } catch (error) {
            const message = error.response?.data?.message || "Signup failed";
            toast.error(message);
            return { success: false, message };
        }
    };

    const login = async (credentials) => {
        try {
            const response = await api.post("/login", credentials);

            if (response.data.success) {
                const { token, user } = response.data;
                localStorage.setItem("token", token);
                localStorage.setItem("user", JSON.stringify(user));
                setUser(user);
                setIsAuthenticated(true);
                toast.success(
                    `Welcome back, ${user.fullName || user.username}!`
                );
                return { success: true, user };
            }
        } catch (error) {
            const message = error.response?.data?.message || "Login failed";
            toast.error(message);
            return { success: false, message };
        }
    };

    const logout = async () => {
        try {
            await api.post("/logout");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            toast.success("Logged out successfully");
            return { success: true };
        } catch (error) {
            console.error("Logout error:", error);
            // Clear local state anyway
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            setUser(null);
            setIsAuthenticated(false);
            return { success: true };
        }
    };

    const updateProfile = async (profileData) => {
        try {
            const response = await api.put("/update-profile", profileData);

            if (response.data.success) {
                const updatedUser = response.data.user;
                setUser(updatedUser);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                toast.success("Profile updated successfully!");
                return { success: true, user: updatedUser };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Profile update failed";
            toast.error(message);
            return { success: false, message };
        }
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        signup,
        login,
        logout,
        updateProfile,
        checkAuthStatus,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
