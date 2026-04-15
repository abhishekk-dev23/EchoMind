import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff } from "react-icons/fi";
import Loader from "../components/Loader";

const Signup = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        fullName: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { signup } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username.trim()) {
            newErrors.username = "Username is required";
        } else if (formData.username.length < 3) {
            newErrors.username = "Username must be at least 3 characters";
        }

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

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
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
        const signupData = { ...formData };
        delete signupData.confirmPassword;
        const result = await signup(signupData);
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
                        Create Account
                    </h2>
                    <p className="home-theme-subtitle">
                        Join EchoMind and start sharing your stories
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

                        {/* Username Field */}
                        <div className="relative z-10">
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Username
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-4 py-3 border ${
                                        errors.username
                                            ? "border-red-500"
                                            : "border-[#b18597]"
                                    } rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]`}
                                    placeholder="Ankit raj"
                                />
                            </div>
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.username}
                                </p>
                            )}
                        </div>

                        {/* Full Name Field */}
                        <div className="relative z-10">
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Full Name (Optional)
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    id="fullName"
                                    name="fullName"
                                    type="text"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-[#b18597] rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]"
                                    placeholder="Ankit raj"
                                />
                            </div>
                        </div>

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

                        {/* Confirm Password Field */}
                        <div className="relative z-10">
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Confirm Password
                            </label>
                            <div className="relative">
                                <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className={`w-full pl-10 pr-12 py-3 border ${
                                        errors.confirmPassword
                                            ? "border-red-500"
                                            : "border-[#b18597]"
                                    } rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]`}
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword,
                                        )
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79] hover:text-[#5a463b] cursor-pointer"
                                >
                                    {showConfirmPassword ? (
                                        <FiEyeOff />
                                    ) : (
                                        <FiEye />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="relative z-10 w-full border border-[#b18597] bg-[#fff0f0] text-[#382b22] font-semibold py-3 rounded-xl hover:bg-[#ffe9e9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-[0.03em] cursor-pointer"
                        >
                            {loading ? (
                                <Loader size="small" />
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <div className="text-center">
                    <p className="home-theme-subtitle">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="text-[#382b22] hover:text-[#8b5a72] font-semibold"
                        >
                            Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
