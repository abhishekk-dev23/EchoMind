import axios from "axios";

// Create axios instance with default config
const api = axios.create({
    baseURL:
        import.meta.env.VITE_API_URL ||
        (window.location.hostname === "localhost"
            ? "http://localhost:5050"
            : "https://echomind-backend-0ann.onrender.com"),
    withCredentials: true, // Important for cookies
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add token from localStorage if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Check if the request was for a protected route
            const url = error.config?.url || '';
            const method = error.config?.method || '';
            
            // Public routes that shouldn't redirect on 401
            const publicRoutes = [
                '/blog',
                '/comment/',
            ];
            
            // Check if it's a public GET request
            const isPublicRoute = method === 'get' && publicRoutes.some(route => url.includes(route));
            
            if (!isPublicRoute) {
                // Clear auth state on 401 for protected routes
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                // Redirect to login only if not already on public pages
                const publicPages = ['/login', '/signup', '/', '/blog/'];
                const currentPath = window.location.pathname;
                const isOnPublicPage = publicPages.some(page => currentPath === page || currentPath.startsWith('/blog/'));
                
                if (!isOnPublicPage) {
                    window.location.href = "/login";
                }
            }
        }
        return Promise.reject(error);
    }
);

export default api;
