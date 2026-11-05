import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Award,
  BookOpen,
  CheckCircle,
  Clock,
  History,
  Play,
  RotateCcw,
  XCircle
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import assessmentService from "../services/assessmentService";

const SkillAssessment = () => {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [history, setHistory] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [startTime, setStartTime] = useState(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quizLoading, setQuizLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load subjects and previous results
  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subjectData, historyData] = await Promise.all([
        assessmentService.getSubjects(),
        assessmentService.getAssessmentHistory()
      ]);

      setSubjects(subjectData.subjects || []);
      setHistory(historyData.attempts || []);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to load assessments."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Start a quiz
  const startQuiz = async (subject) => {
    try {
      setQuizLoading(true);
      setError("");

      const data = await assessmentService.getQuiz(subject);

      setSelectedSubject(subject);
      setQuestions(data.questions);
      setAnswers({});
      setCurrentQuestion(0);
      setTimeLeft(data.duration * 60);
      setStartTime(Date.now());
      setResult(null);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to start quiz."
      );
    } finally {
      setQuizLoading(false);
    }
  };

  // Select an answer
  const selectAnswer = (answer) => {
    setAnswers((previous) => ({
      ...previous,
      [currentQuestion]: answer
    }));
  };

  // Submit quiz
  const handleSubmit = async () => {
    if (submitting || !questions.length) return;

    const unanswered = questions.length - Object.keys(answers).length;

    if (unanswered > 0 && timeLeft > 0) {
      const confirmSubmit = window.confirm(
        `You have ${unanswered} unanswered question(s). Submit anyway?`
      );

      if (!confirmSubmit) return;
    }

    try {
      setSubmitting(true);
      setError("");

      const timeTaken = startTime
        ? Math.floor((Date.now() - startTime) / 1000)
        : 0;

      const answerList = questions.map(
        (_, index) => answers[index] || ""
      );

      const data = await assessmentService.submitAssessment({
        subject: selectedSubject,
        answers: answerList,
        timeTaken
      });

      setResult(data.result);
      setQuestions([]);
      await loadHistory();
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit assessment."
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Load updated history
  const loadHistory = async () => {
    try {
      const data = await assessmentService.getAssessmentHistory();
      setHistory(data.attempts || []);
    } catch (err) {
      console.error("Unable to load history", err);
    }
  };

  // Timer
  useEffect(() => {
    if (!questions.length || result || submitting) return;

    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }

    const timer = setTimeout(() => {
      setTimeLeft((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [questions.length, timeLeft, result, submitting]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      remainingSeconds
    ).padStart(2, "0")}`;
  };

  const resetQuiz = () => {
    setQuestions([]);
    setAnswers({});
    setSelectedSubject("");
    setResult(null);
    setCurrentQuestion(0);
    setTimeLeft(300);
    setStartTime(null);
    setError("");
  };

  const totalAttempts = history.length;

  const averageScore = totalAttempts
    ? Math.round(
        history.reduce((sum, item) => sum + item.percentage, 0) /
          totalAttempts
      )
    : 0;

  const bestScore = totalAttempts
    ? Math.max(...history.map((item) => item.percentage))
    : 0;

  const current = questions[currentQuestion];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F5F3FF] flex items-center justify-center">
        <p className="text-[#5030E8] font-semibold">
          Loading Skill Assessment...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">
          <div className="flex items-center gap-3">
            <Award size={35} />
            <div>
              <h1 className="text-2xl font-bold md:text-3xl">
                Skill Assessment
              </h1>
              <p className="mt-1 text-sm text-purple-100 md:text-base">
                Test your knowledge and track your improvement.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Quiz screen */}
        {questions.length > 0 && !result && current && (
          <div className="rounded-3xl border border-[#E7E2FA] bg-white p-5 shadow-sm md:p-8">

            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm text-gray-500">Current assessment</p>
                <h2 className="text-xl font-bold text-[#10183F]">
                  {selectedSubject}
                </h2>
              </div>

              <div className="flex items-center gap-2 rounded-xl bg-purple-50 px-4 py-2 font-bold text-[#5030E8]">
                <Clock size={18} />
                {formatTime(timeLeft)}
              </div>
            </div>

            <div className="mb-6 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#5030E8] to-[#9148E9]"
                style={{
                  width: `${
                    ((currentQuestion + 1) / questions.length) * 100
                  }%`
                }}
              />
            </div>

            <div className="mb-5 flex items-center justify-between text-sm text-gray-500">
              <span>
                Question {currentQuestion + 1} of {questions.length}
              </span>
              <span>
                {Object.keys(answers).length} answered
              </span>
            </div>

            <h3 className="mb-6 text-lg font-bold leading-relaxed text-[#10183F] md:text-xl">
              {current.question}
            </h3>

            <div className="space-y-3">
              {current.options.map((option, index) => {
                const isSelected = answers[currentQuestion] === option;

                return (
                  <button
                    key={index}
                    onClick={() => selectAnswer(option)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      isSelected
                        ? "border-[#6735D5] bg-purple-50 text-[#5030E8]"
                        : "border-[#E7E2FA] bg-white text-gray-700 hover:border-purple-300"
                    }`}
                  >
                    <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-sm font-bold text-[#5030E8]">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                onClick={() =>
                  setCurrentQuestion((previous) =>
                    Math.max(0, previous - 1)
                  )
                }
                disabled={currentQuestion === 0}
                className="rounded-xl border border-[#D9D5FA] px-5 py-3 font-semibold text-[#5030E8] disabled:opacity-40"
              >
                Previous
              </button>

              {currentQuestion < questions.length - 1 ? (
                <button
                  onClick={() =>
                    setCurrentQuestion((previous) => previous + 1)
                  }
                  className="rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 font-semibold text-white"
                >
                  Next Question
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {submitting ? "Submitting..." : "Submit Assessment"}
                </button>
              )}
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`h-9 w-9 rounded-lg text-sm font-semibold ${
                    currentQuestion === index
                      ? "bg-[#5030E8] text-white"
                      : answers[index]
                      ? "bg-purple-100 text-[#5030E8]"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Result screen */}
        {result && (
          <div className="rounded-3xl border border-[#E7E2FA] bg-white p-6 shadow-sm md:p-8">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 text-[#5030E8]">
                <Award size={35} />
              </div>

              <h2 className="text-2xl font-bold text-[#10183F]">
                Assessment Completed!
              </h2>

              <p className="mt-2 text-gray-500">
                Your {result.subject} assessment result
              </p>

              <p className="mt-6 text-5xl font-bold text-[#6735D5]">
                {result.percentage}%
              </p>
              <p className="mt-2 font-semibold text-gray-600">
                {result.correctAnswers} out of {result.totalQuestions} correct
              </p>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl bg-green-50 p-4 text-center">
                <CheckCircle className="mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold text-green-700">
                  {result.correctAnswers}
                </p>
                <p className="text-sm text-green-700">Correct</p>
              </div>

              <div className="rounded-2xl bg-red-50 p-4 text-center">
                <XCircle className="mx-auto mb-2 text-red-500" />
                <p className="text-2xl font-bold text-red-600">
                  {result.wrongAnswers}
                </p>
                <p className="text-sm text-red-600">Wrong / Unanswered</p>
              </div>

              <div className="rounded-2xl bg-purple-50 p-4 text-center">
                <Clock className="mx-auto mb-2 text-[#6735D5]" />
                <p className="text-2xl font-bold text-[#6735D5]">
                  {formatTime(result.timeTaken)}
                </p>
                <p className="text-sm text-[#6735D5]">Time Taken</p>
              </div>
            </div>

            <h3 className="mt-8 mb-4 text-lg font-bold text-[#10183F]">
              Answer Review
            </h3>

            <div className="space-y-4">
              {result.review.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-[#E7E2FA] p-4"
                >
                  <p className="font-semibold text-[#10183F]">
                    {index + 1}. {item.question}
                  </p>

                  <p className="mt-2 text-sm text-gray-600">
                    Your answer: {item.yourAnswer || "Not answered"}
                  </p>

                  <p className="mt-1 text-sm font-semibold text-green-700">
                    Correct answer: {item.correctAnswer}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={resetQuiz}
              className="mt-7 flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 font-semibold text-white"
            >
              <RotateCcw size={17} />
              Take Another Assessment
            </button>
          </div>
        )}

        {/* Subject selection and history */}
        {!questions.length && !result && (
          <>
            <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5">
                <BookOpen className="mb-3 text-[#6735D5]" />
                <p className="text-sm text-gray-500">Total Attempts</p>
                <p className="mt-1 text-2xl font-bold text-[#10183F]">
                  {totalAttempts}
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5">
                <Award className="mb-3 text-[#6735D5]" />
                <p className="text-sm text-gray-500">Average Score</p>
                <p className="mt-1 text-2xl font-bold text-[#10183F]">
                  {averageScore}%
                </p>
              </div>

              <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5">
                <CheckCircle className="mb-3 text-[#6735D5]" />
                <p className="text-sm text-gray-500">Best Score</p>
                <p className="mt-1 text-2xl font-bold text-[#10183F]">
                  {bestScore}%
                </p>
              </div>
            </div>

            <div className="mb-8">
              <div className="mb-5">
                <h2 className="text-xl font-bold text-[#10183F]">
                  Choose a Subject
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  Each quiz contains 5 questions and has 5 minutes.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-[#6735D5]">
                      <BookOpen />
                    </div>

                    <h3 className="font-bold text-[#10183F]">
                      {subject}
                    </h3>

                    <p className="mt-1 text-sm text-gray-500">
                      5 questions · 5 minutes
                    </p>

                    <button
                      onClick={() => startQuiz(subject)}
                      disabled={quizLoading}
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-4 py-3 font-semibold text-white disabled:opacity-60"
                    >
                      <Play size={17} />
                      {quizLoading ? "Loading..." : "Start Assessment"}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm md:p-6">
              <div className="mb-5 flex items-center gap-2">
                <History className="text-[#6735D5]" />
                <h2 className="text-xl font-bold text-[#10183F]">
                  Assessment History
                </h2>
              </div>

              {history.length === 0 ? (
                <p className="py-6 text-center text-gray-500">
                  No assessments completed yet. Start your first quiz!
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[550px] text-left text-sm">
                    <thead>
                      <tr className="border-b text-gray-500">
                        <th className="p-3">Subject</th>
                        <th className="p-3">Score</th>
                        <th className="p-3">Percentage</th>
                        <th className="p-3">Date</th>
                      </tr>
                    </thead>

                    <tbody>
                      {history.map((attempt) => (
                        <tr
                          key={attempt._id}
                          className="border-b last:border-0"
                        >
                          <td className="p-3 font-semibold text-[#10183F]">
                            {attempt.subject}
                          </td>
                          <td className="p-3">
                            {attempt.correctAnswers}/{attempt.totalQuestions}
                          </td>
                          <td className="p-3 font-bold text-[#6735D5]">
                            {attempt.percentage}%
                          </td>
                          <td className="p-3 text-gray-500">
                            {new Date(attempt.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SkillAssessment;