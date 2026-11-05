
import express from "express";

import {
    createCodingProblem,
    getCodingProblems,
    updateCodingProblem,
    deleteCodingProblem
} from "../controllers/codingProblemController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require login
router.use(protect);

// Add a problem
router.post("/", createCodingProblem);

// Get all problems
router.get("/", getCodingProblems);

// Update a problem
router.put("/:id", updateCodingProblem);

// Delete a problem
router.delete("/:id", deleteCodingProblem);

export default router;
