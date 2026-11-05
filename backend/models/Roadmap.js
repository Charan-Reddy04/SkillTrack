
import mongoose from "mongoose";

// One learning topic inside a roadmap
const roadmapStepSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },

    description: {
        type: String,
        default: ""
    },

    resourceUrl: {
        type: String,
        default: ""
    },

    status: {
        type: String,
        enum: ["Not Started", "In Progress", "Completed"],
        default: "Not Started"
    },

    order: {
        type: Number,
        default: 0
    }
});

// Main roadmap information
const roadmapSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        description: {
            type: String,
            default: ""
        },

        category: {
            type: String,
            required: true
        },

        roadmapType: {
            type: String,
            enum: ["External", "Custom"],
            default: "External"
        },

        sourceName: {
            type: String,
            default: ""
        },

        sourceUrl: {
            type: String,
            default: ""
        },

        steps: [roadmapStepSchema],

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
);

// Calculate progress automatically
roadmapSchema.virtual("progress").get(function () {
    if (this.steps.length === 0) {
        return 0;
    }

    const completedSteps = this.steps.filter(
        step => step.status === "Completed"
    ).length;

    return Math.round(
        (completedSteps / this.steps.length) * 100
    );
});

roadmapSchema.set("toJSON", { virtuals: true });
roadmapSchema.set("toObject", { virtuals: true });

const Roadmap = mongoose.model("Roadmap", roadmapSchema);

export default Roadmap;
