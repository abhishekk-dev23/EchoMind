import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { useComment } from "../../context/CommentContext";
import { useAuth } from "../../context/AuthContext";
import CommentItem from "../components/CommentItem";
import Loader from "../components/Loader";
import {
    FiCalendar,
    FiUser,
    FiEdit2,
    FiTrash2,
    FiArrowLeft,
} from "react-icons/fi";

const BlogDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        currentBlog,
        getBlogById,
        deleteBlog,
        loading: blogLoading,
    } = useBlog();
    const {
        comments,
        getCommentsByBlogId,
        createComment,
        updateComment,
        deleteComment,
        loading: commentLoading,
    } = useComment();
    const { user, isAuthenticated } = useAuth();
    const [commentText, setCommentText] = useState("");
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (id) {
            window.scrollTo({ top: 0, left: 0, behavior: "auto" });
            getBlogById(id);
            getCommentsByBlogId(id);
        }
    }, [id]);

    const isOwner = user?._id === currentBlog?.author?._id;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const handleDeleteBlog = async () => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            const result = await deleteBlog(id);
            if (result.success) {
                navigate("/");
            }
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!commentText.trim()) return;

        setSubmitting(true);
        const result = await createComment(id, {
            comment: commentText, // Backend expects 'comment' field, not 'content' or 'text'
        });
        setSubmitting(false);

        if (result.success) {
            setCommentText("");
        }
    };

    const handleUpdateComment = async (commentId, data) => {
        await updateComment(commentId, data);
    };

    const handleDeleteComment = async (commentId) => {
        if (window.confirm("Are you sure you want to delete this comment?")) {
            await deleteComment(commentId);
        }
    };

    if (blogLoading && !currentBlog) {
        return <Loader fullScreen />;
    }

    if (!currentBlog) {
        return (
            <div className="min-h-screen home-theme flex items-center justify-center px-4">
                <div className="text-center home-theme-panel p-8 sm:p-10">
                    <h2 className="text-2xl sm:text-3xl font-extrabold home-theme-title mb-4">
                        Blog not found
                    </h2>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center px-5 py-2.5 border border-[#b18597] rounded-xl bg-[#fff6f6] text-[#382b22] font-semibold uppercase tracking-[0.03em] hover:bg-[#f9c4d2] transition-colors"
                    >
                        Go back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen home-theme py-10 sm:py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 mb-6 px-4 py-2 border border-[#b18597] rounded-xl bg-[#fff6f6] text-[#5a463b] hover:bg-[#f9c4d2] hover:text-[#382b22] transition-colors font-semibold cursor-pointer"
                >
                    <FiArrowLeft /> Back
                </button>

                {/* Blog Content */}
                <article className="home-theme-panel home-hero-shell rounded-xl overflow-hidden mb-8">
                    {/* Blog Image */}
                    {currentBlog.coverImage && (
                        <img
                            src={currentBlog.coverImage}
                            alt={currentBlog.title}
                            className="w-full h-96 object-cover border-b border-[#b18597]"
                        />
                    )}

                    <div className="p-8">
                        {/* Tags */}
                        {currentBlog.tags && currentBlog.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {currentBlog.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="text-sm px-3 py-1 border border-[#b18597] bg-[#f9c4d2] text-[#4a362d] rounded-full font-semibold"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Title */}
                        <h1 className="text-3xl sm:text-4xl font-extrabold home-theme-title mb-4">
                            {currentBlog.title}
                        </h1>

                        {/* Meta Info */}
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6 pb-6 border-b border-[#b18597]">
                            <div className="flex flex-wrap items-center gap-6 text-[#5a463b]">
                                <div className="flex items-center gap-2">
                                    {currentBlog.author?.profilePic ? (
                                        <img
                                            src={currentBlog.author.profilePic}
                                            alt={
                                                currentBlog.author.username ||
                                                currentBlog.author.fullName ||
                                                currentBlog.author.email ||
                                                "Author"
                                            }
                                            className="w-10 h-10 rounded-full object-cover border border-[#b18597]"
                                        />
                                    ) : (
                                        <FiUser className="w-6 h-6" />
                                    )}
                                    <span className="font-semibold">
                                        {currentBlog.author?.username ||
                                            currentBlog.author?.fullName ||
                                            currentBlog.author?.email ||
                                            "Anonymous"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <FiCalendar className="w-5 h-5" />
                                    <span>
                                        {formatDate(currentBlog.createdAt)}
                                    </span>
                                </div>
                            </div>

                            {isOwner && (
                                <div className="flex gap-2">
                                    <Link
                                        to={`/edit-blog/${currentBlog._id}`}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#b18597] bg-[#fff6f6] text-[#382b22] rounded-xl hover:bg-[#f9c4d2] transition-colors font-semibold"
                                    >
                                        <FiEdit2 /> Edit
                                    </Link>
                                    <button
                                        onClick={handleDeleteBlog}
                                        className="flex items-center gap-2 px-4 py-2 border border-[#8f2d2d] bg-[#b94747] text-white rounded-xl hover:bg-[#983737] transition-colors font-semibold cursor-pointer"
                                    >
                                        <FiTrash2 /> Delete
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="prose max-w-none">
                            <p className="text-[#5a463b] text-lg leading-relaxed whitespace-pre-wrap">
                                {currentBlog.content}
                            </p>
                        </div>
                    </div>
                </article>

                {/* Comments Section */}
                <div className="home-theme-panel rounded-xl p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl home-section-heading mb-6">
                        Comments ({comments.length})
                    </h2>

                    {/* Add Comment Form */}
                    {isAuthenticated ? (
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full p-4 border border-[#b18597] rounded-xl bg-white text-[#382b22] focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597]"
                                rows="4"
                            />
                            <button
                                type="submit"
                                disabled={submitting || !commentText.trim()}
                                className="mt-3 px-6 py-2.5 border border-[#b18597] bg-[#fff0f0] text-[#382b22] rounded-xl hover:bg-[#f9c4d2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold uppercase tracking-[0.03em]"
                            >
                                {submitting ? "Posting..." : "Post Comment"}
                            </button>
                        </form>
                    ) : (
                        <div className="mb-8 p-4 border border-[#b18597] bg-[#fff6f6] rounded-xl">
                            <p className="text-[#5a463b]">
                                Please{" "}
                                <Link
                                    to="/login"
                                    className="text-[#382b22] font-semibold underline decoration-[#b18597] hover:text-[#8b5a72]"
                                >
                                    login
                                </Link>{" "}
                                to post a comment.
                            </p>
                        </div>
                    )}

                    {/* Comments List */}
                    {commentLoading && comments.length === 0 ? (
                        <div className="flex justify-center py-8">
                            <Loader />
                        </div>
                    ) : comments.length > 0 ? (
                        <div className="space-y-4">
                            {comments.map((comment) => (
                                <CommentItem
                                    key={comment._id}
                                    comment={comment}
                                    onUpdate={handleUpdateComment}
                                    onDelete={handleDeleteComment}
                                />
                            ))}
                        </div>
                    ) : (
                        <p className="text-center text-[#5a463b] py-8 font-medium">
                            No comments yet. Be the first to comment!
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
