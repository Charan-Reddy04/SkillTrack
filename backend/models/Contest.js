
import mongoose from "mongoose";

const contestSchema = new mongoose.Schema(
    {
        contestName: {
            type: String,
            required: true,
            trim: true
        },

        platform: {
            type: String,
            required: true,
            enum: [
                "LeetCode",
                "CodeChef",
                "Codeforces",
                "HackerRank",
                "GeeksforGeeks",
                "Other"
            ]
        },

        contestUrl: {
            type: String,
            required: true,
            trim: true
        },

        startDate: {
            type: Date,
            required: true
        },

        duration: {
            type: Number,
            default: 0,
            min: 0
        },

        status: {
            type: String,
            enum: [
                "Not Registered",
                "Registered",
                "Participated",
                "Missed"
            ],
            default: "Not Registered"
        },

        rank: {
            type: Number,
            default: null,
            min: 1
        },

        problemsSolved: {
            type: Number,
            default: 0,
            min: 0
        },

        score: {
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

contestSchema.index({ user: 1, startDate: 1 });

const Contest = mongoose.model("Contest", contestSchema);

export default Contest;
