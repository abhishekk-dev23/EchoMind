import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiUser, FiMail, FiImage, FiSave } from "react-icons/fi";
import Loader from "../components/Loader";

const Profile = () => {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: user?.username || "",
        fullName: user?.fullName || "",
        email: user?.email || "",
        bio: user?.bio || "",
        profilePic: user?.profilePic || "",
    });

    const [imagePreview, setImagePreview] = useState(user?.profilePic || "");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrors({ ...errors, profilePic: "Please select an image file" });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({
                ...errors,
                profilePic: "Image size should be less than 5MB",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData({ ...formData, profilePic: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const triggerImagePicker = () => {
        const input = document.getElementById("profilePic");
        if (input) input.click();
    };

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

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        const result = await updateProfile(formData);
        setLoading(false);

        if (result.success) {
            navigate("/dashboard");
        }
    };

    return (
        <div className="min-h-screen home-theme py-10 sm:py-12">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="home-theme-panel home-hero-shell p-6 sm:p-8 relative overflow-hidden">
                    <span
                        className="home-orb home-orb-one"
                        aria-hidden="true"
                    />
                    <span
                        className="home-orb home-orb-two"
                        aria-hidden="true"
                    />

                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 home-theme-title relative z-10">
                        Edit Profile
                    </h1>
                    <p className="home-theme-subtitle mb-8 relative z-10">
                        Update your personal details and account picture.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 relative z-10"
                    >
                        {/* Profile Picture */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative">
                                {imagePreview ? (
                                    <img
                                        src={imagePreview}
                                        alt="Profile"
                                        className="w-32 h-32 rounded-full object-cover border-2 border-[#b18597] shadow-[0_0_0_1px_#b18597,0_0.4em_0_0_#ffe3e2]"
                                    />
                                ) : (
                                    <div className="w-32 h-32 rounded-full bg-[#f9c4d2] flex items-center justify-center border-2 border-[#b18597] shadow-[0_0_0_1px_#b18597,0_0.4em_0_0_#ffe3e2]">
                                        <FiUser className="w-16 h-16 text-[#5a463b]" />
                                    </div>
                                )}
                                <button
                                    type="button"
                                    onClick={triggerImagePicker}
                                    className="absolute top-0 right-0 p-2 bg-[#5a463b] text-white rounded-full hover:bg-[#382b22] transition-colors border border-[#382b22] cursor-pointer"
                                    aria-label="Change profile picture"
                                >
                                    <FiImage className="w-4 h-4" />
                                </button>
                            </div>
                            <input
                                type="file"
                                id="profilePic"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                            />
                            {errors.profilePic && (
                                <p className="mt-2 text-sm text-red-500">
                                    {errors.profilePic}
                                </p>
                            )}
                        </div>

                        {/* Username */}
                        <div>
                            <label
                                htmlFor="username"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Username *
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
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

                        {/* Full Name */}
                        <div>
                            <label
                                htmlFor="fullName"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Full Name
                            </label>
                            <div className="relative">
                                <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    type="text"
                                    id="fullName"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full pl-10 pr-4 py-3 border border-[#b18597] rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]"
                                    placeholder="Ankit raj"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Email *
                            </label>
                            <div className="relative">
                                <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#8b6b79]" />
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
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

                        {/* Bio */}
                        <div>
                            <label
                                htmlFor="bio"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Bio
                            </label>
                            <textarea
                                id="bio"
                                name="bio"
                                value={formData.bio}
                                onChange={handleChange}
                                rows="4"
                                className="w-full px-4 py-3 border border-[#b18597] rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]"
                                placeholder="Tell us about yourself..."
                            />
                            <p className="mt-1 text-sm text-[#8b6b79]">
                                {formData.bio.length} / 500 characters
                            </p>
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 border border-[#b18597] bg-[#fff0f0] text-[#382b22] font-semibold py-3 rounded-xl hover:bg-[#ffe9e9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 uppercase tracking-[0.03em] cursor-pointer"
                            >
                                {loading ? (
                                    <Loader size="small" />
                                ) : (
                                    <>
                                        <FiSave /> Save Changes
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/dashboard")}
                                className="px-6 py-3 border border-[#b18597] cursor-pointer text-[#5a463b] rounded-xl hover:bg-[#fff6f6] transition-colors font-semibold uppercase tracking-[0.03em]"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
