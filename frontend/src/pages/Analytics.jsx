import { useEffect, useState } from "react";
import {
    ArrowLeft,
    Target,
    Code,
    Clock,
    ClipboardCheck,
    Trophy,
    BookOpen,
    RefreshCw,
    TrendingUp
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import analyticsService from "../services/analyticsService";

const StatCard = ({ title, value, subtitle, icon: Icon }) => (
    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <div className="rounded-xl bg-purple-100 p-3">
                <Icon size={21} className="text-purple-700" />
            </div>
        </div>

        <h2 className="mt-4 text-3xl font-bold text-[#171442]">
            {value}
        </h2>

        <p className="mt-1 text-xs text-gray-500">{subtitle}</p>
    </div>
);

const ProgressBar = ({ label, value, color = "bg-purple-600" }) => (
    <div className="mb-5">
        <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-gray-700">{label}</span>
            <span className="font-semibold text-gray-700">{value}%</span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-purple-100">
            <div
                className={`h-full rounded-full ${color}`}
                style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
            />
        </div>
    </div>
);

const Analytics = () => {
    const navigate = useNavigate();

    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await analyticsService.getAnalytics();

            if (response.success) {
                setAnalytics(response);
            } else {
                setError("Unable to load analytics.");
            }
        } catch (err) {
            console.error("Analytics loading error:", err);
            setError(
                err.response?.data?.message ||
                "Unable to load analytics. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF]">
                <div className="text-center">
                    <RefreshCw className="mx-auto animate-spin text-purple-600" size={32} />
                    <p className="mt-3 text-gray-600">Loading your analytics...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F5F3FF] p-5">
                <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
                    <p className="font-medium text-red-600">{error}</p>

                    <button
                        onClick={loadAnalytics}
                        className="mt-5 rounded-xl bg-purple-600 px-5 py-2.5 text-white hover:bg-purple-700"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    const data = analytics?.summary || {};
    const weeklyStudy = analytics?.weeklyStudy || [];
    const platformStats = analytics?.platformStats || {};
    const difficultyStats = analytics?.difficultyStats || {};
    const assessmentTrend = analytics?.assessmentTrend || [];

    const maxStudyMinutes = Math.max(
        ...weeklyStudy.map(day => day.minutes),
        60
    );

    const totalPlatformProblems = Object.values(platformStats).reduce(
        (total, count) => total + count,
        0
    );

    const totalDifficultyProblems = Object.values(difficultyStats).reduce(
        (total, count) => total + count,
        0
    );

    const goalCompletion = data.totalGoals
        ? Math.round((data.completedGoals / data.totalGoals) * 100)
        : 0;

    const problemCompletion = data.totalProblems
        ? Math.round((data.solvedProblems / data.totalProblems) * 100)
        : 0;

    return (
        <div className="min-h-screen bg-[#F5F3FF]">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

                {/* Heading */}
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                        <div>
                            <p className="mb-2 text-sm font-medium text-purple-100">
                                YOUR LEARNING JOURNEY
                            </p>

                            <h1 className="text-2xl font-bold md:text-3xl">
                                Analytics & Reports
                            </h1>

                            <p className="mt-2 max-w-xl text-sm text-purple-100">
                                Understand your progress and see how your skills are improving.
                            </p>
                        </div>

                        <button
                            onClick={loadAnalytics}
                            className="flex items-center justify-center gap-2 self-start rounded-xl bg-white/15 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/25 sm:self-auto"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Learning Goals"
                        value={data.totalGoals ?? 0}
                        subtitle={`${data.completedGoals ?? 0} goals completed`}
                        icon={Target}
                    />

                    <StatCard
                        title="Problems Solved"
                        value={data.solvedProblems ?? 0}
                        subtitle={`${data.totalProblems ?? 0} problems added`}
                        icon={Code}
                    />

                    <StatCard
                        title="Study Hours"
                        value={data.totalStudyHours ?? 0}
                        subtitle={`${data.totalStudySessions ?? 0} study sessions`}
                        icon={Clock}
                    />

                    <StatCard
                        title="Assessments"
                        value={data.totalAssessments ?? 0}
                        subtitle={`Average score: ${data.averageAssessmentScore ?? 0}%`}
                        icon={ClipboardCheck}
                    />

                    <StatCard
                        title="Study Days"
                        value={data.studyDays ?? 0}
                        subtitle="Different days you studied"
                        icon={BookOpen}
                    />

                    <StatCard
                        title="Contests Participated"
                        value={data.participatedContests ?? 0}
                        subtitle={`${data.totalContests ?? 0} contests added`}
                        icon={Trophy}
                    />
                </div>

                {/* Learning Progress and Coding Progress */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-purple-100 p-3">
                                <Target className="text-purple-700" size={22} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#171442]">
                                    Learning Goal Progress
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Your goal completion summary
                                </p>
                            </div>
                        </div>

                        <ProgressBar
                            label="Completed Goals"
                            value={goalCompletion}
                        />

                        <ProgressBar
                            label="Average Goal Progress"
                            value={data.averageGoalProgress ?? 0}
                            color="bg-indigo-500"
                        />

                        <div className="mt-5 grid grid-cols-2 gap-3">
                            <div className="rounded-xl bg-purple-50 p-4">
                                <p className="text-xs text-gray-500">Completed</p>
                                <p className="mt-1 text-2xl font-bold text-purple-700">
                                    {data.completedGoals ?? 0}
                                </p>
                            </div>

                            <div className="rounded-xl bg-purple-50 p-4">
                                <p className="text-xs text-gray-500">Remaining</p>
                                <p className="mt-1 text-2xl font-bold text-purple-700">
                                    {Math.max(
                                        0,
                                        (data.totalGoals || 0) - (data.completedGoals || 0)
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-6">
                        <div className="mb-6 flex items-center gap-3">
                            <div className="rounded-xl bg-blue-100 p-3">
                                <Code className="text-blue-700" size={22} />
                            </div>

                            <div>
                                <h2 className="font-bold text-[#171442]">
                                    Coding Practice Progress
                                </h2>
                                <p className="text-xs text-gray-500">
                                    Your solved problem percentage
                                </p>
                            </div>
                        </div>

                        <ProgressBar
                            label="Problems Solved"
                            value={problemCompletion}
                            color="bg-blue-600"
                        />

                        <div className="mt-5 grid grid-cols-3 gap-2">
                            <div className="rounded-xl bg-green-50 p-3">
                                <p className="text-xs text-gray-500">Solved</p>
                                <p className="mt-1 text-xl font-bold text-green-700">
                                    {data.solvedProblems ?? 0}
                                </p>
                            </div>

                            <div className="rounded-xl bg-yellow-50 p-3">
                                <p className="text-xs text-gray-500">Attempted</p>
                                <p className="mt-1 text-xl font-bold text-yellow-700">
                                    {data.attemptedProblems ?? 0}
                                </p>
                            </div>

                            <div className="rounded-xl bg-gray-100 p-3">
                                <p className="text-xs text-gray-500">Not Solved</p>
                                <p className="mt-1 text-xl font-bold text-gray-700">
                                    {Math.max(
                                        0,
                                        (data.totalProblems || 0) -
                                        (data.solvedProblems || 0) -
                                        (data.attemptedProblems || 0)
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Weekly Study Chart */}
                <div className="mb-8 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-purple-100 p-3">
                            <Clock className="text-purple-700" size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-[#171442]">
                                Weekly Study Activity
                            </h2>
                            <p className="text-xs text-gray-500">
                                Your study time during the last seven days
                            </p>
                        </div>
                    </div>

                    <div className="flex h-56 items-end justify-around gap-2 border-b border-gray-200 px-2 pb-2">
                        {weeklyStudy.map((day, index) => {
                            const height = day.minutes
                                ? Math.max(
                                    5,
                                    (day.minutes / maxStudyMinutes) * 100
                                )
                                : 0;

                            return (
                                <div
                                    key={day.date}
                                    className="flex h-full flex-1 flex-col items-center justify-end gap-2"
                                >
                                    <span className="text-xs font-medium text-gray-500">
                                        {day.minutes > 0
                                            ? `${day.minutes}m`
                                            : ""}
                                    </span>

                                    <div
                                        className="flex w-full max-w-12 items-end"
                                        style={{ height: "75%" }}
                                    >
                                        <div
                                            className={`w-full rounded-t-lg ${
                                                index === 6
                                                    ? "bg-purple-700"
                                                    : "bg-purple-400"
                                            }`}
                                            style={{ height: `${height}%` }}
                                        />
                                    </div>

                                    <span className="text-xs text-gray-500">
                                        {day.day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-4 text-center text-xs text-gray-500">
                        Study time is displayed in minutes.
                    </p>
                </div>

                {/* Platform and Difficulty */}
                <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-2">

                    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-6">
                        <h2 className="mb-2 font-bold text-[#171442]">
                            Coding Platforms
                        </h2>

                        <p className="mb-6 text-xs text-gray-500">
                            Problems added from each platform
                        </p>

                        {totalPlatformProblems === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-500">
                                No coding problems added yet.
                            </p>
                        ) : (
                            Object.entries(platformStats).map(([platform, count]) => (
                                <div key={platform} className="mb-5">
                                    <div className="mb-2 flex justify-between text-sm">
                                        <span className="font-medium text-gray-700">
                                            {platform}
                                        </span>
                                        <span className="font-semibold text-gray-700">
                                            {count}
                                        </span>
                                    </div>

                                    <div className="h-2.5 overflow-hidden rounded-full bg-purple-100">
                                        <div
                                            className="h-full rounded-full bg-purple-600"
                                            style={{
                                                width: `${(count / totalPlatformProblems) * 100}%`
                                            }}
                                        />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-6">
                        <h2 className="mb-2 font-bold text-[#171442]">
                            Problem Difficulty
                        </h2>

                        <p className="mb-6 text-xs text-gray-500">
                            Your problems grouped by difficulty
                        </p>

                        {totalDifficultyProblems === 0 ? (
                            <p className="py-8 text-center text-sm text-gray-500">
                                No difficulty data available yet.
                            </p>
                        ) : (
                            <>
                                {[
                                    {
                                        name: "Easy",
                                        color: "bg-green-500",
                                        count: difficultyStats.Easy || 0
                                    },
                                    {
                                        name: "Medium",
                                        color: "bg-yellow-500",
                                        count: difficultyStats.Medium || 0
                                    },
                                    {
                                        name: "Hard",
                                        color: "bg-red-500",
                                        count: difficultyStats.Hard || 0
                                    }
                                ].map(item => (
                                    <div key={item.name} className="mb-5">
                                        <div className="mb-2 flex justify-between text-sm">
                                            <span className="font-medium text-gray-700">
                                                {item.name}
                                            </span>
                                            <span className="font-semibold text-gray-700">
                                                {item.count}
                                            </span>
                                        </div>

                                        <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                                            <div
                                                className={`h-full rounded-full ${item.color}`}
                                                style={{
                                                    width: `${
                                                        (item.count / totalDifficultyProblems) * 100
                                                    }%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>

                {/* Assessment Results */}
                <div className="mb-8 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-6">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="rounded-xl bg-indigo-100 p-3">
                            <TrendingUp className="text-indigo-700" size={22} />
                        </div>

                        <div>
                            <h2 className="font-bold text-[#171442]">
                                Assessment Performance
                            </h2>
                            <p className="text-xs text-gray-500">
                                Your six most recent assessment attempts
                            </p>
                        </div>
                    </div>

                    {assessmentTrend.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Complete an assessment to see your results here.
                        </p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full min-w-[450px] text-left text-sm">
                                <thead>
                                    <tr className="border-b border-purple-100 text-gray-500">
                                        <th className="px-3 py-3 font-medium">Subject</th>
                                        <th className="px-3 py-3 font-medium">Score</th>
                                        <th className="px-3 py-3 font-medium">Date</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {assessmentTrend.map((attempt, index) => (
                                        <tr
                                            key={`${attempt.subject}-${index}`}
                                            className="border-b border-gray-100 last:border-0"
                                        >
                                            <td className="px-3 py-4 font-medium text-gray-800">
                                                {attempt.subject}
                                            </td>

                                            <td className="px-3 py-4">
                                                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                                    attempt.percentage >= 70
                                                        ? "bg-green-100 text-green-700"
                                                        : attempt.percentage >= 40
                                                        ? "bg-yellow-100 text-yellow-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}>
                                                    {attempt.percentage}%
                                                </span>
                                            </td>

                                            <td className="px-3 py-4 text-gray-500">
                                                {new Date(attempt.date).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                <p className="pb-4 text-center text-xs text-gray-500">
                    Your analytics are calculated from your SkillTrack activity.
                </p>
            </div>
        </div>
    );
};

export default Analytics;