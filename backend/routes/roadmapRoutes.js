
import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    createRoadmap,
    getRoadmaps,
    getRoadmapById,
    addRoadmapStep,
    updateRoadmapStep,
    deleteRoadmapStep,
    deleteRoadmap
} from "../controllers/roadmapController.js";

const router = express.Router();

// All roadmap routes require login
router.use(protect);

// Roadmap operations
router.post("/", createRoadmap);
router.get("/", getRoadmaps);
router.get("/:id", getRoadmapById);
router.delete("/:id", deleteRoadmap);

// Learning topic operations
router.post("/:id/steps", addRoadmapStep);
router.put("/:id/steps/:stepId", updateRoadmapStep);
router.delete("/:id/steps/:stepId", deleteRoadmapStep);

export default router;
