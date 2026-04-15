import {
    BrowserRouter as Router,
    Routes,
    Route,
    useLocation,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider } from "../context/AuthContext";
import { BlogProvider } from "../context/BlogContext";
import { CommentProvider } from "../context/CommentContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import EditBlog from "./pages/EditBlog";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";

const AppContent = () => {
    const { pathname } = useLocation();
    const hideLayout = pathname === "/login" || pathname === "/signup";

    return (
        <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900">
            {!hideLayout && <Navbar />}
            <main className="grow">
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />

                    {/* Protected Routes */}
                    <Route
                        path="/create-blog"
                        element={
                            <ProtectedRoute>
                                <CreateBlog />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/edit-blog/:id"
                        element={
                            <ProtectedRoute>
                                <EditBlog />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/dashboard"
                        element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />

                    {/* 404 Route */}
                    <Route
                        path="*"
                        element={
                            <div className="min-h-screen flex items-center justify-center">
                                <div className="text-center">
                                    <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                                        404
                                    </h1>
                                    <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                                        Page not found
                                    </p>
                                    <a
                                        href="/"
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors inline-block"
                                    >
                                        Go Home
                                    </a>
                                </div>
                            </div>
                        }
                    />
                </Routes>
            </main>
            {!hideLayout && <Footer />}
        </div>
    );
};

const App = () => {
    return (
        <Router>
            <AuthProvider>
                <BlogProvider>
                    <CommentProvider>
                        <AppContent />

                        {/* Toast Notifications */}
                        <Toaster
                            position="top-right"
                            toastOptions={{
                                duration: 3000,
                                style: {
                                    background: "#363636",
                                    color: "#fff",
                                },
                                success: {
                                    duration: 3000,
                                    iconTheme: {
                                        primary: "#10b981",
                                        secondary: "#fff",
                                    },
                                },
                                error: {
                                    duration: 4000,
                                    iconTheme: {
                                        primary: "#ef4444",
                                        secondary: "#fff",
                                    },
                                },
                            }}
                        />
                    </CommentProvider>
                </BlogProvider>
            </AuthProvider>
        </Router>
    );
};

export default App;
