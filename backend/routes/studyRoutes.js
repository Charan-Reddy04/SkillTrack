import express from "express";

import {
  createStudySession,
  getStudySessions,
  updateStudySession,
  deleteStudySession
} from "../controllers/studyController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createStudySession);
router.get("/", getStudySessions);
router.put("/:id", updateStudySession);
router.delete("/:id", deleteStudySession);

export default router;