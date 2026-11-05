
import Note from "../models/Note.js";

// Create a new note
export const createNote = async (req, res) => {
    try {
        const { title, subject, content, category, isPinned } = req.body;

        if (!title || !subject || !content) {
            return res.status(400).json({
                message: "Title, subject and content are required"
            });
        }

        const note = await Note.create({
            title,
            subject,
            content,
            category: category || "General",
            isPinned: isPinned || false,
            user: req.user.id
        });

        res.status(201).json({
            message: "Note created successfully",
            note
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to create note",
            error: error.message
        });
    }
};

// Get all notes of the logged-in user
export const getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            user: req.user.id
        }).sort({
            isPinned: -1,
            updatedAt: -1
        });

        res.status(200).json({
            notes
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notes",
            error: error.message
        });
    }
};

// Update a note
export const updateNote = async (req, res) => {
    try {
        const { title, subject, content, category, isPinned } = req.body;

        const note = await Note.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.user.id
            },
            {
                title,
                subject,
                content,
                category,
                isPinned
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note updated successfully",
            note
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update note",
            error: error.message
        });
    }
};

// Delete a note
export const deleteNote = async (req, res) => {
    try {
        const note = await Note.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });

        if (!note) {
            return res.status(404).json({
                message: "Note not found"
            });
        }

        res.status(200).json({
            message: "Note deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to delete note",
            error: error.message
        });
    }
};
