import React, { useState } from "react";
import { FiEdit2, FiTrash2, FiUser, FiSave, FiX } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const CommentItem = ({ comment: commentData, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(
        commentData.comment || "", // Backend uses 'comment' field
    );
    const isOwner =
        user?._id === commentData?.author?._id ||
        user?._id === commentData?.user?._id;

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleSave = () => {
        if (editedContent.trim()) {
            onUpdate(commentData._id, {
                comment: editedContent, // Backend expects 'comment' field
            });
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditedContent(commentData.comment || "");
        setIsEditing(false);
    };

    const commentAuthor = commentData.author || commentData.user;
    const commentContent = commentData.comment || "";

    return (
        <div className="bg-[#fff6f6] border border-[#b18597] rounded-xl p-4 mb-3 shadow-[0_0_0_1px_#b18597,0_0.25em_0_0_#ffe3e2] hover:bg-[#fff0f0] transition-colors">
            <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-3">
                    {commentAuthor?.profilePic ? (
                        <img
                            src={commentAuthor.profilePic}
                            alt={commentAuthor.username}
                            className="w-10 h-10 rounded-full object-cover border border-[#b18597]"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-[#f9c4d2] border border-[#b18597] flex items-center justify-center">
                            <FiUser className="text-[#5a463b]" />
                        </div>
                    )}
                    <div>
                        <h4 className="font-semibold text-[#382b22]">
                            {commentAuthor?.username ||
                                commentAuthor?.fullName ||
                                "Anonymous"}
                        </h4>
                        <p className="text-xs text-[#8b6b79]">
                            {formatDate(commentData.createdAt)}
                        </p>
                    </div>
                </div>

                {isOwner && !isEditing && (
                    <div className="flex gap-2">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="p-1.5 rounded-lg border border-[#b18597] bg-[#fff0f0] text-[#5a463b] hover:bg-[#f9c4d2] hover:text-[#382b22] transition-colors cursor-pointer"
                            title="Edit"
                        >
                            <FiEdit2 className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => onDelete(commentData._id)}
                            className="p-1.5 rounded-lg border border-[#8f2d2d] bg-[#b94747] text-white hover:bg-[#983737] transition-colors cursor-pointer"
                            title="Delete"
                        >
                            <FiTrash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="mt-3">
                    <textarea
                        value={editedContent}
                        onChange={(e) => setEditedContent(e.target.value)}
                        className="w-full p-3 border border-[#b18597] rounded-xl bg-white text-[#382b22] focus:ring-2 focus:ring-[#b18597]/40 focus:border-[#b18597]"
                        rows="3"
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleSave}
                            className="flex items-center gap-1 px-3 py-1.5 border border-[#b18597] bg-[#fff0f0] text-[#382b22] rounded-lg hover:bg-[#f9c4d2] transition-colors font-semibold cursor-pointer"
                        >
                            <FiSave className="w-4 h-4" />
                            Save
                        </button>
                        <button
                            onClick={handleCancel}
                            className="flex items-center gap-1 px-3 py-1.5 border border-[#b18597] bg-[#fff6f6] text-[#5a463b] rounded-lg hover:bg-[#ffe9e9] transition-colors font-semibold cursor-pointer"
                        >
                            <FiX className="w-4 h-4" />
                            Cancel
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-[#5a463b] mt-2 leading-relaxed">
                    {commentContent}
                </p>
            )}

            {commentData.updatedAt &&
                commentData.updatedAt !== commentData.createdAt && (
                    <p className="text-xs text-[#8b6b79] mt-2 italic">
                        (edited)
                    </p>
                )}
        </div>
    );
};

export default CommentItem;
