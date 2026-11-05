import mongoose from "mongoose";

const assessmentAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    subject: {
      type: String,
      required: true
    },
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    score: {
      type: Number,
      required: true
    },
    percentage: {
      type: Number,
      required: true
    },
    timeTaken: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("AssessmentAttempt", assessmentAttemptSchema);