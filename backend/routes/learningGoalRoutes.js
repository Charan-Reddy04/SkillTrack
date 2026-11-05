
import express from "express";

import protect from "../middleware/authMiddleware.js";

import {
    createGoal,
    getGoals,
    updateGoal,
    deleteGoal
} from "../controllers/learningGoalController.js";

const router = express.Router();

// All these routes require login
router.use(protect);

// Create a learning goal
router.post("/", createGoal);

// Get all learning goals
router.get("/", getGoals);

// Update a learning goal
router.put("/:id", updateGoal);

// Delete a learning goal
router.delete("/:id", deleteGoal);

export default router;
