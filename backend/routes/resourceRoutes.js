
import express from "express";
import protect from "../middleware/authMiddleware.js";

import {
    createResource,
    getResources,
    getResourceById,
    updateResource,
    deleteResource
} from "../controllers/resourceController.js";

const router = express.Router();

router.use(protect);

router.post("/", createResource);
router.get("/", getResources);
router.get("/:id", getResourceById);
router.put("/:id", updateResource);
router.delete("/:id", deleteResource);

export default router;
