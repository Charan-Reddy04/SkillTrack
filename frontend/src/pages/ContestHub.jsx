
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Trophy,
    Plus,
    Search,
    Pencil,
    Trash2,
    ExternalLink,
    X,
    CalendarDays,
    CheckCircle,
    Clock,
    Flag
} from "lucide-react";

import {
    getContests,
    createContest,
    updateContest,
    deleteContest
} from "../services/contestService";

const emptyForm = {
    contestName: "",
    platform: "LeetCode",
    contestUrl: "",
    startDate: "",
    duration: 0,
    status: "Not Registered",
    rank: "",
    problemsSolved: 0,
    score: 0,
    notes: ""
};

function ContestHub() {
    const navigate = useNavigate();

    const [contests, setContests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const [search, setSearch] = useState("");
    const [platformFilter, setPlatformFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");

    const inputStyle =
        "w-full rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 text-sm text-[#10183F] outline-none transition focus:border-[#773CEB] focus:ring-2 focus:ring-purple-100";

    // Format date for the date input
    const toDateInput = (date) => {
        if (!date) return "";

        const value = new Date(date);

        const year = value.getFullYear();
        const month = String(value.getMonth() + 1).padStart(2, "0");
        const day = String(value.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    };

    // Load contests
    const loadContests = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getContests();
            setContests(response.contests || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load contests."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadContests();
    }, []);

    // Form changes
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
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
    const handleEdit = (contest) => {
        setEditingId(contest._id);

        setFormData({
            contestName: contest.contestName || "",
            platform: contest.platform || "LeetCode",
            contestUrl: contest.contestUrl || "",
            startDate: toDateInput(contest.startDate),
            duration: contest.duration ?? 0,
            status: contest.status || "Not Registered",
            rank: contest.rank ?? "",
            problemsSolved: contest.problemsSolved ?? 0,
            score: contest.score ?? 0,
            notes: contest.notes || ""
        });

        setShowForm(true);
        setError("");
        setMessage("");
    };

    // Add or update contest
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const data = {
                ...formData,
                duration: Number(formData.duration),
                rank: formData.rank === "" ? null : Number(formData.rank),
                problemsSolved: Number(formData.problemsSolved),
                score: Number(formData.score)
            };

            if (editingId) {
                await updateContest(editingId, data);
                setMessage("Contest updated successfully.");
            } else {
                await createContest(data);
                setMessage("Contest added successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);

            await loadContests();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save contest."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete contest
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this contest?"
        );

        if (!confirmDelete) return;

        try {
            setError("");
            setMessage("");

            await deleteContest(id);

            setContests((previous) =>
                previous.filter((contest) => contest._id !== id)
            );

            setMessage("Contest deleted successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete contest."
            );
        }
    };

    // Update participation status
    const handleStatusChange = async (id, status) => {
        try {
            setError("");
            setMessage("");

            await updateContest(id, { status });

            setContests((previous) =>
                previous.map((contest) =>
                    contest._id === id
                        ? { ...contest, status }
                        : contest
                )
            );

            setMessage("Contest status updated.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update contest status."
            );
        }
    };

    // Statistics
    const totalContests = contests.length;

    const registered = contests.filter(
        (contest) => contest.status === "Registered"
    ).length;

    const participated = contests.filter(
        (contest) => contest.status === "Participated"
    ).length;

    const missed = contests.filter(
        (contest) => contest.status === "Missed"
    ).length;

    const stats = [
        {
            title: "Total Contests",
            value: totalContests,
            icon: Trophy,
            color: "bg-purple-100 text-purple-600"
        },
        {
            title: "Registered",
            value: registered,
            icon: CalendarDays,
            color: "bg-blue-100 text-blue-600"
        },
        {
            title: "Participated",
            value: participated,
            icon: CheckCircle,
            color: "bg-green-100 text-green-600"
        },
        {
            title: "Missed",
            value: missed,
            icon: Clock,
            color: "bg-yellow-100 text-yellow-600"
        }
    ];

    // Search and filters
    const filteredContests = contests.filter((contest) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            (contest.contestName || "").toLowerCase().includes(searchText) ||
            (contest.platform || "").toLowerCase().includes(searchText);

        const matchesPlatform =
            platformFilter === "All" ||
            contest.platform === platformFilter;

        const matchesStatus =
            statusFilter === "All" ||
            contest.status === statusFilter;

        return matchesSearch && matchesPlatform && matchesStatus;
    });

    // Status colors
    const statusColor = (status) => {
        if (status === "Participated") {
            return "bg-green-100 text-green-700";
        }

        if (status === "Registered") {
            return "bg-blue-100 text-blue-700";
        }

        if (status === "Missed") {
            return "bg-red-100 text-red-700";
        }

        return "bg-gray-100 text-gray-700";
    };

    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

                {/* Heading */}
                <div className="mb-8 rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">

                    <div className="flex items-center gap-2 text-sm text-purple-100">
                        <Trophy size={18} />
                        Compete • Participate • Achieve
                    </div>

                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        Contest Hub
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-purple-100 md:text-base">
                        Organize coding contests, record your participation,
                        and track your competitive programming journey.
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

                {/* Add Contest */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                    >
                        <Plus size={19} />
                        Add Contest
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

                {/* Add / Edit Form */}
                {showForm && (
                    <div className="mb-8 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm sm:p-7">

                        <div className="mb-6 flex items-center justify-between gap-3">
                            <h2 className="text-lg font-bold text-[#10183F]">
                                {editingId ? "Edit Contest" : "Add New Contest"}
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
                                        Contest Name *
                                    </label>

                                    <input
                                        type="text"
                                        name="contestName"
                                        value={formData.contestName}
                                        onChange={handleChange}
                                        placeholder="Example: Weekly Contest"
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
                                        <option value="CodeChef">CodeChef</option>
                                        <option value="Codeforces">Codeforces</option>
                                        <option value="HackerRank">HackerRank</option>
                                        <option value="GeeksforGeeks">GeeksforGeeks</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Contest Link *
                                    </label>

                                    <input
                                        type="url"
                                        name="contestUrl"
                                        value={formData.contestUrl}
                                        onChange={handleChange}
                                        placeholder="https://example.com/contest"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Contest Date *
                                    </label>

                                    <input
                                        type="date"
                                        name="startDate"
                                        value={formData.startDate}
                                        onChange={handleChange}
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Duration (Minutes)
                                    </label>

                                    <input
                                        type="number"
                                        name="duration"
                                        min="0"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Participation Status
                                    </label>

                                    <select
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="Not Registered">Not Registered</option>
                                        <option value="Registered">Registered</option>
                                        <option value="Participated">Participated</option>
                                        <option value="Missed">Missed</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Rank
                                    </label>

                                    <input
                                        type="number"
                                        name="rank"
                                        min="1"
                                        value={formData.rank}
                                        onChange={handleChange}
                                        placeholder="Example: 120"
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Problems Solved
                                    </label>

                                    <input
                                        type="number"
                                        name="problemsSolved"
                                        min="0"
                                        value={formData.problemsSolved}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Score
                                    </label>

                                    <input
                                        type="number"
                                        name="score"
                                        min="0"
                                        value={formData.score}
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
                                    placeholder="Write your contest experience and what you learned..."
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
                                            ? "Update Contest"
                                            : "Save Contest"}
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

                    <div className="grid gap-4 md:grid-cols-3">

                        <div className="relative">
                            <Search
                                size={18}
                                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68739B]"
                            />

                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search contests..."
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
                            <option value="CodeChef">CodeChef</option>
                            <option value="Codeforces">Codeforces</option>
                            <option value="HackerRank">HackerRank</option>
                            <option value="GeeksforGeeks">GeeksforGeeks</option>
                            <option value="Other">Other</option>
                        </select>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className={inputStyle}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Not Registered">Not Registered</option>
                            <option value="Registered">Registered</option>
                            <option value="Participated">Participated</option>
                            <option value="Missed">Missed</option>
                        </select>

                    </div>

                </div>

                {/* Contest List */}
                <div className="mb-5">
                    <h2 className="text-xl font-bold text-[#10183F]">
                        My Contests
                    </h2>

                    <p className="mt-1 text-sm text-[#68739B]">
                        View and manage your coding contest history.
                    </p>
                </div>

                {loading ? (

                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-10 text-center text-[#68739B] shadow-sm">
                        Loading contests...
                    </div>

                ) : filteredContests.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-purple-300 bg-white px-5 py-14 text-center shadow-sm">

                        <Trophy
                            size={45}
                            className="mx-auto mb-4 text-purple-400"
                        />

                        <h3 className="text-lg font-bold text-[#10183F]">
                            No Contests Found
                        </h3>

                        <p className="mt-2 text-sm text-[#68739B]">
                            Add a contest or change your search filters.
                        </p>

                        {contests.length === 0 && (
                            <button
                                onClick={handleAdd}
                                className="mt-5 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md hover:opacity-90"
                            >
                                Add Your First Contest
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {filteredContests.map((contest) => (

                            <div
                                key={contest._id}
                                className="rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="mb-4 flex items-start justify-between gap-3">

                                    <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                        <Trophy size={22} />
                                    </div>

                                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusColor(contest.status)}`}>
                                        {contest.status}
                                    </span>

                                </div>

                                <h3 className="break-words text-lg font-bold text-[#10183F]">
                                    {contest.contestName}
                                </h3>

                                <div className="mt-3 flex flex-wrap gap-2">
                                    <span className="rounded-lg bg-purple-50 px-3 py-1 text-xs font-medium text-purple-700">
                                        {contest.platform}
                                    </span>
                                </div>

                                <div className="mt-4 space-y-2 text-sm text-[#68739B]">

                                    <p className="flex items-center gap-2">
                                        <CalendarDays size={16} />
                                        {new Date(contest.startDate).toLocaleDateString()}
                                    </p>

                                    <p className="flex items-center gap-2">
                                        <Clock size={16} />
                                        {contest.duration || 0} minutes
                                    </p>

                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-xs font-semibold text-[#68739B]">
                                        Update Participation Status
                                    </label>

                                    <select
                                        value={contest.status}
                                        onChange={(e) =>
                                            handleStatusChange(
                                                contest._id,
                                                e.target.value
                                            )
                                        }
                                        className={`${inputStyle} ${statusColor(contest.status)}`}
                                    >
                                        <option value="Not Registered">Not Registered</option>
                                        <option value="Registered">Registered</option>
                                        <option value="Participated">Participated</option>
                                        <option value="Missed">Missed</option>
                                    </select>
                                </div>

                                {contest.status === "Participated" && (
                                    <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-[#F8F6FF] p-3 text-center">

                                        <div>
                                            <p className="text-xs text-[#68739B]">Rank</p>
                                            <p className="mt-1 font-bold text-[#10183F]">
                                                {contest.rank ?? "-"}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#68739B]">Solved</p>
                                            <p className="mt-1 font-bold text-[#10183F]">
                                                {contest.problemsSolved}
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xs text-[#68739B]">Score</p>
                                            <p className="mt-1 font-bold text-[#10183F]">
                                                {contest.score}
                                            </p>
                                        </div>

                                    </div>
                                )}

                                {contest.notes && (
                                    <div className="mt-4 rounded-xl bg-gray-50 p-3">
                                        <p className="text-xs font-semibold text-[#10183F]">
                                            My Notes
                                        </p>

                                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#68739B]">
                                            {contest.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

                                    <a
                                        href={contest.contestUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-purple-700 hover:text-purple-900"
                                    >
                                        Open Contest
                                        <ExternalLink size={16} />
                                    </a>

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => handleEdit(contest)}
                                            title="Edit contest"
                                            className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(contest._id)}
                                            title="Delete contest"
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

                <footer className="py-8 text-center text-xs text-[#9299B5]">
                    © 2026 SkillTrack. Keep learning, keep growing.
                </footer>

            </div>
        </div>
    );
}

export default ContestHub;
