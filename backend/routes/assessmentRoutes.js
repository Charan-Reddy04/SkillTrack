import express from "express";

import {
  getSubjects,
  getQuiz,
  submitAssessment,
  getAssessmentHistory
} from "../controllers/assessmentController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.get("/subjects", getSubjects);
router.get("/quiz/:subject", getQuiz);
router.post("/submit", submitAssessment);
router.get("/history", getAssessmentHistory);

export default router;