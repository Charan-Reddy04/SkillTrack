
import CodingProblem from "../models/CodingProblem.js";

// Add a new coding problem
export const createCodingProblem = async (req, res) => {
    try {
        const {
            title,
            problemUrl,
            platform,
            topic,
            difficulty,
            status,
            timeTaken,
            notes
        } = req.body;

        if (!title || !problemUrl || !platform || !topic) {
            return res.status(400).json({
                message: "Please fill all required fields."
            });
        }

        // Check whether the URL is valid
        try {
            const url = new URL(problemUrl);

            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Invalid URL");
            }
        } catch {
            return res.status(400).json({
                message: "Please enter a valid problem URL."
            });
        }

        const problem = await CodingProblem.create({
            title,
            problemUrl,
            platform,
            topic,
            difficulty,
            status,
            timeTaken,
            notes,
            user: req.user.id
        });

        res.status(201).json({
            message: "Coding problem added successfully.",
            problem
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Get all problems of the logged-in user
export const getCodingProblems = async (req, res) => {
    try {
        const problems = await CodingProblem.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: problems.length,
            problems
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update a coding problem
export const updateCodingProblem = async (req, res) => {
    try {
        const problem = await CodingProblem.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!problem) {
            return res.status(404).json({
                message: "Coding problem not found."
            });
        }

        const allowedFields = [
            "title",
            "problemUrl",
            "platform",
            "topic",
            "difficulty",
            "status",
            "timeTaken",
            "notes"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                problem[field] = req.body[field];
            }
        });

        await problem.save();

        res.status(200).json({
            message: "Coding problem updated successfully.",
            problem
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Delete a coding problem
export const deleteCodingProblem = async (req, res) => {
    try {
        const problem = await CodingProblem.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!problem) {
            return res.status(404).json({
                message: "Coding problem not found."
            });
        }

        res.status(200).json({
            message: "Coding problem deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
