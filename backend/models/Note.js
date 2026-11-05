
import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        subject: {
            type: String,
            required: true,
            trim: true
        },

        content: {
            type: String,
            required: true
        },

        category: {
            type: String,
            default: "General",
            trim: true
        },

        isPinned: {
            type: Boolean,
            default: false
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    { timestamps: true }
);

noteSchema.index({ user: 1, updatedAt: -1 });

const Note = mongoose.model("Note", noteSchema);

export default Note;
