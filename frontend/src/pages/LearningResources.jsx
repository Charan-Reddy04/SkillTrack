
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowLeft,
    Plus,
    Search,
    BookOpen,
    ExternalLink,
    Pencil,
    Trash2,
    X,
    Link as LinkIcon
} from "lucide-react";

import {
    getResources,
    createResource,
    updateResource,
    deleteResource
} from "../services/resourceService";

const emptyForm = {
    title: "",
    description: "",
    url: "",
    category: "",
    resourceType: "Website",
    notes: ""
};

function LearningResources() {
    const navigate = useNavigate();

    const [resources, setResources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [typeFilter, setTypeFilter] = useState("All");

    const inputStyle =
        "w-full rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 text-sm text-[#10183F] outline-none transition focus:border-[#773CEB] focus:ring-2 focus:ring-purple-100";

    // Load resources from backend
    const loadResources = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getResources();
            setResources(response.resources || []);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load resources."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadResources();
    }, []);

    // Update form fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));
    };

    // Open form for adding a resource
    const handleAdd = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
        setMessage("");
        setError("");
    };

    // Open form for editing a resource
    const handleEdit = (resource) => {
        setEditingId(resource._id);

        setFormData({
            title: resource.title || "",
            description: resource.description || "",
            url: resource.url || "",
            category: resource.category || "",
            resourceType: resource.resourceType || "Website",
            notes: resource.notes || ""
        });

        setShowForm(true);
        setMessage("");
        setError("");
    };

    // Save new or updated resource
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingId) {
                await updateResource(editingId, formData);
                setMessage("Resource updated successfully.");
            } else {
                await createResource(formData);
                setMessage("Resource added successfully.");
            }

            setFormData(emptyForm);
            setEditingId(null);
            setShowForm(false);

            await loadResources();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save resource."
            );
        } finally {
            setSaving(false);
        }
    };

    // Delete a resource
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this resource?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            setError("");
            setMessage("");

            await deleteResource(id);

            setResources((previous) =>
                previous.filter((resource) => resource._id !== id)
            );

            setMessage("Resource deleted successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete resource."
            );
        }
    };

    // Get available categories
    const categories = [
        "All",
        ...new Set(resources.map((resource) => resource.category))
    ];

    // Search and filter resources
    const filteredResources = resources.filter((resource) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
            (resource.title || "").toLowerCase().includes(searchText) ||
            (resource.category || "").toLowerCase().includes(searchText) ||
            (resource.description || "").toLowerCase().includes(searchText);

        const matchesCategory =
            categoryFilter === "All" ||
            resource.category === categoryFilter;

        const matchesType =
            typeFilter === "All" ||
            resource.resourceType === typeFilter;

        return matchesSearch && matchesCategory && matchesType;
    });

    return (
        <div className="min-h-screen bg-[#F5F3FF]">

            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">


                {/* Page Heading */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">

                    <div className="flex items-center gap-2 text-sm text-purple-100">
                        <BookOpen size={17} />
                        Learn • Explore • Improve
                    </div>

                    <h1 className="mt-3 text-3xl font-bold md:text-4xl">
                        Learning Resources
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-purple-100 md:text-base">
                        Save, organize, and access your favorite learning
                        materials from one place.
                    </p>

                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
                        <span>{message}</span>

                        <button onClick={() => setMessage("")}>
                            <X size={17} />
                        </button>
                    </div>
                )}

                {error && (
                    <div className="mb-5 flex items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        <span>{error}</span>

                        <button onClick={() => setError("")}>
                            <X size={17} />
                        </button>
                    </div>
                )}

                {/* Add Resource Button */}
                <div className="mb-6 flex justify-end">
                    <button
                        onClick={handleAdd}
                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                    >
                        <Plus size={18} />
                        Add Resource
                    </button>
                </div>

                {/* Add / Edit Form */}
                {showForm && (
                    <div className="mb-8 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm sm:p-7">

                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-[#10183F]">
                                {editingId ? "Edit Resource" : "Add New Resource"}
                            </h2>

                            <button
                                onClick={() => {
                                    setShowForm(false);
                                    setEditingId(null);
                                }}
                                className="rounded-lg p-2 text-gray-500 transition hover:bg-gray-100"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">

                            <div className="grid gap-5 md:grid-cols-2">

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Resource Title *
                                    </label>

                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Example: Python Tutorial"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Resource URL *
                                    </label>

                                    <input
                                        type="url"
                                        name="url"
                                        value={formData.url}
                                        onChange={handleChange}
                                        placeholder="https://example.com"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Category *
                                    </label>

                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        placeholder="Example: Programming"
                                        className={inputStyle}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                        Resource Type
                                    </label>

                                    <select
                                        name="resourceType"
                                        value={formData.resourceType}
                                        onChange={handleChange}
                                        className={inputStyle}
                                    >
                                        <option value="Documentation">Documentation</option>
                                        <option value="Video">Video</option>
                                        <option value="Course">Course</option>
                                        <option value="Website">Website</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>

                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                    Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="What will you learn from this resource?"
                                    rows="3"
                                    className={inputStyle}
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                                    Personal Notes
                                </label>

                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    placeholder="Add your own notes..."
                                    rows="2"
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
                                            ? "Update Resource"
                                            : "Save Resource"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setEditingId(null);
                                    }}
                                    className="rounded-xl border border-[#D9D5FA] px-6 py-3 text-sm font-semibold text-[#68739B] transition hover:bg-purple-50"
                                >
                                    Cancel
                                </button>

                            </div>

                        </form>
                    </div>
                )}

                {/* Resource Count */}
                <div className="mb-6 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm">

                    <div className="flex items-center gap-4">

                        <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                            <BookOpen size={25} />
                        </div>

                        <div>
                            <p className="text-sm text-[#68739B]">
                                Total Saved Resources
                            </p>

                            <h2 className="text-2xl font-bold text-[#10183F]">
                                {resources.length}
                            </h2>
                        </div>

                    </div>

                </div>

                {/* Search and Filters */}
                <div className="mb-6 grid gap-4 rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm md:grid-cols-3">

                    <div className="relative">
                        <Search
                            size={18}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#68739B]"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search resources..."
                            className={`${inputStyle} pl-10`}
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className={inputStyle}
                    >
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category === "All" ? "All Categories" : category}
                            </option>
                        ))}
                    </select>

                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className={inputStyle}
                    >
                        <option value="All">All Resource Types</option>
                        <option value="Documentation">Documentation</option>
                        <option value="Video">Video</option>
                        <option value="Course">Course</option>
                        <option value="Website">Website</option>
                        <option value="Other">Other</option>
                    </select>

                </div>

                {/* Resource Cards */}
                {loading ? (

                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-10 text-center text-[#68739B] shadow-sm">
                        Loading resources...
                    </div>

                ) : filteredResources.length === 0 ? (

                    <div className="rounded-2xl border border-dashed border-purple-300 bg-white px-5 py-14 text-center shadow-sm">

                        <BookOpen
                            size={45}
                            className="mx-auto mb-4 text-purple-400"
                        />

                        <h3 className="text-lg font-bold text-[#10183F]">
                            No resources found
                        </h3>

                        <p className="mt-2 text-sm text-[#68739B]">
                            Add a learning resource or change your search filters.
                        </p>

                        {resources.length === 0 && (
                            <button
                                onClick={handleAdd}
                                className="mt-5 rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
                            >
                                Add Your First Resource
                            </button>
                        )}

                    </div>

                ) : (

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                        {filteredResources.map((resource) => (

                            <div
                                key={resource._id}
                                className="rounded-2xl border border-[#E5E0FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >

                                <div className="mb-4 flex items-start justify-between gap-3">

                                    <div className="rounded-xl bg-purple-100 p-3 text-purple-700">
                                        <LinkIcon size={22} />
                                    </div>

                                    <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
                                        {resource.resourceType}
                                    </span>

                                </div>

                                <h3 className="break-words text-lg font-bold text-[#10183F]">
                                    {resource.title}
                                </h3>

                                <p className="mt-2 break-words text-sm text-[#68739B]">
                                    {resource.description || "No description added."}
                                </p>

                                <div className="mt-4 flex flex-wrap items-center gap-2">
                                    <span className="rounded-lg bg-[#F1EEFF] px-3 py-1 text-xs font-medium text-purple-700">
                                        {resource.category}
                                    </span>
                                </div>

                                {resource.notes && (
                                    <div className="mt-4 rounded-xl bg-gray-50 p-3">
                                        <p className="text-xs font-semibold text-[#10183F]">
                                            My Notes
                                        </p>

                                        <p className="mt-1 whitespace-pre-wrap break-words text-sm text-[#68739B]">
                                            {resource.notes}
                                        </p>
                                    </div>
                                )}

                                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-4">

                                    <a
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-2 text-sm font-semibold text-purple-700 transition hover:text-purple-900"
                                    >
                                        Open Resource
                                        <ExternalLink size={16} />
                                    </a>

                                    <div className="flex items-center gap-2">

                                        <button
                                            onClick={() => handleEdit(resource)}
                                            title="Edit resource"
                                            className="rounded-lg p-2 text-blue-600 transition hover:bg-blue-50"
                                        >
                                            <Pencil size={17} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(resource._id)}
                                            title="Delete resource"
                                            className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
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

export default LearningResources;
