
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Code2,
    Plus,
    Search,
    Pencil,
    Trash2,
    ExternalLink,
    X,
    CheckCircle,
    Clock,
    Target,
    CircleDashed
} from "lucide-react";

import {
    getCodingProblems,
    createCodingProblem,
    updateCodingProblem,
    deleteCodingProblem
} from "../services/codingProblemService";

const emptyForm = {
    title: "",
    problemUrl: "",
    platform: "LeetCode",
    topic: "",
    difficulty: "Easy",
    status: "Not Started",
    timeTaken: 0,
    notes: ""
};

function CodingPractice() {
    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [difficultyFilter, setDifficultyFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const inputStyle =
        "w-full rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 text-sm text-[#10183F] outline-none transition focus:border-[#773CEB] focus:ring-2 focus:ring-purple-100";

    // Load problems
    const loadProblems = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getCodingProblems();

            setProblems(response.problems || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load coding problems."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProblems();
    }, []);

    // Handle form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: name === "timeTaken" ? Number(value) : value
        }));
    };

    // Open add form
    const handleAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
        setError("");
        setMessage("");
    };

    // Open edit form
    const handleEdit = (problem) => {
        setEditingId(problem._id);

        setFormData({
            title: problem.title || "",
            problemUrl: problem.problemUrl || "",
            platform: problem.platform || "LeetCode",
            topic: problem.topic || "",
            difficulty: problem.difficulty || "Easy",
            status: problem.status || "Not Started",
            timeTaken: problem.timeTaken || 0,
            notes: problem.notes || ""
        });

        setShowForm(true);
        setError("");
        setMessage("");
    };

    // Add or update problem
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const data = {
                ...formData,
                timeTaken: Number(formData.timeTaken)
            };

            if (editingId) {
                await updateCodingProblem(editingId, data);
                setMessage("Problem updated successfully.");
            } else {
                await createCodingProblem(data);
                setMessage("Problem added successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);

            await loadProblems();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save coding problem."
            );
        } finally {
            setSaving(false);
        }
    };

    // Change problem status
    const handleStatusChange = async (id, status) => {
        try {
            setError("");
            setMessage("");

            await updateCodingProblem(id, { status });

            setProblems((previous) =>
                previous.map((problem) =>
                    problem._id === id
                        ? { ...problem, status }
                        : problem
                )
            );

            setMessage("Problem status updated.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update problem status."
            );
        }
    };

    // Delete problem
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this problem?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteCodingProblem(id);

            setProblems((previous) =>
                previous.filter((problem) => problem._id !== id)
            );

            setMessage("Problem deleted successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete problem."
            );
        }
    };

    // Statistics
    const totalProblems = problems.length;

    const solvedProblems = problems.filter(
        (problem) => problem.status === "Solved"
    ).length;

    const attemptedProblems = problems.filter(
        (problem) => problem.status === "Attempted"
    ).length;

    const notStartedProblems = problems.filter(
        (problem) => problem.status === "Not Started"
    ).length;

    const stats = [
        {
            title: "Total Problems",
            value: totalProblems,
            icon: Target,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Solved",
            value: solvedProblems,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Attempted",
            value: attemptedProblems,
            icon: Clock,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Not Started",
            value: notStartedProblems,
            icon: CircleDashed,
            color: "bg-yellow-100 text-yellow-600"
        }
    ];

    // Search and filters
    const filteredProblems = problems.filter((problem) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            (problem.title || "").toLowerCase().includes(searchText) ||
            (problem.topic || "").toLowerCase().includes(searchText);

        const matchesPlatform =
            platformFilter === "All" ||
            problem.platform === platformFilter;

        const matchesDifficulty =
            difficultyFilter === "All" ||
            problem.difficulty === difficultyFilter;

        const matchesStatus =
            statusFilter === "All" ||
            problem.status === statusFilter;

        return (
            matchesSearch &&
            matchesPlatform &&
            matchesDifficulty &&
            matchesStatus
        );
    });

    // Difficulty colors
    const difficultyColor = (difficulty) => {
        if (difficulty === "Easy") {
            return "bg-green-100 text-green-700";
        }

        if (difficulty === "Medium") {
            return "bg-yellow-100 text-yellow-700";
        }

        return "bg-red-100 text-red-700";
    };

    // Status colors
    const statusColor = (status) => {
        if (status === "Solved") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Attempted") {
            return "bg-blue-100 text-blue-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">


                {/* Page Heading */}
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">

                    <div className="flex items-center gap-2 text-sm text-purple-100">
                        <Code2 size={18} />
                        Practice • Solve • Improve
                    </div>

                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        Coding Practice
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-purple-100 md:text-base">
                        Track your coding problems, improve your
                        problem-solving skills, and measure your progress.
                    </p>

                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Add Problem Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                    >
                        <Plus size={19} />
                        Add Problem
                    </button>
                </div>

                {/* Statistics */}
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    {stats.map((stat) => {
                        const Icon = stat.icon;

                        return (
                            <div
                                key={stat.title}
                                className="flex items-center gap-4 rounded-2xl border border-[#E9E5FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                <div className={`rounded-xl p-3 ${stat.color}`}>
                                    <Icon size={24} />
                                </div>

                                <div>
                                    <p className="text-sm text-[#68739B]">
                                        {stat.title}
                                    </p>

                                    <h2 className="text-2xl font-bold text-[#10183F]">
                                        {stat.value}
                                    </h2>
                                </div>
                            </div>
                        );
                    })}

                </div>

                {/* Progress */}
                <div className="mb-8 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm">

                    <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <h2 className="font-bold text-[#10183F]">
                            Overall Solving Progress
                        </h2>

                        <span className="text-sm font-bold text-purple-700">
                            {totalProblems === 0
                                ? 0
                                : Math.round((solvedProblems / totalProblems) * 100)}%
                        </span>
                    </div>

                    <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                        <div
                            className="h-full rounded-full bg-gradient-to-r from-[#5030E8] to-[#9148E9] transition-all"
                            style={{
                                width: `${
                                    totalProblems === 0
                                        ? 0
                                        : (solvedProblems / totalProblems) * 100
                                }%`
                            }}
                        />
                    </div>

                    <p className="mt-3 text-xs text-[#68739B]">
                        {solvedProblems} solved out of {totalProblems} saved problems.
                    </p>

                </div>

                {/* Add / Edit Form */}
                {showForm && (
                    <div className="mb-8 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm sm:p-7">

                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-[#10183F]">
                                {editingId ? "Edit Coding Problem" : "Add New Coding Problem"}
                            </h2>

                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                }}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Problem Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Example: Two Sum"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Problem Link *
                                    </label>

                                    <input
                                        type="url"
                                        name="problemUrl"
                                        value={formData.problemUrl}
                                        onChange={handleChange}
                                        placeholder="https://leetcode.com/problems/two-sum/"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Platform *
                                    </label>

                                    <select
                                        name="platform"
                                        value={formData.platform}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="LeetCode">LeetCode</option>
                                        <option value="HackerRank">HackerRank</option>
                                        <option value="CodeChef">CodeChef</option>
                                        <option value="Codeforces">Codeforces</option>
                                        <option value="GeeksforGeeks">GeeksforGeeks</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Topic *
                                    </label>

                                    <input
                                        type="text"
                                        name="topic"
                                        value={formData.topic}
                                        onChange={handleChange}
                                        placeholder="Example: Arrays"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Difficulty
                                    </label>

                                    <select
                                        name="difficulty"
                                        value={formData.difficulty}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="Easy">Easy</option>
                                        <option value="Medium">Medium</option>
                                        <option value="Hard">Hard</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="Attempted">Attempted</option>
                                        <option value="Solved">Solved</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Time Taken (Minutes)
                                    </label>

                                    <input
                                        type="number"
                                        name="timeTaken"
                                        min="0"
                                        value={formData.timeTaken}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    />
                                </div>

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                    Personal Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    placeholder="Write your approach, mistakes or what you learned..."
                                    className={inputStyle}
                                />
                            </div>

                            <div className="flex flex-wrap gap-3">

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Problem"
                                            : "Save Problem"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                    }}
                                    className="rounded-xl border border-[#D9D5FA] px-6 py-3 text-sm font-semibold text-[#68739B] hover:bg-purple-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-6 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm">

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68739B]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search problems..."
                                className={`${inputStyle} pl-10`}
                            />
                        </div>

                        <select
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                            className={inputStyle}
                        >
                            <option value="All">All Platforms</option>
                            <option value="LeetCode">LeetCode</option>
                            <option value="HackerRank">HackerRank</option>
                            <option value="CodeChef">CodeChef</option>
                            <option value="Codeforces">Codeforces</option>
                            <option value="GeeksforGeeks">GeeksforGeeks</option>
                            <option value="Other">Other</option>
                        </select>

                        <select
                            value={difficultyFilter}
                            onChange={(e) => setDifficultyFilter(e.target.value)}
                            className={inputStyle}
                        >
                            <option value="All">All Difficulties</option>
                            <option value="Easy">Easy</option>
                            <option value="Medium">Medium</option>
                            <option value="Hard">Hard</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={inputStyle}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Not Started">Not Started</option>
                            <option value="Attempted">Attempted</option>
                            <option value="Solved">Solved</option>
                        </select>

                    </div>

                </div>

                {/* Problems List */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-[#10183F]">
                        My Coding Problems
                    </h2>

                    <p className="mt-1 text-sm text-[#68739B]">
                        Your saved coding practice questions.
                    </p>
                </div>

                {loading ? (

                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-10 text-center text-[#68739B] shadow-sm">
                        Loading coding problems...
                    </div>

                ) : filteredProblems.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-purple-300 bg-white px-5 py-14 text-center shadow-sm">

                        <Code2
                            size={45}
                            className="mx-auto mb-4 text-purple-400"
                        />

                        <h3 className="text-lg font-bold text-[#10183F]">
                            No Coding Problems Found
                        </h3>

                        <p className="mt-2 text-sm text-[#68739B]">
                            Add a problem or change your search filters.
                        </p>

                        {problems.length === 0 && (
                            <button
                                onClick={handleAdd}
                                className="mt-5 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
                            >
                                Add Your First Problem
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {filteredProblems.map((problem) => (

                            <div
                                key={problem._id}
                                className="rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="mb-4 flex items-start justify-between gap-3">

                                    <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                        <Code2 size={22} />
                                    </div>

                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${difficultyColor(problem.difficulty)}`}>
                                        {problem.difficulty}
                                    </span>

                                </div>

                                <h3 className="break-words text-lg font-bold text-[#10183F]">
                                    {problem.title}
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">

                                    <span className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                                        {problem.platform}
                                    </span>

                                    <span className="rounded-lg bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">
                                        {problem.topic}
                                    </span>

                                </div>

                                <div className="mt-5">

                                    <label className="mb-2 block text-xs font-semibold text-[#68739B]">
                                        Update Problem Status
                                    </label>

                                    <select
                                        value={problem.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                problem._id,
                                                e.target.value
                                            )
                                        }
                                        className={`${inputStyle} ${statusColor(problem.status)}`}
                                    >
                                        <option value="Not Started">Not Started</option>
                                        <option value="Attempted">Attempted</option>
                                        <option value="Solved">Solved</option>
                                    </select>

                                </div>

                                {problem.timeTaken > 0 && (
                                    <p className="mt-3 text-xs text-[#68739B]">
                                        Time taken: {problem.timeTaken} minutes
                                    </p>
                                )}

                                {problem.notes && (
                                    <div className="mt-4 rounded-xl bg-gray-50 p-3">
                                        <p className="text-xs font-semibold text-[#10183F]">
                                            My Notes
                                        </p>

                                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#68739B]">
                                            {problem.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

                                    <a
                                        href={problem.problemUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                                    >
                                        Open Problem
                                        <ExternalLink size={16} />
                                    </a>

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => handleEdit(problem)}
                                            title="Edit problem"
                                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(problem._id)}
                                            title="Delete problem"
                                            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                        >
                                            <Trash2 size={17} />
                                        </button>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

                {/* Footer */}
                <footer className="py-8 text-center text-xs text-[#9299B5]">
                    © 2026 SkillTrack. Keep learning, keep growing.
                </footer>

            </div>
        </div>
    );
}

export default CodingPractice;
