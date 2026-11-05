
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import learningGoalRoutes from "./routes/learningGoalRoutes.js";
import roadmapRoutes from "./routes/roadmapRoutes.js";
import resourceRoutes from "./routes/resourceRoutes.js";
import codingProblemRoutes from "./routes/codingProblemRoutes.js";
import contestRoutes from "./routes/contestRoutes.js";
import assessmentRoutes from "./routes/assessmentRoutes.js";
import studyRoutes from "./routes/studyRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";

dotenv.config();

const app = express();

// CORS configuration
const allowedOrigins = [
    "http://localhost:5173",
    "https://skill-track-eight-virid.vercel.app"
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Home route
app.get("/", (req, res) => {
    res.send("Welcome to SkillTrack Backend!");
});

// Health check
app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillTrack API is running successfully"
    });
});

// Application routes
app.use("/api/auth", authRoutes);
app.use("/api/goals", learningGoalRoutes);
app.use("/api/roadmaps", roadmapRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/coding-problems", codingProblemRoutes);
app.use("/api/contests", contestRoutes);
app.use("/api/assessments", assessmentRoutes);
app.use("/api/study", studyRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/notes", noteRoutes);

// Start server
const startServer = async () => {
    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
        console.log(`SkillTrack Server running on port ${PORT}`);
    });
};

startServer();
