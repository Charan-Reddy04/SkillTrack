
import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: "",
            trim: true
        },

        url: {
            type: String,
            required: true,
            trim: true
        },

        category: {
            type: String,
            required: true,
            trim: true
        },

        resourceType: {
            type: String,
            enum: ["Documentation", "Video", "Course", "Website", "Other"],
            default: "Website"
        },

        notes: {
            type: String,
            default: "",
            trim: true
        },

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

resourceSchema.index({ user: 1, createdAt: -1 });

const Resource = mongoose.model("Resource", resourceSchema);

export default Resource;
