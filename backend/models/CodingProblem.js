
import mongoose from "mongoose";

const codingProblemSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        problemUrl: {
            type: String,
            required: true,
            trim: true
        },

        platform: {
            type: String,
            required: true,
            enum: [
                "LeetCode",
                "HackerRank",
                "CodeChef",
                "Codeforces",
                "GeeksforGeeks",
                "Other"
            ]
        },

        topic: {
            type: String,
            required: true,
            trim: true
        },

        difficulty: {
            type: String,
            enum: ["Easy", "Medium", "Hard"],
            default: "Easy"
        },

        status: {
            type: String,
            enum: ["Not Started", "Attempted", "Solved"],
            default: "Not Started"
        },

        timeTaken: {
            type: Number,
            default: 0,
            min: 0
        },

        notes: {
            type: String,
            trim: true,
            default: ""
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

codingProblemSchema.index({ user: 1, createdAt: -1 });

const CodingProblem = mongoose.model(
    "CodingProblem",
    codingProblemSchema
);

export default CodingProblem;
