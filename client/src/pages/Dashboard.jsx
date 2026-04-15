import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import { FiPlus, FiBook, FiUser } from "react-icons/fi";

const Dashboard = () => {
    const { blogs, getAllBlogs, deleteBlog, loading } = useBlog();
    const { user } = useAuth();

    useEffect(() => {
        getAllBlogs();
    }, []);

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            await deleteBlog(blogId);
        }
    };

    // Filter blogs created by current user
    const userBlogs = blogs.filter((blog) => blog.author?._id === user?._id);

    return (
        <div className="min-h-screen py-10 sm:py-12 bg-[radial-gradient(circle_at_10%_8%,#fff6f4_0%,#fff0f0_42%,#fff7f6_100%)]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8 border border-[#b18597] rounded-xl bg-[#fff0f0] shadow-[0_0_0_1px_#b18597,0_0.5em_0_0_#ffe3e2] px-6 py-8 sm:px-8 sm:py-10 relative overflow-hidden">
                    <span
                        aria-hidden="true"
                        className="absolute -top-8 -left-8 h-28 w-28 rounded-full border border-[#b18597] bg-[radial-gradient(circle_at_30%_30%,#ffe7ec_0%,#f9c4d2_75%)] opacity-45"
                    />
                    <span
                        aria-hidden="true"
                        className="absolute -bottom-12 -right-10 h-40 w-40 rounded-full border border-[#b18597] bg-[radial-gradient(circle_at_30%_30%,#ffe7ec_0%,#f9c4d2_75%)] opacity-40"
                    />

                    <h1
                        className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-2 uppercase tracking-[0.04em] text-[#382b22] relative z-10"
                        style={{ fontFamily: "var(--font-heading)" }}
                    >
                        My Dashboard
                    </h1>
                    <p className="text-[#5a463b] text-base sm:text-lg relative z-10">
                        Manage your blogs and profile
                    </p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="rounded-xl p-6 border border-[#b18597] bg-[#fff6f6] shadow-[0_0_0_1px_#b18597,0_0.4em_0_0_#ffe3e2]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#8b6b79] text-xs sm:text-sm uppercase tracking-[0.08em] font-bold">
                                    Total Blogs
                                </p>
                                <p className="text-3xl font-extrabold text-[#382b22] mt-1">
                                    {userBlogs.length}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-[#b18597] bg-[#f9c4d2]">
                                <FiBook className="w-7 h-7 text-[#5a463b]" />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl p-6 border border-[#b18597] bg-[#fff6f6] shadow-[0_0_0_1px_#b18597,0_0.4em_0_0_#ffe3e2]">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[#8b6b79] text-xs sm:text-sm uppercase tracking-[0.08em] font-bold">
                                    Profile Views
                                </p>
                                <p className="text-3xl font-extrabold text-[#382b22] mt-1">
                                    {user?.views || 0}
                                </p>
                            </div>
                            <div className="p-3 rounded-lg border border-[#b18597] bg-[#f9c4d2]">
                                <FiUser className="w-7 h-7 text-[#5a463b]" />
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/create-blog"
                        className="rounded-xl p-6 border border-[#b18597] bg-[#fff0f0] text-[#382b22] shadow-[0_0_0_1px_#b18597,0_0.4em_0_0_#ffe3e2] flex items-center justify-center gap-3 hover:bg-[#ffe9e9] hover:translate-y-0.5 transition-all duration-200 group"
                    >
                        <FiPlus className="w-8 h-8 group-hover:rotate-90 transition-transform duration-300" />
                        <span className="text-lg sm:text-xl font-bold uppercase tracking-[0.03em]">
                            Create New Blog
                        </span>
                    </Link>
                </div>

                {/* Profile Section */}
                <div className="rounded-xl border border-[#b18597] bg-[#fff0f0] shadow-[0_0_0_1px_#b18597,0_0.5em_0_0_#ffe3e2] p-6 sm:p-7 mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4 sm:gap-5">
                            {user?.profilePic ? (
                                <img
                                    src={user.profilePic}
                                    alt={user.username}
                                    className="w-20 h-20 rounded-full object-cover border border-[#b18597]"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full border border-[#b18597] bg-[#f9c4d2] flex items-center justify-center">
                                    <FiUser className="w-10 h-10 text-[#5a463b]" />
                                </div>
                            )}
                            <div>
                                <h2
                                    className="text-2xl sm:text-3xl font-extrabold text-[#382b22]"
                                    style={{
                                        fontFamily: "var(--font-heading)",
                                    }}
                                >
                                    {user?.fullName || user?.username}
                                </h2>
                                <p className="text-[#7c5a68] font-semibold">
                                    @{user?.username}
                                </p>
                                <p className="text-[#5a463b] mt-1">
                                    {user?.email}
                                </p>
                            </div>
                        </div>
                        <Link
                            to="/profile"
                            className="inline-flex items-center justify-center px-6 py-2.5 border border-[#b18597] rounded-xl bg-[#fff6f6] text-[#382b22] font-semibold uppercase tracking-[0.03em] hover:bg-[#f9c4d2] transition-colors"
                        >
                            Edit Profile
                        </Link>
                    </div>
                    {user?.bio && (
                        <p className="mt-5 text-[#5a463b] leading-relaxed">
                            {user.bio}
                        </p>
                    )}
                </div>

                {/* My Blogs Section */}
                <div>
                    <div className="mb-6 flex items-center gap-3 flex-wrap">
                        <h2
                            className="text-2xl sm:text-3xl font-extrabold uppercase tracking-[0.04em] text-[#382b22]"
                            style={{ fontFamily: "var(--font-heading)" }}
                        >
                            My Blogs
                        </h2>
                        <span className="rounded-full border border-[#b18597] bg-[#fff6f6] px-3 py-1 text-xs sm:text-sm font-bold uppercase tracking-[0.06em] text-[#5a463b]">
                            {userBlogs.length} Posts
                        </span>
                    </div>

                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader size="large" />
                        </div>
                    ) : userBlogs.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {userBlogs.map((blog) => (
                                <BlogCard
                                    key={blog._id}
                                    blog={blog}
                                    onDelete={handleDeleteBlog}
                                    showActions={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 sm:py-20 rounded-xl border border-[#b18597] bg-[#fff0f0] shadow-[0_0_0_1px_#b18597,0_0.5em_0_0_#ffe3e2]">
                            <FiBook className="w-14 h-14 text-[#8b6b79] mx-auto mb-4" />
                            <p className="text-[#5a463b] text-lg sm:text-xl mb-5 font-semibold">
                                You haven't created any blogs yet
                            </p>
                            <Link
                                to="/create-blog"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[#b18597] bg-[#fff6f6] rounded-xl text-[#382b22] font-semibold uppercase tracking-[0.03em] hover:bg-[#f9c4d2] transition-colors"
                            >
                                <FiPlus /> Create Your First Blog
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
