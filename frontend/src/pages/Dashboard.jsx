
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { getGoals } from "../services/goalService";
import analyticsService from "../services/analyticsService";

import {
    Target,
    Clock,
    Code2,
    Trophy,
    BookOpen,
    ArrowUpRight,
    Flame,
    CheckCircle2,
    Plus,
    Sparkles
} from "lucide-react";

import Topbar from "../components/dashboard/Topbar";
import StatCard from "../components/dashboard/StatCard";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("Dashboard");

    const [goals, setGoals] = useState([]);
    const [goalsLoading, setGoalsLoading] = useState(true);

    const [dashboardStats, setDashboardStats] = useState(null);
    const [statsLoading, setStatsLoading] = useState(true);

    const firstName = user?.name?.split(" ")[0] || "Student";

    // Fetch Learning Goals
    useEffect(() => {
        const fetchDashboardGoals = async () => {
            try {
                const response = await getGoals();
                setGoals(response.goals || []);
            } catch (error) {
                console.log(
                    "Dashboard goals error:",
                    error.response?.data?.message || error.message
                );
            } finally {
                setGoalsLoading(false);
            }
        };

        fetchDashboardGoals();
    }, []);

    // Fetch Dashboard Statistics
    useEffect(() => {
        const fetchDashboardStats = async () => {
            try {
                const response = await analyticsService.getAnalytics();

                if (response.success) {
                    setDashboardStats(response.summary);
                }
            } catch (error) {
                console.log(
                    "Dashboard analytics error:",
                    error.response?.data?.message || error.message
                );
            } finally {
                setStatsLoading(false);
            }
        };

        fetchDashboardStats();
    }, []);

    const totalGoals = goals.length;

    const completedGoals = goals.filter(
        (goal) => goal.status === "Completed"
    ).length;

    // Navigation
    const handleNavigation = (page) => {
        const routes = {
            "Learning Goals": "/learning-goals",
            "Roadmap Explorer": "/roadmap-explorer",
            "Learning Resources": "/learning-resources",
            "Coding Practice": "/coding-practice",
            "Contest Hub": "/contest-hub",
            "Skill Assessment": "/skill-assessment",
            "Study Tracker": "/study-tracker",
            "Analytics": "/analytics",
            "Analytics & Reports": "/analytics",
            "Personal Notes": "/personal-notes",
            "Settings": "/settings"
        };

        if (routes[page]) {
            navigate(routes[page]);
            return;
        }

        setActivePage(page);
    };

    // Real Dashboard Statistics
    const stats = [
        {
            title: "Learning Goals",
            value: goalsLoading ? "..." : totalGoals,
            subtitle: goalsLoading
                ? "Loading goals..."
                : `${completedGoals} completed`,
            icon: Target,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Study Hours",
            value: statsLoading
                ? "..."
                : `${dashboardStats?.totalStudyHours ?? 0} hrs`,
            subtitle: statsLoading
                ? "Loading study data..."
                : `${dashboardStats?.totalStudySessions ?? 0} study sessions`,
            icon: Clock,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Problems Solved",
            value: statsLoading
                ? "..."
                : dashboardStats?.solvedProblems ?? 0,
            subtitle: statsLoading
                ? "Loading coding data..."
                : `${dashboardStats?.totalProblems ?? 0} problems added`,
            icon: Code2,
            color: "text-green-600",
            bg: "bg-green-50"
        },
        {
            title: "Contests Joined",
            value: statsLoading
                ? "..."
                : dashboardStats?.participatedContests ?? 0,
            subtitle: statsLoading
                ? "Loading contest data..."
                : `${dashboardStats?.totalContests ?? 0} contests added`,
            icon: Trophy,
            color: "text-orange-500",
            bg: "bg-orange-50"
        }
    ];

    return (
        <div className="flex min-h-screen min-w-0 bg-[#F5F3FF]">

            <main className="min-w-0 flex-1">

                <Topbar />

                <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-5 md:p-8">

                    {activePage === "Dashboard" ? (
                        <>

                            {/* Welcome Section */}
                            <section className="relative mb-7 overflow-hidden rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-5 text-white shadow-lg shadow-purple-200 sm:p-6 md:p-8">

                                <div className="relative z-10 max-w-xl">

                                    <div className="mb-3 flex items-center gap-2 text-sm text-purple-100">
                                        <Sparkles size={17} />
                                        Your learning journey
                                    </div>

                                    <h1 className="break-words text-2xl font-bold leading-tight sm:text-3xl">
                                        Welcome back, {firstName}! 👋
                                    </h1>

                                    <p className="mt-3 text-sm leading-relaxed text-purple-100 sm:text-base">
                                        Every small step takes you closer to your goals.
                                        Let's make today productive!
                                    </p>

                                    <button
                                        onClick={() => handleNavigation("Learning Goals")}
                                        className="mt-5 inline-flex max-w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#6036D8] transition hover:bg-purple-50 sm:mt-6 sm:px-5"
                                    >
                                        Explore Learning Goals
                                        <ArrowUpRight size={17} />
                                    </button>

                                </div>

                                <div className="pointer-events-none absolute -right-10 -top-16 hidden h-64 w-64 rounded-full border-[35px] border-white/10 sm:block" />

                                <div className="pointer-events-none absolute -bottom-28 right-32 hidden h-64 w-64 rounded-full bg-white/10 sm:block" />

                            </section>

                            {/* Statistics */}
                            <section className="mb-8">

                                <div className="mb-4 flex flex-wrap items-center justify-between gap-2">

                                    <h2 className="text-lg font-bold text-[#18204D]">
                                        Your Overview
                                    </h2>

                                    <button
                                        onClick={() => handleNavigation("Analytics")}
                                        className="text-xs font-semibold text-purple-600 hover:text-purple-800"
                                    >
                                        View Analytics →
                                    </button>

                                </div>

                                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                                    {stats.map((item) => (
                                        <StatCard
                                            key={item.title}
                                            {...item}
                                        />
                                    ))}

                                </div>

                            </section>

                            {/* Learning Goals Preview */}
                            <section className="mb-8">

                                <div className="w-full max-w-2xl rounded-2xl border border-[#EAE6FA] bg-white p-4 shadow-sm sm:p-5">

                                    <div className="mb-5 flex items-center justify-between gap-3">

                                        <div>
                                            <h3 className="font-bold text-[#18204D]">
                                                Learning Goals
                                            </h3>

                                            <p className="mt-1 text-xs text-[#9299B5]">
                                                Your personal targets
                                            </p>
                                        </div>

                                        <Target className="shrink-0 text-purple-500" />

                                    </div>

                                    {goalsLoading ? (

                                        <div className="py-7 text-center">
                                            <p className="text-sm text-gray-500">
                                                Loading your goals...
                                            </p>
                                        </div>

                                    ) : goals.length === 0 ? (

                                        <div className="py-7 text-center">

                                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F0FF] text-purple-600">
                                                <Target size={30} />
                                            </div>

                                            <h4 className="mt-4 font-semibold text-[#27315D]">
                                                No goals yet
                                            </h4>

                                            <p className="mt-2 text-xs text-[#9299B5]">
                                                Create your first learning goal and start tracking progress.
                                            </p>

                                            <button
                                                onClick={() => handleNavigation("Learning Goals")}
                                                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#7045ED] hover:text-purple-900"
                                            >
                                                <Plus size={17} />
                                                Add a goal
                                            </button>

                                        </div>

                                    ) : (

                                        <div className="space-y-4">

                                            {goals.slice(0, 3).map((goal) => (

                                                <div
                                                    key={goal._id}
                                                    className="rounded-xl bg-[#F8F7FF] p-3"
                                                >

                                                    <div className="flex min-w-0 items-start justify-between gap-3">

                                                        <h4 className="min-w-0 break-words text-sm font-semibold text-[#27315D]">
                                                            {goal.title}
                                                        </h4>

                                                        <span className="shrink-0 text-xs font-bold text-purple-600">
                                                            {goal.progress}%
                                                        </span>

                                                    </div>

                                                    <p className="mt-1 break-words text-xs text-[#9299B5]">
                                                        {goal.category}
                                                    </p>

                                                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-purple-100">

                                                        <div
                                                            className="h-full rounded-full bg-purple-600 transition-all duration-500"
                                                            style={{
                                                                width: `${goal.progress}%`
                                                            }}
                                                        />

                                                    </div>

                                                    <p className="mt-2 text-xs text-gray-500">
                                                        {goal.status}
                                                    </p>

                                                </div>

                                            ))}

                                            <button
                                                onClick={() => handleNavigation("Learning Goals")}
                                                className="w-full rounded-xl border border-purple-200 py-2.5 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
                                            >
                                                View All Goals
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </section>

                            {/* Bottom Cards */}
                            <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                                {/* Coding Practice */}
                                <div className="min-w-0 rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-bold text-[#18204D]">
                                            Coding Practice
                                        </h3>

                                        <Code2 className="shrink-0 text-green-500" />
                                    </div>

                                    <p className="mt-3 text-sm leading-relaxed text-[#9299B5]">
                                        Build your problem-solving skills one problem at a time.
                                    </p>

                                    <button
                                        onClick={() => handleNavigation("Coding Practice")}
                                        className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#7045ED]"
                                    >
                                        Start practicing
                                        <ArrowUpRight size={16} />
                                    </button>

                                </div>

                                {/* Study Tracker */}
                                <div className="min-w-0 rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-bold text-[#18204D]">
                                            Daily Study Tracker
                                        </h3>

                                        <Clock className="shrink-0 text-blue-500" />
                                    </div>

                                    <p className="mt-3 text-sm leading-relaxed text-[#9299B5]">
                                        Record your study sessions and monitor your consistency.
                                    </p>

                                    <button
                                        onClick={() => handleNavigation("Study Tracker")}
                                        className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#7045ED]"
                                    >
                                        Track study time
                                        <ArrowUpRight size={16} />
                                    </button>

                                </div>

                                {/* Motivation */}
                                <div className="min-w-0 rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm">

                                    <div className="flex items-center justify-between gap-2">
                                        <h3 className="font-bold text-[#18204D]">
                                            Stay Consistent
                                        </h3>

                                        <Flame className="shrink-0 text-orange-500" />
                                    </div>

                                    <p className="mt-3 text-sm leading-relaxed text-[#9299B5]">
                                        Small daily efforts create big achievements. Keep learning!
                                    </p>

                                    <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-green-600">
                                        <CheckCircle2 size={17} className="shrink-0" />
                                        Your journey starts today
                                    </div>

                                </div>

                            </section>

                        </>
                    ) : (

                        <div className="rounded-2xl border border-[#EAE6FA] bg-white p-6 text-center shadow-sm sm:p-8 md:p-12">

                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#F3F0FF] text-purple-600">
                                <BookOpen size={30} />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-[#18204D]">
                                {activePage}
                            </h2>

                            <p className="mt-2 text-[#8991B1]">
                                This section is planned for the next development stage.
                            </p>

                            <button
                                onClick={() => setActivePage("Dashboard")}
                                className="mt-6 rounded-xl bg-[#7045ED] px-5 py-3 text-sm font-semibold text-white"
                            >
                                Back to Dashboard
                            </button>

                        </div>

                    )}

                    <footer className="py-8 text-center text-xs text-[#A0A5BD]">
                        © 2026 SkillTrack. Keep learning, keep growing.
                    </footer>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;
