import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { FiImage, FiX } from "react-icons/fi";
import Loader from "../components/Loader";

const EditBlog = () => {
    const { id } = useParams();
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        tags: "",
        image: "",
    });
    const [imagePreview, setImagePreview] = useState("");
    const [errors, setErrors] = useState({});
    const [initialLoad, setInitialLoad] = useState(true);

    const { currentBlog, getBlogById, updateBlog, loading } = useBlog();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            getBlogById(id);
        }
    }, [id]);

    useEffect(() => {
        if (currentBlog && initialLoad) {
            setFormData({
                title: currentBlog.title || "",
                content: currentBlog.content || "",
                tags: currentBlog.tags?.join(", ") || "",
                image: currentBlog.coverImage || "", // Use coverImage from backend
            });
            setImagePreview(currentBlog.coverImage || "");
            setInitialLoad(false);
        }
    }, [currentBlog, initialLoad]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: "" });
        }
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setErrors({ ...errors, image: "Please select an image file" });
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setErrors({
                ...errors,
                image: "Image size should be less than 5MB",
            });
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result);
            setFormData({ ...formData, image: reader.result });
        };
        reader.readAsDataURL(file);
    };

    const removeImage = () => {
        setImagePreview("");
        setFormData({ ...formData, image: "" });
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Title is required";
        } else if (formData.title.length < 5) {
            newErrors.title = "Title must be at least 5 characters";
        }

        if (!formData.content.trim()) {
            newErrors.content = "Content is required";
        } else if (formData.content.length < 50) {
            newErrors.content = "Content must be at least 50 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const tagsArray = formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter((tag) => tag);

        const blogData = {
            title: formData.title,
            content: formData.content,
            tags: tagsArray,
            coverImage: formData.image, // Backend expects 'coverImage', not 'image'
        };

        const result = await updateBlog(id, blogData);

        if (result.success) {
            navigate(`/blog/${id}`);
        }
    };

    if (loading && initialLoad) {
        return <Loader fullScreen />;
    }

    return (
        <div className="min-h-screen home-theme py-10 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="home-theme-panel home-hero-shell rounded-xl p-6 sm:p-8 relative overflow-hidden">
                    <span
                        className="home-orb home-orb-one"
                        aria-hidden="true"
                    />
                    <span
                        className="home-orb home-orb-two"
                        aria-hidden="true"
                    />

                    <h1 className="text-3xl sm:text-4xl font-extrabold mb-2 home-theme-title relative z-10">
                        Edit Blog
                    </h1>
                    <p className="home-theme-subtitle mb-8 relative z-10">
                        Refine your draft and republish it with updated details.
                    </p>

                    <form
                        onSubmit={handleSubmit}
                        className="space-y-6 relative z-10"
                    >
                        {/* Title */}
                        <div>
                            <label
                                htmlFor="title"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Title *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                className={`w-full px-4 py-3 border ${
                                    errors.title
                                        ? "border-red-500"
                                        : "border-[#b18597]"
                                } rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]`}
                                placeholder="Enter your blog title"
                            />
                            {errors.title && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Content */}
                        <div>
                            <label
                                htmlFor="content"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Content *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                value={formData.content}
                                onChange={handleChange}
                                rows="12"
                                className={`w-full px-4 py-3 border ${
                                    errors.content
                                        ? "border-red-500"
                                        : "border-[#b18597]"
                                } rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]`}
                                placeholder="Write your blog content here..."
                            />
                            {errors.content && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.content}
                                </p>
                            )}
                            <p className="mt-1 text-sm text-[#8b6b79]">
                                {formData.content.length} characters
                            </p>
                        </div>

                        {/* Tags */}
                        <div>
                            <label
                                htmlFor="tags"
                                className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]"
                            >
                                Tags (Optional)
                            </label>
                            <input
                                type="text"
                                id="tags"
                                name="tags"
                                value={formData.tags}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-[#b18597] rounded-xl focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597] bg-white text-[#382b22] placeholder:text-[#8b6b79]"
                                placeholder="technology, coding, javascript (comma separated)"
                            />
                            <p className="mt-1 text-sm text-[#8b6b79]">
                                Separate tags with commas
                            </p>
                        </div>

                        {/* Image Upload */}
                        <div>
                            <label className="block text-sm font-semibold text-[#4a362d] mb-2 uppercase tracking-[0.03em]">
                                Cover Image (Optional)
                            </label>

                            {imagePreview ? (
                                <div className="relative">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover rounded-xl border border-[#b18597]"
                                    />
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute top-2 right-2 p-2 bg-[#b94747] text-white rounded-full hover:bg-[#983737] transition-colors border border-[#8f2d2d] cursor-pointer"
                                    >
                                        <FiX />
                                    </button>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-[#b18597] rounded-xl p-8 text-center bg-white/80">
                                    <FiImage className="mx-auto w-12 h-12 text-[#8b6b79] mb-4" />
                                    <label
                                        htmlFor="image"
                                        className="cursor-pointer text-[#5a463b] hover:text-[#382b22] font-semibold uppercase tracking-[0.03em]"
                                    >
                                        Click to upload
                                    </label>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                    <p className="mt-2 text-sm text-[#8b6b79]">
                                        PNG, JPG, GIF up to 5MB
                                    </p>
                                </div>
                            )}
                            {errors.image && (
                                <p className="mt-1 text-sm text-red-500">
                                    {errors.image}
                                </p>
                            )}
                        </div>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 border border-[#b18597] bg-[#fff0f0] text-[#382b22] font-semibold py-3 rounded-xl hover:bg-[#ffe9e9] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center uppercase tracking-[0.03em] cursor-pointer"
                            >
                                {loading ? (
                                    <Loader size="small" />
                                ) : (
                                    "Update Blog"
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="px-6 py-3 border border-[#b18597] text-[#5a463b] rounded-xl hover:bg-[#fff6f6] transition-colors font-semibold uppercase tracking-[0.03em] cursor-pointer"
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

export default EditBlog;
