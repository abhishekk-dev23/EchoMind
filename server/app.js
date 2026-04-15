import express from "express";
import http from "http";
import cors from "cors";
import blogRoute from "./routes/blogRoute.js";
import { connectDB } from "./lib/db.js";
import userRouter from "./routes/userRoutes.js";
import commentRoute from "./routes/commentRoute.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middelware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

const allowedOrigins = [
    "http://localhost:5173",
];

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
    }),
);

app.get("/", (req, res) => {
    res.send("server is running....");
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        timestamp: new Date().toISOString(),
    });
});

app.use("/blog", blogRoute);
app.use("/", userRouter);
app.use("/comment", commentRoute);

// Global error handler
app.use((err, req, res, next) => {
    console.error("Global error handler:", err.stack);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || "Internal Server Error",
    });
});

const port = process.env.PORT || 5050;

// Connect to database and start server
connectDB()
    .then(() => {
        app.listen(port, () => {
            console.log("Server is starting at port " + port);
        });
    })
    .catch((error) => {
        console.error("Failed to connect to database:", error);
        process.exit(1);
    });

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    // Don't exit in production, just log
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    process.exit(1);
});

// Graceful shutdown
process.on("SIGTERM", () => {
    console.log("SIGTERM received. Shutting down gracefully...");
    process.exit(0);
});
