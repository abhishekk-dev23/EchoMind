import { createContext, useContext, useState } from "react";
import api from "../src/lib/api.js";
import toast from "react-hot-toast";

const BlogContext = createContext();

export const useBlog = () => {
    const context = useContext(BlogContext);
    if (!context) {
        throw new Error("useBlog must be used within a BlogProvider");
    }
    return context;
};

export const BlogProvider = ({ children }) => {
    const [blogs, setBlogs] = useState([]);
    const [currentBlog, setCurrentBlog] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filterTag, setFilterTag] = useState("");

    // Fetch all blogs
    const getAllBlogs = async () => {
        try {
            setLoading(true);
            const response = await api.get("/blog");
            if (response.data.success) {
                setBlogs(response.data.blogs || response.data.data || []);
                return {
                    success: true,
                    blogs: response.data.blogs || response.data.data,
                };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch blogs";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Fetch single blog by ID
    const getBlogById = async (id) => {
        try {
            setLoading(true);
            const response = await api.get(`/blog/${id}`);
            if (response.data.success) {
                setCurrentBlog(response.data.blog || response.data.data);
                return {
                    success: true,
                    blog: response.data.blog || response.data.data,
                };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch blog";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Create new blog
    const createBlog = async (blogData) => {
        try {
            setLoading(true);
            const response = await api.post("/blog/create", blogData);
            if (response.data.success) {
                const newBlog = response.data.blog || response.data.data;
                setBlogs([newBlog, ...blogs]);
                toast.success("Blog created successfully!");
                return { success: true, blog: newBlog };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to create blog";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Update blog
    const updateBlog = async (id, blogData) => {
        try {
            setLoading(true);
            const response = await api.put(`/blog/${id}`, blogData);
            if (response.data.success) {
                const updatedBlog = response.data.blog || response.data.data;
                setBlogs(
                    blogs.map((blog) => (blog._id === id ? updatedBlog : blog))
                );
                if (currentBlog?._id === id) {
                    setCurrentBlog(updatedBlog);
                }
                toast.success("Blog updated successfully!");
                return { success: true, blog: updatedBlog };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to update blog";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Delete blog
    const deleteBlog = async (id) => {
        try {
            setLoading(true);
            const response = await api.delete(`/blog/${id}`);
            if (response.data.success) {
                setBlogs(blogs.filter((blog) => blog._id !== id));
                if (currentBlog?._id === id) {
                    setCurrentBlog(null);
                }
                toast.success("Blog deleted successfully!");
                return { success: true };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to delete blog";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Filter blogs based on search and tags
    const getFilteredBlogs = () => {
        let filtered = [...blogs];

        if (searchQuery) {
            filtered = filtered.filter(
                (blog) =>
                    blog.title
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    blog.content
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    (
                        blog.author?.username ||
                        blog.author?.fullName ||
                        blog.author?.email
                    )
                        ?.toLowerCase()
                        .includes(searchQuery.toLowerCase())
            );
        }

        if (filterTag) {
            filtered = filtered.filter((blog) =>
                blog.tags?.some(
                    (tag) => tag.toLowerCase() === filterTag.toLowerCase()
                )
            );
        }

        return filtered;
    };

    const value = {
        blogs,
        currentBlog,
        loading,
        searchQuery,
        filterTag,
        setSearchQuery,
        setFilterTag,
        getAllBlogs,
        getBlogById,
        createBlog,
        updateBlog,
        deleteBlog,
        getFilteredBlogs,
        setCurrentBlog,
    };

    return (
        <BlogContext.Provider value={value}>{children}</BlogContext.Provider>
    );
};
