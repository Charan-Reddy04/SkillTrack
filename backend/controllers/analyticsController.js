import LearningGoal from "../models/LearningGoal.js";
import CodingProblem from "../models/CodingProblem.js";
import StudySession from "../models/StudySession.js";
import AssessmentAttempt from "../models/AssessmentAttempt.js";
import Contest from "../models/Contest.js";

const getDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const getAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Get the user's data from all modules.
        const [
            goals,
            problems,
            sessions,
            attempts,
            contests
        ] = await Promise.all([
            LearningGoal.find({ user: userId }),
            CodingProblem.find({ user: userId }),
            StudySession.find({ user: userId }),
            AssessmentAttempt.find({ user: userId }).sort({ createdAt: -1 }),
            Contest.find({ user: userId })
        ]);

        // Learning goal statistics.
        const completedGoals = goals.filter(
            goal => goal.status === "Completed"
        ).length;

        const averageGoalProgress = goals.length
            ? Math.round(
                goals.reduce((total, goal) => total + goal.progress, 0) /
                goals.length
            )
            : 0;

        // Coding practice statistics.
        const solvedProblems = problems.filter(
            problem => problem.status === "Solved"
        ).length;

        const attemptedProblems = problems.filter(
            problem => problem.status === "Attempted"
        ).length;

        const platformStats = {};

        problems.forEach(problem => {
            const platform = problem.platform || "Other";

            if (!platformStats[platform]) {
                platformStats[platform] = 0;
            }

            platformStats[platform]++;
        });

        const difficultyStats = {
            Easy: 0,
            Medium: 0,
            Hard: 0
        };

        problems.forEach(problem => {
            if (difficultyStats[problem.difficulty] !== undefined) {
                difficultyStats[problem.difficulty]++;
            }
        });

        // Study statistics.
        const totalStudyMinutes = sessions.reduce(
            (total, session) => total + session.durationMinutes,
            0
        );

        const studyDays = new Set(
            sessions.map(session => session.date)
        ).size;

        // Last seven days of study activity.
        const weeklyStudy = [];

        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setHours(0, 0, 0, 0);
            date.setDate(date.getDate() - i);

            const dateKey = getDateKey(date);

            const minutes = sessions
                .filter(session => session.date === dateKey)
                .reduce(
                    (total, session) => total + session.durationMinutes,
                    0
                );

            weeklyStudy.push({
                date: dateKey,
                day: date.toLocaleDateString("en-US", {
                    weekday: "short"
                }),
                minutes
            });
        }

        // Assessment statistics.
        const averageAssessmentScore = attempts.length
            ? Math.round(
                attempts.reduce(
                    (total, attempt) => total + attempt.percentage,
                    0
                ) / attempts.length
            )
            : 0;

        const assessmentTrend = attempts
            .slice(0, 6)
            .reverse()
            .map(attempt => ({
                subject: attempt.subject,
                percentage: attempt.percentage,
                date: attempt.createdAt
            }));

        // Contest statistics.
        const participatedContests = contests.filter(
            contest => contest.status === "Participated"
        ).length;

        res.status(200).json({
            success: true,

            summary: {
                totalGoals: goals.length,
                completedGoals,
                averageGoalProgress,

                totalProblems: problems.length,
                solvedProblems,
                attemptedProblems,

                totalStudyMinutes,
                totalStudyHours: Number(
                    (totalStudyMinutes / 60).toFixed(1)
                ),
                totalStudySessions: sessions.length,
                studyDays,

                totalAssessments: attempts.length,
                averageAssessmentScore,

                totalContests: contests.length,
                participatedContests
            },

            weeklyStudy,
            platformStats,
            difficultyStats,
            assessmentTrend
        });

    } catch (error) {
        console.error("Analytics Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load analytics."
        });
    }
};