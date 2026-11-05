
import mongoose from "mongoose";
import LearningGoal from "../models/LearningGoal.js";

// Calculate goal status using progress
const getGoalStatus = (progress) => {
    if (progress === 0) {
        return "Not Started";
    }

    if (progress === 100) {
        return "Completed";
    }

    return "In Progress";
};

// 1. Create a new learning goal
export const createGoal = async (req, res) => {
    try {
        const {
            title,
            description,
            category,
            targetDate,
            priority,
            progress
        } = req.body;

        if (!title || !category || !targetDate) {
            return res.status(400).json({
                success: false,
                message: "Title, category and target date are required."
            });
        }

        const goalProgress = progress === undefined ? 0 : Number(progress);

        if (
            !Number.isFinite(goalProgress) ||
            goalProgress < 0 ||
            goalProgress > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Progress must be between 0 and 100."
            });
        }

        const goal = await LearningGoal.create({
            title,
            description,
            category,
            targetDate,
            priority,
            progress: goalProgress,
            status: getGoalStatus(goalProgress),
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Learning goal created successfully.",
            goal
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 2. Get all goals of the logged-in student
export const getGoals = async (req, res) => {
    try {
        const goals = await LearningGoal.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: goals.length,
            goals
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 3. Update a learning goal
export const updateGoal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid learning goal ID."
            });
        }

        const goal = await LearningGoal.findOne({
            _id: id,
            user: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Learning goal not found."
            });
        }

        const allowedFields = [
            "title",
            "description",
            "category",
            "targetDate",
            "priority",
            "progress"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                goal[field] = req.body[field];
            }
        });

        if (
            goal.progress < 0 ||
            goal.progress > 100 ||
            !Number.isFinite(Number(goal.progress))
        ) {
            return res.status(400).json({
                success: false,
                message: "Progress must be between 0 and 100."
            });
        }

        goal.status = getGoalStatus(Number(goal.progress));

        await goal.save();

        res.status(200).json({
            success: true,
            message: "Learning goal updated successfully.",
            goal
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// 4. Delete a learning goal
export const deleteGoal = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid learning goal ID."
            });
        }

        const goal = await LearningGoal.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!goal) {
            return res.status(404).json({
                success: false,
                message: "Learning goal not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Learning goal deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
