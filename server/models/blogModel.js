import mongoose from "mongoose";


const blogSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, "Titile is required"],
            trim: true,
            maxlength: 150,
        },
        content: {
            type: String,
            required: [true, "Content is required"],
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        tags: {
            type: [String],
            default: [],
        },
        coverImage: {
            type: String,
            default: "",
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    {
        timestamps: true,
    }
);

const Blog = mongoose.model("Blog", blogSchema);

export default Blog;
