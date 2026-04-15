import React from "react";
import { Link } from "react-router-dom";
import {
    FiGithub,
    FiTwitter,
    FiLinkedin,
    FiMail,
    FiHeart,
} from "react-icons/fi";

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-theme mt-auto pt-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="footer-theme-panel p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-2">
                        <Link
                            to="/"
                            className="flex items-center space-x-2 mb-4"
                        >
                            <span className="text-2xl font-extrabold footer-brand">
                                EchoMind
                            </span>
                        </Link>
                        <p className="footer-copy mb-4">
                            Share your stories, connect with writers, and
                            explore amazing content from our community.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social transition-colors"
                            >
                                <FiGithub className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social transition-colors"
                            >
                                <FiTwitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="footer-social transition-colors"
                            >
                                <FiLinkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="mailto:contact@storyhub.com"
                                className="footer-social transition-colors"
                            >
                                <FiMail className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="footer-heading font-semibold mb-4">
                            Quick Links
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/"
                                    className="footer-link transition-colors"
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/"
                                    className="footer-link transition-colors"
                                >
                                    Explore Blogs
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/create-blog"
                                    className="footer-link transition-colors"
                                >
                                    Create Blog
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/dashboard"
                                    className="footer-link transition-colors"
                                >
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="footer-heading font-semibold mb-4">
                            Support
                        </h3>
                        <ul className="space-y-2">
                            <li>
                                <Link
                                    to="/login"
                                    className="footer-link transition-colors"
                                >
                                    Login
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/signup"
                                    className="footer-link transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    className="footer-link transition-colors"
                                >
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="mailto:contact@echomind.com"
                                    className="footer-link transition-colors"
                                >
                                    Contact Support
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom mt-8 pt-8 text-center">
                    <p className="flex items-center justify-center gap-1 font-semibold">
                        Made with{" "}
                        <FiHeart className="text-red-500 animate-pulse" /> by
                        Abhishek Kumar © {currentYear}
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
