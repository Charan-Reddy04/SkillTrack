
import { useEffect, useState } from "react";
import {
    Plus,
    Target,
    CheckCircle,
    Clock,
    AlertCircle,
    ArrowLeft
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import GoalForm from "../components/goals/GoalForm";
import GoalCard from "../components/goals/GoalCard";

import {
    getGoals,
    createGoal,
    updateGoal,
    deleteGoal
} from "../services/goalService";

const LearningGoals = () => {
    const navigate = useNavigate();

    const [goals, setGoals] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState("");

    // Load goals from backend
    const fetchGoals = async () => {
        try {
            setError("");

            const response = await getGoals();
            setGoals(response.goals || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load learning goals."
            );
        } finally {
            setPageLoading(false);
        }
    };

    useEffect(() => {
        fetchGoals();
    }, []);

    // Open form for creating a goal
    const handleAddGoal = () => {
        setEditingGoal(null);
        setShowForm(true);
        setError("");
    };

    // Open form for editing a goal
    const handleEditGoal = (goal) => {
        setEditingGoal(goal);
        setShowForm(true);
        setError("");
    };

    // Create or update a goal
    const handleSubmit = async (goalData) => {
        try {
            setLoading(true);
            setError("");

            if (editingGoal) {
                await updateGoal(editingGoal._id, goalData);
            } else {
                await createGoal(goalData);
            }

            setShowForm(false);
            setEditingGoal(null);

            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save learning goal."
            );
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Delete a goal
    const handleDeleteGoal = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this learning goal?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");

            await deleteGoal(id);
            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete this goal."
            );
        }
    };

    // Update goal progress
    const handleProgressChange = async (id, progress) => {
        try {
            setError("");

            await updateGoal(id, { progress });
            await fetchGoals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update progress."
            );
        }
    };

    // Summary counts
    const totalGoals = goals.length;

    const completedGoals = goals.filter(
        (goal) => goal.status === "Completed"
    ).length;

    const inProgressGoals = goals.filter(
        (goal) => goal.status === "In Progress"
    ).length;

    const notStartedGoals = goals.filter(
        (goal) => goal.status === "Not Started"
    ).length;

    // Summary cards
    const summaryCards = [
        {
            title: "Total Goals",
            value: totalGoals,
            icon: Target,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Completed",
            value: completedGoals,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "In Progress",
            value: inProgressGoals,
            icon: Clock,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Not Started",
            value: notStartedGoals,
            icon: AlertCircle,
            color: "bg-yellow-100 text-yellow-600"
        }
    ];

    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

                {/* Page Heading */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">

                    <div className="flex items-center gap-2 text-sm text-purple-100">
                        <Target size={17} />
                        Plan • Learn • Grow
                    </div>

                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        Learning Goals
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-purple-100 md:text-base">
                        Set your learning targets, manage your goals,
                        and track your personal growth.
                    </p>

                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        <span>{error}</span>
                    </div>
                )}

                {/* Add New Goal Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={handleAddGoal}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                    >
                        <Plus size={20} />
                        Add New Goal
                    </button>
                </div>

                {/* Summary Cards */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {summaryCards.map((card) => {
                        const Icon = card.icon;

                        return (
                            <div
                                key={card.title}
                                className="flex items-center gap-4 rounded-2xl border border-[#E9E5FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className={`rounded-xl p-3 ${card.color}`}>
                                    <Icon size={24} />
                                </div>

                                <div>
                                    <p className="text-sm text-[#68739B]">
                                        {card.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-[#10183F]">
                                        {card.value}
                                    </h2>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Goal Form */}
                {showForm && (
                    <div className="mb-8 flex justify-center">
                        <GoalForm
                            initialData={editingGoal}
                            onSubmit={handleSubmit}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingGoal(null);
                            }}
                            loading={loading}
                        />
                    </div>
                )}

                {/* Goals List */}
                <div>

                    <div className="mb-5">
                        <h2 className="text-xl font-bold text-[#10183F]">
                            My Learning Goals
                        </h2>

                        <p className="mt-1 text-sm text-[#68739B]">
                            Manage your goals and monitor your progress.
                        </p>
                    </div>

                    {pageLoading ? (

                        <div className="rounded-2xl border border-[#EAE6FA] bg-white p-10 text-center text-[#68739B] shadow-sm">
                            Loading your learning goals...
                        </div>

                    ) : goals.length === 0 ? (

                        <div className="rounded-2xl border border-dashed border-purple-300 bg-white p-10 text-center shadow-sm">

                            <Target className="mx-auto mb-4 h-12 w-12 text-purple-400" />

                            <h3 className="text-lg font-bold text-[#10183F]">
                                No Learning Goals Yet
                            </h3>

                            <p className="mt-2 text-sm text-[#68739B]">
                                Create your first goal and start tracking your learning journey.
                            </p>

                            <button
                                onClick={handleAddGoal}
                                className="mt-5 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                            >
                                Create Your First Goal
                            </button>

                        </div>

                    ) : (

                        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                            {goals.map((goal) => (
                                <GoalCard
                                    key={goal._id}
                                    goal={goal}
                                    onEdit={handleEditGoal}
                                    onDelete={handleDeleteGoal}
                                    onProgressChange={handleProgressChange}
                                />
                            ))}

                        </div>

                    )}

                </div>

                {/* Footer */}
                <footer className="py-8 text-center text-xs text-[#9299B5]">
                    © 2026 SkillTrack. Keep learning, keep growing.
                </footer>

            </div>
        </div>
    );
};

export default LearningGoals;
