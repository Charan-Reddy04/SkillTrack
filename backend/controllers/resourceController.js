
import mongoose from "mongoose";
import Resource from "../models/Resource.js";

// Create a resource
export const createResource = async (req, res) => {
    try {
        const {
            title,
            description,
            url,
            category,
            resourceType,
            notes
        } = req.body;

        if (!title || !url || !category) {
            return res.status(400).json({
                success: false,
                message: "Title, URL and category are required."
            });
        }

        try {
            new URL(url);
        } catch {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid URL."
            });
        }

        const resource = await Resource.create({
            title,
            description,
            url,
            category,
            resourceType,
            notes,
            user: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Resource saved successfully.",
            resource
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all resources of the logged-in student
export const getResources = async (req, res) => {
    try {
        const resources = await Resource.find({
            user: req.user.id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: resources.length,
            resources
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get one resource
export const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resource ID."
            });
        }

        const resource = await Resource.findOne({
            _id: id,
            user: req.user.id
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found."
            });
        }

        res.status(200).json({
            success: true,
            resource
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update a resource
export const updateResource = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resource ID."
            });
        }

        const allowedFields = [
            "title",
            "description",
            "url",
            "category",
            "resourceType",
            "notes"
        ];

        const updates = {};

        for (const field of allowedFields) {
            if (req.body[field] !== undefined) {
                updates[field] = req.body[field];
            }
        }

        if (updates.url !== undefined) {
            try {
                new URL(updates.url);
            } catch {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid URL."
                });
            }
        }

        const resource = await Resource.findOneAndUpdate(
            {
                _id: id,
                user: req.user.id
            },
            updates,
            {
                new: true,
                runValidators: true
            }
        );

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Resource updated successfully.",
            resource
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete a resource
export const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.isValidObjectId(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid resource ID."
            });
        }

        const resource = await Resource.findOneAndDelete({
            _id: id,
            user: req.user.id
        });

        if (!resource) {
            return res.status(404).json({
                success: false,
                message: "Resource not found."
            });
        }

        res.status(200).json({
            success: true,
            message: "Resource deleted successfully."
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
