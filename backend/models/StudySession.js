import mongoose from "mongoose";

const studySessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    date: {
      type: String,
      required: true
    },

    subject: {
      type: String,
      required: true,
      trim: true
    },

    durationMinutes: {
      type: Number,
      required: true,
      min: 1
    },

    topic: {
      type: String,
      trim: true,
      default: ""
    },

    tasksCompleted: {
      type: String,
      trim: true,
      default: ""
    },

    notes: {
      type: String,
      trim: true,
      default: ""
    }
  },
  { timestamps: true }
);

studySessionSchema.index({ user: 1, date: -1 });

export default mongoose.model("StudySession", studySessionSchema);