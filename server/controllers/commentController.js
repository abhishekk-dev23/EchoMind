import Comment from "../models/commentModel.js";

//comment created
export const createComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const userId = req.user._id;
        const { blogId } = req.params;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment text is required",
            });
        }
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
        }

        const saveComment = await Comment.create({
            blog: blogId,
            user: userId,
            comment,
        });

        await saveComment.populate("user", "fullName profilePic");

        res.status(201).json({
            success: true,
            comment: saveComment,
            message: "comment added successfully",
        });
    } catch (error) {
        console.error("❌ Error in createComment:", error.message);
        res.status(500).json({
            success: false,
            message: "Error in createComment function",
            error: error.message,
        });
    }
};

// delete comment
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id;

        const comment = await Comment.findById(id);

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "comment not deleted from database",
            });
        }

        if (comment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to delete this comment",
            });
        }

        await Comment.findByIdAndDelete(id);

        res.status(200).json({
            success: true,
            message: "comment deleted successfully from database",
        });
    } catch (error) {
        console.log("❌Error in deleteComment function", error.message);
        res.status(500).json({
            success: false,
            message: "Error in deleteComment function",
            error: error.message,
        });
    }
};

//update comment
export const updateComment = async (req, res) => {
    try {
        const { comment } = req.body;
        const { id } = req.params;
        const userId = req.user._id;

        if (!comment) {
            return res.status(400).json({
                success: false,
                message: "Comment text is required",
            });
        }
        const existingComment = await Comment.findById(id);

        if (!existingComment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found",
            });
        }

        // Check ownership
        if (existingComment.user.toString() !== userId.toString()) {
            return res.status(403).json({
                success: false,
                message: "Not authorized to update this comment",
            });
        }

        const updatedComment = await Comment.findByIdAndUpdate(
            id,
            { comment },
            { new: true }
        ).populate("user", "fullName profilePic");

        res.status(200).json({
            success: true,
            comment: updatedComment, // Changed from 'updatedComment' to 'comment' for consistency
            message: "comment updated successfully",
        });
    } catch (error) {
        console.log("Error in updateComment function", error.message);
        res.status(500).json({
            success: false,
            message: "Error in updateComment",
            error: error.message,
        });
    }
};

//show all comment from selected blog
export const allComment = async (req, res) => {
    try {
        const { blogId } = req.params;

        if (!blogId) {
            return res.status(400).json({
                success: false,
                message: "Blog ID missing in request params",
            });
        }

        const comments = await Comment.find({ blog: blogId })
            .populate("user", "fullName profilePic")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: comments.length,
            comments,
            message:
                comments.length > 0
                    ? "comments found successfully"
                    : "No comments yet",
        });
    } catch (error) {
        console.log("Error in allComment function", error.message);
        res.status(500).json({
            success: false,
            message: "Error in allComment function",
            error: error.message,
        });
    }
};
