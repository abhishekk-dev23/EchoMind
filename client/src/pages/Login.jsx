import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "../components/Loader";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear error when user types
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        const result = await login(formData);
        setLoading(false);

        if (result.success) {
            navigate("/");
        }
    };

    return (
        <div className="min-h-screen home-theme flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <h2 className="text-4xl font-bold home-theme-title mb-2">
                        Welcome Back
                    </h2>
                    <p className="home-theme-subtitle">
                        Login to your account to continue
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="home-theme-panel home-hero-shell rounded-xl p-8 space-y-6 relative overflow-hidden">
                        <span
                            className="home-orb home-orb-one"
                            aria-hidden="true"
                        />
                        <span
                            className="home-orb home-orb-two"
                            aria-hidden="true"
                        />

                        {/* Email Field */}
                        <div className="relative z-10">
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${
                                        errors.email
                                            ? "border-red-500"
                                            : "border-[#b18597]"
                                    } rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]`}
                                    placeholder="ankit@gmail.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="relative z-10">
                            <label
                                htmlFor="password"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border ${
                                        errors.password
                                            ? "border-red-500"
                                            : "border-[#b18597]"
                                    } rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79] hover:text-[#5a463b] cursor-pointer"
                                >
                                    {showPassword ? <FiEyeOff /> : <FiEye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative z-10 w-full border border-[#b18597] bg-[#fff0f0] text-[#382b22] font-semibold py-3 rounded-xl hover:bg-[#ffe9e9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-[0.03em] cursor-pointer"
                        >
                            {loading ? <Loader size="small" /> : "Login"}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <p className="home-theme-subtitle">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-[#382b22] hover:text-[#8b5a72] font-semibold"
                        >
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
