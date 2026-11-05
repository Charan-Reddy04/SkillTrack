
import Contest from "../models/Contest.js";

// Add contest
export const createContest = async (req, res) => {
    try {
        const {
            contestName,
            platform,
            contestUrl,
            startDate,
            duration,
            status,
            rank,
            problemsSolved,
            score,
            notes
        } = req.body;

        if (!contestName || !platform || !contestUrl || !startDate) {
            return res.status(400).json({
                message: "Please fill all required fields."
            });
        }

        try {
            const url = new URL(contestUrl);

            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("Invalid URL");
            }
        } catch {
            return res.status(400).json({
                message: "Please enter a valid contest URL."
            });
        }

        if (Number.isNaN(new Date(startDate).getTime())) {
            return res.status(400).json({
                message: "Please enter a valid contest date."
            });
        }

        const contest = await Contest.create({
            contestName,
            platform,
            contestUrl,
            startDate,
            duration,
            status,
            rank,
            problemsSolved,
            score,
            notes,
            user: req.user.id
        });

        res.status(201).json({
            message: "Contest added successfully.",
            contest
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Get all contests of logged-in user
export const getContests = async (req, res) => {
    try {
        const contests = await Contest.find({
            user: req.user.id
        }).sort({ startDate: -1 });

        res.status(200).json({
            count: contests.length,
            contests
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

// Update contest
export const updateContest = async (req, res) => {
    try {
        const contest = await Contest.findOne({
            _id: req.params.id,
            user: req.user.id
        });

        if (!contest) {
            return res.status(404).json({
                message: "Contest not found."
            });
        }

        const allowedFields = [
            "contestName",
            "platform",
            "contestUrl",
            "startDate",
            "duration",
            "status",
            "rank",
            "problemsSolved",
            "score",
            "notes"
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                contest[field] = req.body[field];
            }
        });

        await contest.save();

        res.status(200).json({
            message: "Contest updated successfully.",
            contest
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
};

// Delete contest
export const deleteContest = async (req, res) => {
    try {
        const contest = await Contest.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!contest) {
            return res.status(404).json({
                message: "Contest not found."
            });
        }

        res.status(200).json({
            message: "Contest deleted successfully."
        });
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};
