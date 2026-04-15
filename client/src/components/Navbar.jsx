import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { FiMenu, FiX, FiUser, FiLogOut, FiEdit } from "react-icons/fi";

const Navbar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const profileMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                showProfileMenu &&
                profileMenuRef.current &&
                !profileMenuRef.current.contains(event.target)
            ) {
                setShowProfileMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showProfileMenu]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <nav className="nav-theme nav-animate sticky inset-x-0 z-100 ">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center min-h-20 py-2">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2">
                        <span className="text-3xl font-semibold text-gray-800 nav-logo">
                            EchoMind
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link to="/" className="nav-link-pressable">
                            <span className="nav-link-text">Home</span>
                        </Link>

                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create-blog"
                                    className="nav-link-pressable"
                                >
                                    <span className="nav-link-text inline-flex items-center gap-2">
                                        <FiEdit /> Create Blog
                                    </span>
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="nav-link-pressable"
                                >
                                    <span className="nav-link-text">
                                        Dashboard
                                    </span>
                                </Link>

                                {/* Profile Dropdown */}
                                <div className="relative" ref={profileMenuRef}>
                                    <button
                                        onClick={() =>
                                            setShowProfileMenu(!showProfileMenu)
                                        }
                                        className="nav-link-pressable cursor-pointer"
                                    >
                                        <span className="nav-link-text inline-flex items-center space-x-2">
                                            {user?.profilePic ? (
                                                <img
                                                    src={user.profilePic}
                                                    alt="Profile"
                                                    className="w-5 h-5 rounded-full object-cover"
                                                />
                                            ) : (
                                                <FiUser className="w-5 h-5" />
                                            )}
                                            <span className="font-medium nav-auth-highlight">
                                                {user?.username || ""}
                                            </span>
                                        </span>
                                    </button>

                                    {showProfileMenu && (
                                        <div className="absolute right-0 mt-3 w-52 nav-menu-panel p-2 z-50">
                                            <Link
                                                to="/profile"
                                                className="nav-menu-item"
                                                onClick={() =>
                                                    setShowProfileMenu(false)
                                                }
                                            >
                                                Profile
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    handleLogout();
                                                    setShowProfileMenu(false);
                                                }}
                                                className="nav-menu-item flex text-left  items-center gap-2 cursor-pointer"
                                            >
                                                Logout <FiLogOut />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="nav-link-pressable"
                                >
                                    <span className="nav-link-text">Login</span>
                                </Link>
                                <Link
                                    to="/signup"
                                    className="nav-link-pressable"
                                >
                                    <span className="nav-link-text">
                                        Sign Up
                                    </span>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <button
                            onClick={toggleMenu}
                            className={`p-2 nav-mobile-toggle ${
                                isOpen ? "open" : ""
                            }`}
                        >
                            {isOpen ? (
                                <FiX className="w-6 h-6" />
                            ) : (
                                <FiMenu className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isOpen && (
                    <div className="md:hidden pb-4 nav-menu-panel p-3 space-y-2 mb-3">
                        <Link
                            to="/"
                            className="nav-menu-item"
                            onClick={toggleMenu}
                        >
                            Home
                        </Link>
                        {isAuthenticated ? (
                            <>
                                <Link
                                    to="/create-blog"
                                    className="nav-menu-item"
                                    onClick={toggleMenu}
                                >
                                    Create Blog
                                </Link>
                                <Link
                                    to="/dashboard"
                                    className="nav-menu-item"
                                    onClick={toggleMenu}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/profile"
                                    className="nav-menu-item"
                                    onClick={toggleMenu}
                                >
                                    Profile
                                </Link>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        toggleMenu();
                                    }}
                                    className="nav-menu-item text-left"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="nav-menu-item"
                                    onClick={toggleMenu}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/signup"
                                    className="nav-menu-item"
                                    onClick={toggleMenu}
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
