
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    ExternalLink,
    Plus,
    BookOpen,
    Trash2,
    Target,
    X,
    Sparkles
} from "lucide-react";

import {
    getRoadmaps,
    createRoadmap,
    addRoadmapStep,
    updateRoadmapStep,
    deleteRoadmapStep,
    deleteRoadmap
} from "../services/roadmapService";

// Suggested external roadmaps
const availableRoadmaps = [
    {
        title: "Python Roadmap",
        category: "Programming",
        description: "Explore the Python learning roadmap.",
        url: "https://whimsical.com/python-roadmap-muTa9Bhw8tcxknuUc1L6w"
    },
    {
        title: "Backend Developer Roadmap",
        category: "Web Development",
        description: "Explore backend development concepts.",
        url: "https://whimsical.com/backend-developer-roadmap-59QidTEcR1FoWcjXYhpiXy"
    },
    {
        title: "System Design Roadmap",
        category: "System Design",
        description: "Explore system design concepts.",
        url: "https://whimsical.com/system-design-x-codewithnishchal-HgUy4s4neY4TJMR4eHMUDL"
    }
];

function RoadmapExplorer() {
    const navigate = useNavigate();

    const [roadmaps, setRoadmaps] = useState([]);
    const [selectedRoadmap, setSelectedRoadmap] = useState(null);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [showRoadmapForm, setShowRoadmapForm] = useState(false);

    // New roadmap form
    const [roadmapTitle, setRoadmapTitle] = useState("");
    const [roadmapDescription, setRoadmapDescription] = useState("");
    const [roadmapCategory, setRoadmapCategory] = useState("");
    const [roadmapType, setRoadmapType] = useState("Custom");
    const [sourceName, setSourceName] = useState("");
    const [sourceUrl, setSourceUrl] = useState("");

    // New topic form
    const [topicTitle, setTopicTitle] = useState("");
    const [topicDescription, setTopicDescription] = useState("");
    const [resourceUrl, setResourceUrl] = useState("");

    const inputStyle =
        "w-full rounded-xl border border-[#DED9F5] bg-white px-4 py-3 text-sm text-[#18204D] outline-none transition focus:border-purple-500 focus:ring-2 focus:ring-purple-100";

    // Load roadmaps
    const loadRoadmaps = async () => {
        try {
            const response = await getRoadmaps();
            setRoadmaps(response.roadmaps || []);
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not load roadmaps."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadRoadmaps();
    }, []);

    // Create a new Custom or External roadmap
    const handleCreateRoadmap = async (event) => {
        event.preventDefault();

        if (roadmapType === "External" && !sourceUrl.trim()) {
            setMessage("Please enter the external roadmap URL.");
            return;
        }

        try {
            const response = await createRoadmap({
                title: roadmapTitle,
                description: roadmapDescription,
                category: roadmapCategory,
                roadmapType,
                sourceName,
                sourceUrl
            });

            setRoadmaps((previous) => [
                response.roadmap,
                ...previous
            ]);

            setRoadmapTitle("");
            setRoadmapDescription("");
            setRoadmapCategory("");
            setRoadmapType("Custom");
            setSourceName("");
            setSourceUrl("");

            setShowRoadmapForm(false);
            setMessage("Your new roadmap was created successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not create roadmap."
            );
        }
    };

    // Add a suggested external roadmap
    const addToMyRoadmaps = async (item) => {
        const alreadyAdded = roadmaps.some(
            (roadmap) => roadmap.sourceUrl === item.url
        );

        if (alreadyAdded) {
            setMessage("This roadmap is already in your collection.");
            return;
        }

        try {
            const response = await createRoadmap({
                title: item.title,
                description: item.description,
                category: item.category,
                roadmapType: "External",
                sourceName: "CodeWithNishchal",
                sourceUrl: item.url
            });

            setRoadmaps((previous) => [
                response.roadmap,
                ...previous
            ]);

            setMessage("Roadmap added to your collection!");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not add roadmap."
            );
        }
    };

    // Open a selected roadmap
    const openRoadmap = (roadmap) => {
        setSelectedRoadmap(roadmap);
        setMessage("");
    };

    // Add a personal learning topic
    const addTopic = async (event) => {
        event.preventDefault();

        if (!selectedRoadmap || !topicTitle.trim()) return;

        try {
            const response = await addRoadmapStep(selectedRoadmap._id, {
                title: topicTitle,
                description: topicDescription,
                resourceUrl
            });

            setSelectedRoadmap(response.roadmap);

            setRoadmaps((previous) =>
                previous.map((item) =>
                    item._id === response.roadmap._id
                        ? response.roadmap
                        : item
                )
            );

            setTopicTitle("");
            setTopicDescription("");
            setResourceUrl("");

            setMessage("Learning topic added successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not add topic."
            );
        }
    };

    // Update topic status
    const changeTopicStatus = async (stepId, status) => {
        try {
            const response = await updateRoadmapStep(
                selectedRoadmap._id,
                stepId,
                { status }
            );

            setSelectedRoadmap(response.roadmap);

            setRoadmaps((previous) =>
                previous.map((item) =>
                    item._id === response.roadmap._id
                        ? response.roadmap
                        : item
                )
            );
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not update topic."
            );
        }
    };

    // Delete one learning topic
    const removeTopic = async (stepId) => {
        if (!window.confirm("Delete this learning topic?")) return;

        try {
            const response = await deleteRoadmapStep(
                selectedRoadmap._id,
                stepId
            );

            setSelectedRoadmap(response.roadmap);

            setRoadmaps((previous) =>
                previous.map((item) =>
                    item._id === response.roadmap._id
                        ? response.roadmap
                        : item
                )
            );

            setMessage("Topic deleted successfully.");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not delete topic."
            );
        }
    };

    // Delete the entire roadmap
    const removeRoadmap = async () => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${selectedRoadmap.title}" and all its topics?`
        );

        if (!confirmDelete) return;

        try {
            await deleteRoadmap(selectedRoadmap._id);

            setRoadmaps((previous) =>
                previous.filter(
                    (item) => item._id !== selectedRoadmap._id
                )
            );

            setSelectedRoadmap(null);
            setMessage("Roadmap deleted successfully!");
        } catch (error) {
            setMessage(
                error.response?.data?.message || "Could not delete roadmap."
            );
        }
    };

    return (
        <div className="min-h-screen bg-[#F5F3FF]">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">



                {/* Page heading */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">
                    <div className="flex items-center gap-2 text-sm text-purple-100">
                        <Sparkles size={17} />
                        Plan • Learn • Grow
                    </div>

                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        Roadmap Explorer
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-purple-100 md:text-base">
                        Discover learning roadmaps, create your own paths,
                        and track every topic you complete.
                    </p>
                </div>

                {/* Success and error messages */}
                {message && (
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-800">
                        <span>{message}</span>

                        <button onClick={() => setMessage("")}>
                            <X size={17} />
                        </button>
                    </div>
                )}

                {selectedRoadmap ? (
                    /* Individual roadmap page */
                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm md:p-7">

                        {/* Back and Delete buttons */}
                        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                            <button
                                onClick={() => {
                                    setSelectedRoadmap(null);
                                    setMessage("");
                                }}
                                className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-white px-4 py-2.5 text-sm font-semibold text-purple-700 shadow-sm transition hover:bg-purple-50"
                            >
                                <ArrowLeft size={17} />
                                Back to My Roadmaps
                            </button>

                            <button
                                onClick={removeRoadmap}
                                className="inline-flex items-center gap-2 rounded-xl border border-red-200 bg-white px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                            >
                                <Trash2 size={17} />
                                Delete Roadmap
                            </button>
                        </div>

                        <h2 className="text-2xl font-bold text-[#18204D]">
                            {selectedRoadmap.title}
                        </h2>

                        <p className="mt-2 text-sm text-gray-500">
                            {selectedRoadmap.description}
                        </p>

                        {selectedRoadmap.sourceUrl && (
                            <a
                                href={selectedRoadmap.sourceUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800"
                            >
                                Open original roadmap
                                <ExternalLink size={15} />
                            </a>
                        )}

                        {/* Progress */}
                        <div className="mt-7">
                            <div className="mb-2 flex justify-between text-sm">
                                <span className="font-semibold text-gray-700">
                                    Learning Progress
                                </span>

                                <span className="font-bold text-purple-600">
                                    {selectedRoadmap.progress || 0}%
                                </span>
                            </div>

                            <div className="h-3 overflow-hidden rounded-full bg-purple-100">
                                <div
                                    className="h-full rounded-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all"
                                    style={{
                                        width: `${selectedRoadmap.progress || 0}%`
                                    }}
                                />
                            </div>
                        </div>

                        {/* Add topic form */}
                        <form
                            onSubmit={addTopic}
                            className="mt-8 rounded-2xl bg-[#F8F7FF] p-5"
                        >
                            <h3 className="mb-4 flex items-center gap-2 font-bold text-[#18204D]">
                                <Plus size={19} className="text-purple-600" />
                                Add Learning Topic
                            </h3>

                            <div className="space-y-3">
                                <input
                                    value={topicTitle}
                                    onChange={(e) => setTopicTitle(e.target.value)}
                                    placeholder="Topic name (e.g. Python Basics)"
                                    className={inputStyle}
                                    required
                                />

                                <textarea
                                    value={topicDescription}
                                    onChange={(e) => setTopicDescription(e.target.value)}
                                    placeholder="Short description (optional)"
                                    className={inputStyle}
                                    rows="2"
                                />

                                <input
                                    type="url"
                                    value={resourceUrl}
                                    onChange={(e) => setResourceUrl(e.target.value)}
                                    placeholder="Learning resource URL (optional)"
                                    className={inputStyle}
                                />

                                <button
                                    type="submit"
                                    className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                >
                                    <Plus size={17} />
                                    Add Topic
                                </button>
                            </div>
                        </form>

                        {/* Learning topics */}
                        <div className="mt-8">
                            <h3 className="mb-4 font-bold text-[#18204D]">
                                My Learning Topics ({selectedRoadmap.steps?.length || 0})
                            </h3>

                            {selectedRoadmap.steps?.length === 0 ? (
                                <div className="rounded-xl bg-[#F8F7FF] p-6 text-center text-sm text-gray-500">
                                    No topics yet. Add your first topic above.
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {selectedRoadmap.steps?.map((step) => (
                                        <div
                                            key={step._id}
                                            className="flex flex-col gap-3 rounded-xl border border-[#EAE6FA] p-4 md:flex-row md:items-center"
                                        >
                                            <div className="min-w-0 flex-1">
                                                <h4 className="font-semibold text-[#18204D]">
                                                    {step.title}
                                                </h4>

                                                <p className="mt-1 text-sm text-gray-500">
                                                    {step.description}
                                                </p>

                                                {step.resourceUrl && (
                                                    <a
                                                        href={step.resourceUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-purple-600"
                                                    >
                                                        Open learning resource
                                                        <ExternalLink size={13} />
                                                    </a>
                                                )}
                                            </div>

                                            <select
                                                value={step.status}
                                                onChange={(e) =>
                                                    changeTopicStatus(
                                                        step._id,
                                                        e.target.value
                                                    )
                                                }
                                                className="rounded-lg border border-purple-200 bg-white p-2 text-sm outline-none focus:border-purple-500"
                                            >
                                                <option>Not Started</option>
                                                <option>In Progress</option>
                                                <option>Completed</option>
                                            </select>

                                            <button
                                                onClick={() => removeTopic(step._id)}
                                                className="self-start rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                                                title="Delete topic"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Explore roadmaps heading */}
                        <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                            <div>
                                <h2 className="text-xl font-bold text-[#18204D]">
                                    Explore Roadmaps
                                </h2>

                                <p className="mt-1 text-sm text-gray-500">
                                    Start with a suggested roadmap or add your own.
                                </p>
                            </div>

                            <button
                                onClick={() => setShowRoadmapForm(!showRoadmapForm)}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                            >
                                {showRoadmapForm ? <X size={18} /> : <Plus size={18} />}

                                {showRoadmapForm
                                    ? "Close Form"
                                    : "Add New Roadmap"}
                            </button>
                        </div>

                        {/* Create roadmap form */}
                        {showRoadmapForm && (
                            <form
                                onSubmit={handleCreateRoadmap}
                                className="mb-8 rounded-2xl border border-purple-100 bg-white p-5 shadow-sm md:p-7"
                            >
                                <h3 className="mb-5 text-lg font-bold text-[#18204D]">
                                    Create Your Roadmap
                                </h3>

                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Roadmap Title *
                                        </label>

                                        <input
                                            value={roadmapTitle}
                                            onChange={(e) => setRoadmapTitle(e.target.value)}
                                            placeholder="e.g. Java Roadmap"
                                            className={inputStyle}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Category *
                                        </label>

                                        <input
                                            value={roadmapCategory}
                                            onChange={(e) => setRoadmapCategory(e.target.value)}
                                            placeholder="e.g. Programming"
                                            className={inputStyle}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Roadmap Type *
                                        </label>

                                        <select
                                            value={roadmapType}
                                            onChange={(e) => setRoadmapType(e.target.value)}
                                            className={inputStyle}
                                        >
                                            <option value="Custom">
                                                Custom Roadmap
                                            </option>

                                            <option value="External">
                                                External Roadmap
                                            </option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            Source Name
                                        </label>

                                        <input
                                            value={sourceName}
                                            onChange={(e) => setSourceName(e.target.value)}
                                            placeholder="e.g. roadmap.sh"
                                            className={inputStyle}
                                        />
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <label className="mb-2 block text-sm font-semibold text-gray-700">
                                        Description
                                    </label>

                                    <textarea
                                        value={roadmapDescription}
                                        onChange={(e) => setRoadmapDescription(e.target.value)}
                                        placeholder="What do you want to learn?"
                                        className={inputStyle}
                                        rows="3"
                                    />
                                </div>

                                {roadmapType === "External" && (
                                    <div className="mt-4">
                                        <label className="mb-2 block text-sm font-semibold text-gray-700">
                                            External Roadmap URL *
                                        </label>

                                        <input
                                            type="url"
                                            value={sourceUrl}
                                            onChange={(e) => setSourceUrl(e.target.value)}
                                            placeholder="https://example.com/roadmap"
                                            className={inputStyle}
                                            required
                                        />
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                                >
                                    <Plus size={18} />
                                    Create Roadmap
                                </button>
                            </form>
                        )}

                        {/* Suggested roadmap cards */}
                        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                            {availableRoadmaps.map((item) => {
                                const alreadyAdded = roadmaps.some(
                                    (roadmap) => roadmap.sourceUrl === item.url
                                );

                                return (
                                    <div
                                        key={item.url}
                                        className="rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                                    >
                                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                                            <BookOpen size={24} />
                                        </div>

                                        <h3 className="mt-4 text-lg font-bold text-[#18204D]">
                                            {item.title}
                                        </h3>

                                        <p className="mt-1 text-xs font-semibold text-purple-600">
                                            {item.category}
                                        </p>

                                        <p className="mt-3 text-sm leading-relaxed text-gray-500">
                                            {item.description}
                                        </p>

                                        <a
                                            href={item.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-purple-600 hover:text-purple-800"
                                        >
                                            Open original roadmap
                                            <ExternalLink size={15} />
                                        </a>

                                        <button
                                            disabled={alreadyAdded}
                                            onClick={() => addToMyRoadmaps(item)}
                                            className="mt-5 w-full rounded-xl bg-purple-600 py-3 text-sm font-semibold text-white transition hover:bg-purple-700 disabled:bg-green-100 disabled:text-green-700"
                                        >
                                            {alreadyAdded
                                                ? "Added to My Roadmaps"
                                                : "Add to My Roadmaps"}
                                        </button>
                                    </div>
                                );
                            })}
                        </div>

                        {/* My Roadmaps */}
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-[#18204D]">
                                My Roadmaps
                            </h2>

                            <p className="mb-5 mt-1 text-sm text-gray-500">
                                Your personal roadmaps and learning progress.
                            </p>

                            {loading ? (
                                <p className="text-sm text-gray-500">
                                    Loading your roadmaps...
                                </p>
                            ) : roadmaps.length === 0 ? (
                                <div className="rounded-2xl border border-[#EAE6FA] bg-white p-8 text-center shadow-sm">
                                    <Target
                                        className="mx-auto text-purple-500"
                                        size={36}
                                    />

                                    <h3 className="mt-3 font-bold text-[#18204D]">
                                        No roadmaps added yet
                                    </h3>

                                    <p className="mt-2 text-sm text-gray-500">
                                        Add a suggested roadmap or create your own.
                                    </p>
                                </div>
                            ) : (
                                <div className="grid gap-4 md:grid-cols-2">
                                    {roadmaps.map((roadmap) => (
                                        <button
                                            key={roadmap._id}
                                            onClick={() => openRoadmap(roadmap)}
                                            className="rounded-2xl border border-[#EAE6FA] bg-white p-5 text-left shadow-sm transition hover:border-purple-300 hover:shadow-md"
                                        >
                                            <div className="flex items-center justify-between gap-3">
                                                <h3 className="font-bold text-[#18204D]">
                                                    {roadmap.title}
                                                </h3>

                                                <span className="text-sm font-bold text-purple-600">
                                                    {roadmap.progress || 0}%
                                                </span>
                                            </div>

                                            <p className="mt-2 text-xs text-gray-500">
                                                {roadmap.category} • {roadmap.steps?.length || 0} topics
                                            </p>

                                            <div className="mt-4 h-2 overflow-hidden rounded-full bg-purple-100">
                                                <div
                                                    className="h-full rounded-full bg-purple-600"
                                                    style={{
                                                        width: `${roadmap.progress || 0}%`
                                                    }}
                                                />
                                            </div>

                                            <p className="mt-3 text-xs font-semibold text-purple-600">
                                                Open roadmap →
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                <footer className="py-8 text-center text-xs text-[#9299B5]">
                    © 2026 SkillTrack. Keep learning, keep growing.
                </footer>
            </div>
        </div>
    );
}

export default RoadmapExplorer;
