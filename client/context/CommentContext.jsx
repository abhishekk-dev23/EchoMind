import { createContext, useContext, useState } from "react";
import api from "../src/lib/api.js";
import toast from "react-hot-toast";

const CommentContext = createContext();

export const useComment = () => {
    const context = useContext(CommentContext);
    if (!context) {
        throw new Error("useComment must be used within a CommentProvider");
    }
    return context;
};

export const CommentProvider = ({ children }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);

    // Get all comments for a blog
    const getCommentsByBlogId = async (blogId) => {
        try {
            setLoading(true);
            const response = await api.get(`/comment/${blogId}`);
            if (response.data.success) {
                const fetchedComments =
                    response.data.comments || response.data.data || [];
                setComments(fetchedComments);
                return { success: true, comments: fetchedComments };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to fetch comments";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Create a new comment
    const createComment = async (blogId, commentData) => {
        try {
            setLoading(true);
            const response = await api.post(`/comment/${blogId}`, commentData);
            if (response.data.success) {
                const newComment = response.data.comment || response.data.data;
                setComments([newComment, ...comments]);
                toast.success("Comment added successfully!");
                return { success: true, comment: newComment };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to add comment";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Update a comment
    const updateComment = async (commentId, commentData) => {
        try {
            setLoading(true);
            const response = await api.put(
                `/comment/${commentId}`,
                commentData
            );
            if (response.data.success) {
                const updatedComment =
                    response.data.comment || response.data.data;
                setComments(
                    comments.map((comment) =>
                        comment._id === commentId ? updatedComment : comment
                    )
                );
                toast.success("Comment updated successfully!");
                return { success: true, comment: updatedComment };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to update comment";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    // Delete a comment
    const deleteComment = async (commentId) => {
        try {
            setLoading(true);
            const response = await api.delete(`/comment/${commentId}`);
            if (response.data.success) {
                setComments(
                    comments.filter((comment) => comment._id !== commentId)
                );
                toast.success("Comment deleted successfully!");
                return { success: true };
            }
        } catch (error) {
            const message =
                error.response?.data?.message || "Failed to delete comment";
            toast.error(message);
            return { success: false, message };
        } finally {
            setLoading(false);
        }
    };

    const value = {
        comments,
        loading,
        getCommentsByBlogId,
        createComment,
        updateComment,
        deleteComment,
        setComments,
    };

    return (
        <CommentContext.Provider value={value}>
            {children}
        </CommentContext.Provider>
    );
};
