
import mongoose from "mongoose";
import Roadmap from "../models/Roadmap.js";

// Create a new roadmap
export const createRoadmap = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            roadmapType,
            sourceName,
            sourceUrl
        } = req.body;

        if (!title || !category) {
            return res.status(400).json({
                success: false,
                message: "Roadmap title and category are required."
            });
        }

        const roadmap = await Roadmap.create({
            title,
            description,
            category,
            roadmapType: roadmapType || "Custom",
            sourceName,
            sourceUrl,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Roadmap created successfully.",
            roadmap
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all roadmaps of the logged-in student
export const getRoadmaps = async (req, res) => {
    try {
        const roadmaps = await Roadmap.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: roadmaps.length,
            roadmaps
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get one roadmap
export const getRoadmapById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap ID."
            });
        }

        const roadmap = await Roadmap.findOne({
            _id: id,
            user: req.user.id
        });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }

        res.status(200).json({
            success: true,
            roadmap
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Add a learning topic to a roadmap
export const addRoadmapStep = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, resourceUrl } = req.body;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap ID."
            });
        }

        if (!title) {
            return res.status(400).json({
                success: false,
                message: "Topic title is required."
            });
        }

        const roadmap = await Roadmap.findOne({
            _id: id,
            user: req.user.id
        });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }

        roadmap.steps.push({
            title,
            description,
            resourceUrl,
            order: roadmap.steps.length + 1
        });

        await roadmap.save();

        res.status(201).json({
            success: true,
            message: "Learning topic added successfully.",
            roadmap
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update a learning topic
export const updateRoadmapStep = async (req, res) => {
    try {
        const { id, stepId } = req.params;
        const { title, description, resourceUrl, status } = req.body;

        if (
            !mongoose.isValidObjectId(id) ||
            !mongoose.isValidObjectId(stepId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap or topic ID."
            });
        }

        const roadmap = await Roadmap.findOne({
            _id: id,
            user: req.user.id
        });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }

        const step = roadmap.steps.id(stepId);

        if (!step) {
            return res.status(404).json({
                success: false,
                message: "Learning topic not found."
            });
        }

        if (title !== undefined) step.title = title;
        if (description !== undefined) step.description = description;
        if (resourceUrl !== undefined) step.resourceUrl = resourceUrl;
        if (status !== undefined) step.status = status;

        await roadmap.save();

        res.status(200).json({
            success: true,
            message: "Learning topic updated successfully.",
            roadmap
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete a learning topic
export const deleteRoadmapStep = async (req, res) => {
    try {
        const { id, stepId } = req.params;

        if (
            !mongoose.isValidObjectId(id) ||
            !mongoose.isValidObjectId(stepId)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap or topic ID."
            });
        }

        const roadmap = await Roadmap.findOne({
            _id: id,
            user: req.user.id
        });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }

        const step = roadmap.steps.id(stepId);

        if (!step) {
            return res.status(404).json({
                success: false,
                message: "Learning topic not found."
            });
        }

        step.deleteOne();

        await roadmap.save();

        res.status(200).json({
            success: true,
            message: "Learning topic deleted successfully.",
            roadmap
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete an entire roadmap
export const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid roadmap ID."
            });
        }

        const roadmap = await Roadmap.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Roadmap deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
