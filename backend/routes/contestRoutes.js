
import express from "express";

import {
    createContest,
    getContests,
    updateContest,
    deleteContest
} from "../controllers/contestController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createContest);
router.get("/", getContests);
router.put("/:id", updateContest);
router.delete("/:id", deleteContest);

export default router;
