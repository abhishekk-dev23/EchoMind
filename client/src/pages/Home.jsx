import React, { useEffect, useState } from "react";
import { useBlog } from "../../context/BlogContext";
import { useAuth } from "../../context/AuthContext";
import BlogCard from "../components/BlogCard";
import Loader from "../components/Loader";
import { FiSearch, FiFilter } from "react-icons/fi";

const Home = () => {
    const {
        blogs,
        getAllBlogs,
        loading,
        searchQuery,
        setSearchQuery,
        filterTag,
        setFilterTag,
        getFilteredBlogs,
        deleteBlog,
    } = useBlog();
    const { isAuthenticated } = useAuth();
    const [localSearch, setLocalSearch] = useState("");

    useEffect(() => {
        getAllBlogs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        setSearchQuery(localSearch);
    };

    const handleDeleteBlog = async (blogId) => {
        if (window.confirm("Are you sure you want to delete this blog?")) {
            await deleteBlog(blogId);
        }
    };

    const formatTagLabel = (tag) => String(tag || "").replace(/^#+/, "");

    const filteredBlogs = getFilteredBlogs();
    const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];
    const heroTitle = "Welcome To EchoMind";

    return (
        <div className="min-h-screen home-theme py-10 sm:py-12">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="home-theme-panel home-hero-shell px-6 py-10 sm:px-10 sm:py-12 text-center">
                    <span
                        className="home-orb home-orb-one"
                        aria-hidden="true"
                    />
                    <span
                        className="home-orb home-orb-two"
                        aria-hidden="true"
                    />
                    <span
                        className="home-orb home-orb-three"
                        aria-hidden="true"
                    />

                    <h1
                        className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 home-theme-title home-title-stagger relative z-10"
                        aria-label={heroTitle}
                    >
                        {Array.from(heroTitle).map((char, index) => (
                            <span
                                key={`${char}-${index}`}
                                className="home-title-char"
                                style={{ "--char-index": index }}
                                aria-hidden="true"
                            >
                                {char === " " ? "\u00A0" : char}
                            </span>
                        ))}
                    </h1>
                    <p className="text-base sm:text-xl mb-8 home-theme-subtitle max-w-2xl mx-auto relative z-10">
                        Discover amazing stories from writers around the world
                        in a cozy paper-and-press visual style.
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-8 relative z-10">
                        <div className="home-stat-pill">
                            <p className="home-stat-label">Total Blogs</p>
                            <p className="home-stat-value">{blogs.length}</p>
                        </div>
                        <div className="home-stat-pill">
                            <p className="home-stat-label">Unique Tags</p>
                            <p className="home-stat-value">{allTags.length}</p>
                        </div>
                        <div className="home-stat-pill">
                            <p className="home-stat-label">Showing</p>
                            <p className="home-stat-value">
                                {filteredBlogs.length}
                            </p>
                        </div>
                    </div>

                    {/* Search Bar */}
                    <form
                        onSubmit={handleSearch}
                        className="max-w-3xl mx-auto space-y-6 relative z-10"
                    >
                        <div className="home-search-wrap">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8b6b79] w-5 h-5" />
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search blogs by title, content, or author..."
                                className="home-search-input"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-5 pb-3">
                            <button type="submit" className="home-pressable">
                                <span className="home-pressable-text">
                                    Search Blogs
                                </span>
                            </button>
                            <button
                                type="button"
                                className="home-pressable"
                                onClick={() => {
                                    setLocalSearch("");
                                    setSearchQuery("");
                                    setFilterTag("");
                                }}
                            >
                                <span className="home-pressable-text">
                                    Reset Filters
                                </span>
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Filter Section */}
                <div className="mb-8 home-theme-panel p-6 sm:p-7">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <FiFilter className="text-[#5a463b]" />
                        <span className="home-theme-subtitle font-semibold uppercase tracking-wide text-sm">
                            Filter by tag
                        </span>
                        {filterTag && (
                            <span className="home-active-filter">
                                Active: {formatTagLabel(filterTag)}
                            </span>
                        )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterTag("")}
                            className={`home-chip ${
                                filterTag === "" ? "active" : ""
                            }`}
                        >
                            All
                        </button>
                        {allTags.slice(0, 10).map((tag, index) => (
                            <button
                                key={index}
                                onClick={() => setFilterTag(tag)}
                                className={`home-chip ${
                                    filterTag === tag ? "active" : ""
                                }`}
                            >
                                {formatTagLabel(tag)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="mb-6 ">
                    <h2 className="home-section-heading">Latest Stories</h2>
                </div>

                {/* Blog Grid */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader size="large" />
                    </div>
                ) : filteredBlogs.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredBlogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                blog={blog}
                                onDelete={handleDeleteBlog}
                                showActions={isAuthenticated}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 home-theme-panel space-y-5">
                        <p className="home-theme-subtitle text-xl font-semibold">
                            {searchQuery || filterTag
                                ? "No blogs found matching your criteria"
                                : "No blogs available yet. Be the first to create one!"}
                        </p>
                        <button
                            type="button"
                            className="home-pressable"
                            onClick={() => {
                                setLocalSearch("");
                                setSearchQuery("");
                                setFilterTag("");
                            }}
                        >
                            <span className="home-pressable-text">
                                Show All Blogs
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
