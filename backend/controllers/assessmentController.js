import AssessmentAttempt from "../models/AssessmentAttempt.js";
import assessmentQuestions from "../data/assessmentQuestions.js";

// Get available subjects
export const getSubjects = async (req, res) => {
  try {
    res.status(200).json({
      subjects: Object.keys(assessmentQuestions)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get quiz questions without correct answers
export const getQuiz = async (req, res) => {
  try {
    const { subject } = req.params;
    const questions = assessmentQuestions[subject];

    if (!questions) {
      return res.status(404).json({ message: "Subject not found" });
    }

    const safeQuestions = questions.map((item, index) => ({
      id: index,
      question: item.question,
      options: item.options
    }));

    res.status(200).json({
      subject,
      questions: safeQuestions,
      duration: 5
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Submit quiz answers
export const submitAssessment = async (req, res) => {
  try {
    const { subject, answers, timeTaken } = req.body;
    const questions = assessmentQuestions[subject];

    if (!questions) {
      return res.status(400).json({ message: "Invalid subject" });
    }

    if (!Array.isArray(answers) || answers.length !== questions.length) {
      return res.status(400).json({
        message: "Please answer all questions before submitting"
      });
    }

    let correctAnswers = 0;

    questions.forEach((question, index) => {
      if (answers[index] === question.answer) {
        correctAnswers++;
      }
    });

    const totalQuestions = questions.length;
    const percentage = Math.round(
      (correctAnswers / totalQuestions) * 100
    );

    const attempt = await AssessmentAttempt.create({
      user: req.user.id,
      subject,
      totalQuestions,
      correctAnswers,
      score: correctAnswers,
      percentage,
      timeTaken: Math.max(0, Number(timeTaken) || 0)
    });

    res.status(201).json({
      message: "Assessment submitted successfully",
      result: {
        subject,
        totalQuestions,
        correctAnswers,
        wrongAnswers: totalQuestions - correctAnswers,
        score: correctAnswers,
        percentage,
        timeTaken: attempt.timeTaken,
        attemptId: attempt._id,
        review: questions.map((question, index) => ({
          question: question.question,
          yourAnswer: answers[index],
          correctAnswer: question.answer,
          isCorrect: answers[index] === question.answer
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get logged-in student's assessment history
export const getAssessmentHistory = async (req, res) => {
  try {
    const attempts = await AssessmentAttempt.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.status(200).json({ attempts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};