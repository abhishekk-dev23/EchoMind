import express from "express";
import { createBlog, deleteBlog, showAllBlog, showBlog, updateBlog } from "../controllers/blogController.js";
import { protectRoute } from "../middleware/auth.js";

const blogRouter = express.Router();

// Public routes - anyone can read blogs
blogRouter.get('/', showAllBlog);
blogRouter.get('/:id', showBlog);

// Protected routes - require authentication
blogRouter.post('/create', protectRoute, createBlog);
blogRouter.put('/:id', protectRoute, updateBlog);
blogRouter.delete('/:id', protectRoute, deleteBlog);

export default blogRouter;
