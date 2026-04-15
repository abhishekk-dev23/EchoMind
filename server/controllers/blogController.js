import cloudinary from "../lib/cloudinary.js";
import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";

export const createBlog = async (req, res) => {
    try {
        const { title, content, tags, coverImage, likes } = req.body;
        const authorId = req.user._id;

        const author = await User.findById(authorId);

        if (!author) {
            return res.status(404).json({
                success: false,
                message: "user not found",
            });
        }

        if (!title || !content) {
            return res.status(404).json({
                success: false,
                message: "Required fields are missing (title, content)",
            });
        }

        let processedTags = [];
        if (typeof tags === "string") {
            processedTags = tags.split(",").map((tag) => tag.trim());
        } else if (Array.isArray(tags)) {
            processedTags = tags;
        }

        let Image = "";
        if (coverImage) {
            const uploadImage = await cloudinary.uploader.upload(coverImage);
            Image = uploadImage.secure_url;
        }
        const newBlog = await Blog.create({
            title,
            content,
            author: authorId, // Store the user ObjectId, not fullName
            tags: processedTags,
            coverImage: Image,
            likes: likes || 0,
        });

        // Populate the author details before sending response
        await newBlog.populate("author", "fullName profilePic email username");

        res.status(201).json({
            success: true,
            blog: newBlog,
            message: "Blog is created successfully",
        });
    } catch (error) {
        console.log("❌ Error in createBlog:", error.message);
        res.status(500).json({
            success: false,
            message: "Error in createBlog function",
            error: error.message,
        });
    }
};

export const showAllBlog = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("author", "fullName profilePic email username")
            .sort({ createdAt: -1 });

        if (blogs.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No blogs found in the database",
            });
        }
        res.status(200).json({
            success: true,
            count: blogs.length,
            blogs,
            message: "Blogs fetched successfully",
        });
    } catch (error) {
        console.error("❌ Error in showAllBlog:", error.message);
        res.status(500).json({
            success: false,
            message: "Error in showAllBlog function",
            error: error.message,
        });
    }
};

export const showBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const findBlog = await Blog.findById(id).populate(
            "author",
            "fullName profilePic email username"
        );
        if (!findBlog) {
            return res.status(404).json({
                success: false,
                message: "blog doesn't exist in database",
            });
        }
        res.status(200).json({
            success: true,
            blog: findBlog,
            message: "blog found in database",
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.message,
        });
    }
};

export const deleteBlog = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const blog = await Blog.findById(id);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog doesn't exist in database",
            });
        }

        // Check if user is the author
        if (blog.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this blog",
            });
        }

        await Blog.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "Blog deleted successfully",
        });
    } catch (error) {
        console.log("❌ Error in deleteBlog:", error.message);
        res.status(500).json({
            success: false,
            message: "Error in deleteBlog function",
            error: error.message,
        });
    }
};

export const updateBlog = async (req, res) => {
    try {
        const { title, content, tags, likes, coverImage } = req.body;
        const { id } = req.params;
        const userId = req.user._id;

        if (!title || !content) {
            return res.status(400).json({
                success: false,
                message: "required filed is missing (title, content)",
            });
        }

        // Check if blog exists and user is the author
        const existingBlog = await Blog.findById(id);
        if (!existingBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found in database",
            });
        }

        if (existingBlog.author.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this blog",
            });
        }

        // Process tags if provided
        let processedTags = tags;
        if (typeof tags === "string") {
            processedTags = tags.split(",").map((tag) => tag.trim());
        }

        const updatedField = {
            title,
            content,
            tags: processedTags,
            likes,
        };

        // Handle cover image update
        if (coverImage) {
            const uploadImage = await cloudinary.uploader.upload(coverImage);
            updatedField.coverImage = uploadImage.secure_url;
        }

        const updatedBlog = await Blog.findByIdAndUpdate(id, updatedField, {
            new: true,
            runValidators: true,
        }).populate("author", "fullName profilePic email username");

        if (!updatedBlog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found in database",
            });
        }

        res.status(200).json({
            success: true,
            message: "Blog updated successfully",
            blog: updatedBlog,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: error.message,
            error: error.message,
        });
    }
};

export const addComment = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { comment } = req.body;
        const userId = req.user._id;

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({ message: "blog not found" });
        }

        const newComment = await Comment.create({
            blog: blogId,
            user: userId,
            comment,
        });

        res.status(201).json({ success: true, comment: newComment });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
