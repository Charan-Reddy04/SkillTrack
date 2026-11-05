
import { useEffect, useMemo, useState } from "react";
import {
    Plus,
    Search,
    Pin,
    Pencil,
    Trash2,
    BookOpen,
    X,
    Save,
    PinOff,
    FileText,
    Eye
} from "lucide-react";

import noteService from "../services/noteService";

const emptyForm = {
    title: "",
    subject: "",
    content: "",
    category: "General",
    isPinned: false
};

const categories = ["General", "Revision", "Important", "Interview Preparation"];

function PersonalNotes() {
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(emptyForm);
    const [editingId, setEditingId] = useState(null);

    const [showForm, setShowForm] = useState(false);
    const [selectedNote, setSelectedNote] = useState(null);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await noteService.getNotes();
            setNotes(response.notes || []);
        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to load notes."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const openAddForm = () => {
        setEditingId(null);
        setFormData(emptyForm);
        setShowForm(true);
        setError("");
        setMessage("");
    };

    const openEditForm = (note) => {
        setEditingId(note._id);

        setFormData({
            title: note.title,
            subject: note.subject,
            content: note.content,
            category: note.category || "General",
            isPinned: note.isPinned || false
        });

        setShowForm(true);
        setError("");
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setMessage("");

            if (editingId) {
                await noteService.updateNote(editingId, formData);
                setMessage("Note updated successfully.");
            } else {
                await noteService.createNote(formData);
                setMessage("Note created successfully.");
            }

            setShowForm(false);
            setEditingId(null);
            setFormData(emptyForm);

            await loadNotes();

        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to save note."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this note?"
        );

        if (!confirmDelete) return;

        try {
            setError("");
            setMessage("");

            await noteService.deleteNote(id);

            setNotes((previousNotes) =>
                previousNotes.filter((note) => note._id !== id)
            );

            if (selectedNote?._id === id) {
                setSelectedNote(null);
            }

            setMessage("Note deleted successfully.");

        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to delete note."
            );
        }
    };

    const handlePin = async (note) => {
        try {
            setError("");
            setMessage("");

            await noteService.updateNote(note._id, {
                title: note.title,
                subject: note.subject,
                content: note.content,
                category: note.category,
                isPinned: !note.isPinned
            });

            await loadNotes();

            setMessage(
                note.isPinned ? "Note unpinned." : "Note pinned."
            );

        } catch (err) {
            setError(
                err.response?.data?.message || "Unable to update pin."
            );
        }
    };

    const filteredNotes = useMemo(() => {
        return notes.filter((note) => {
            const searchText = search.toLowerCase();

            const matchesSearch =
                (note.title || "").toLowerCase().includes(searchText) ||
                (note.subject || "").toLowerCase().includes(searchText) ||
                (note.content || "").toLowerCase().includes(searchText);

            const matchesCategory =
                categoryFilter === "All" ||
                note.category === categoryFilter;

            return matchesSearch && matchesCategory;
        });
    }, [notes, search, categoryFilter]);

    const pinnedCount = notes.filter((note) => note.isPinned).length;

    return (
        <div className="min-h-screen bg-[#F5F3FF]">
            <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

                {/* Heading */}
                <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="mb-2 text-sm text-purple-100">
                                YOUR PERSONAL KNOWLEDGE SPACE
                            </p>

                            <h1 className="text-3xl font-extrabold md:text-4xl">
                                Personal Notes
                            </h1>

                            <p className="mt-2 max-w-xl text-sm text-purple-100">
                                Save your ideas, learning notes and important
                                revision points in one place.
                            </p>
                        </div>

                        <button
                            onClick={openAddForm}
                            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-semibold text-[#6036D9] shadow-md transition hover:bg-purple-50"
                        >
                            <Plus size={19} />
                            Add New Note
                        </button>
                    </div>
                </div>

                {/* Messages */}
                {message && (
                    <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                        {error}
                    </div>
                )}

                {/* Summary */}
                <div className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
                            <FileText size={22} />
                        </div>
                        <p className="text-sm text-[#8991B1]">Total Notes</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#18204D]">
                            {notes.length}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                            <Pin size={22} />
                        </div>
                        <p className="text-sm text-[#8991B1]">Pinned Notes</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#18204D]">
                            {pinnedCount}
                        </h2>
                    </div>

                    <div className="rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm">
                        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                            <BookOpen size={22} />
                        </div>
                        <p className="text-sm text-[#8991B1]">Subjects</p>
                        <h2 className="mt-1 text-2xl font-bold text-[#18204D]">
                            {new Set(
                                notes.map((note) =>
                                    (note.subject || "").toLowerCase()
                                )
                            ).size}
                        </h2>
                    </div>
                </div>

                {/* Add / Edit Form */}
                {showForm && (
                    <div className="mb-7 rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm md:p-7">
                        <div className="mb-6 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-[#18204D]">
                                {editingId ? "Edit Note" : "Create New Note"}
                            </h2>

                            <button
                                onClick={() => setShowForm(false)}
                                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                                type="button"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#39436D]">
                                        Note Title *
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        placeholder="Example: DBMS Important Questions"
                                        required
                                        className="w-full rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none focus:border-[#7045ED] focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>

                                <div>
                                    <label className="mb-2 block text-sm font-semibold text-[#39436D]">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Example: DBMS"
                                        required
                                        className="w-full rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none focus:border-[#7045ED] focus:ring-2 focus:ring-purple-100"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#39436D]">
                                    Category
                                </label>

                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 outline-none focus:border-[#7045ED]"
                                >
                                    {categories.map((category) => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold text-[#39436D]">
                                    Note Content *
                                </label>

                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    placeholder="Write your learning notes here..."
                                    rows="7"
                                    required
                                    className="w-full resize-y rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none focus:border-[#7045ED] focus:ring-2 focus:ring-purple-100"
                                />
                            </div>

                            <label className="flex cursor-pointer items-center gap-3 text-sm text-[#68739B]">
                                <input
                                    type="checkbox"
                                    name="isPinned"
                                    checked={formData.isPinned}
                                    onChange={handleChange}
                                    className="h-4 w-4 accent-purple-600"
                                />
                                Pin this note
                            </label>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#5636E8] to-[#8241EC] px-6 py-3 font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
                                >
                                    <Save size={18} />
                                    {saving
                                        ? "Saving..."
                                        : editingId
                                            ? "Update Note"
                                            : "Save Note"}
                                </button>

                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="rounded-xl border border-[#D9D5FA] px-6 py-3 font-semibold text-[#68739B] hover:bg-[#F5F3FF]"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Search and Filters */}
                <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-[#EAE6FA] bg-white p-4 shadow-sm md:flex-row">
                    <div className="relative flex-1">
                        <Search
                            size={19}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8991B1]"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search notes by title, subject or content..."
                            className="w-full rounded-xl border border-[#D9D5FA] py-3 pl-11 pr-4 outline-none focus:border-[#7045ED]"
                        />
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 text-sm outline-none focus:border-[#7045ED]"
                    >
                        <option value="All">All Categories</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Notes List */}
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-bold text-[#18204D]">
                        My Notes
                    </h2>

                    <span className="text-sm text-[#8991B1]">
                        {filteredNotes.length} notes found
                    </span>
                </div>

                {loading ? (
                    <div className="rounded-2xl bg-white p-12 text-center text-[#68739B]">
                        Loading your notes...
                    </div>
                ) : filteredNotes.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-[#CFC7F5] bg-white p-12 text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                            <BookOpen size={30} />
                        </div>

                        <h3 className="text-lg font-bold text-[#18204D]">
                            No notes found
                        </h3>

                        <p className="mt-2 text-sm text-[#8991B1]">
                            Create your first note to keep your learning
                            information organized.
                        </p>

                        <button
                            onClick={openAddForm}
                            className="mt-5 rounded-xl bg-gradient-to-r from-[#5636E8] to-[#8241EC] px-5 py-3 font-semibold text-white"
                        >
                            Create Your First Note
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {filteredNotes.map((note) => (
                            <div
                                key={note._id}
                                className="flex flex-col rounded-2xl border border-[#EAE6FA] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                            >
                                <div className="mb-3 flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="break-words text-lg font-bold text-[#18204D]">
                                            {note.title}
                                        </h3>

                                        <p className="mt-1 text-sm text-[#8991B1]">
                                            {note.subject}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handlePin(note)}
                                        title={note.isPinned ? "Unpin note" : "Pin note"}
                                        className={`shrink-0 rounded-lg p-2 ${
                                            note.isPinned
                                                ? "bg-amber-100 text-amber-600"
                                                : "bg-gray-100 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                                        }`}
                                    >
                                        {note.isPinned
                                            ? <Pin size={18} />
                                            : <PinOff size={18} />}
                                    </button>
                                </div>

                                <div className="mb-3">
                                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                                        {note.category || "General"}
                                    </span>
                                </div>

                                {/* Short Note Preview */}
                                <p className="mb-2 min-h-0 flex-1 line-clamp-3 whitespace-pre-wrap break-words text-sm leading-6 text-[#68739B]">
                                    {note.content}
                                </p>

                                {/* Read Full Note */}
                                <button
                                    onClick={() => setSelectedNote(note)}
                                    className="mb-4 flex items-center gap-2 self-start text-sm font-semibold text-[#7045ED] hover:underline"
                                >
                                    <Eye size={16} />
                                    Read Full Note
                                </button>

                                <div className="mb-4 border-t border-[#EEEAF8] pt-3 text-xs text-[#A0A5BD]">
                                    Updated: {new Date(note.updatedAt).toLocaleDateString()}
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        onClick={() => openEditForm(note)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#D9D5FA] py-2.5 text-sm font-semibold text-[#6036E8] hover:bg-[#F3F0FF]"
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(note._id)}
                                        className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-red-100 py-2.5 text-sm font-semibold text-red-500 hover:bg-red-50"
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Full Note Reading Popup */}
            {selectedNote && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
                    onClick={() => setSelectedNote(null)}
                >
                    <div
                        className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Popup Header */}
                        <div className="flex items-start justify-between gap-4 border-b border-[#EEEAF8] p-5 md:p-7">
                            <div className="min-w-0">
                                <h2 className="break-words text-2xl font-bold text-[#18204D]">
                                    {selectedNote.title}
                                </h2>

                                <p className="mt-2 text-sm text-[#8991B1]">
                                    {selectedNote.subject} · {selectedNote.category || "General"}
                                </p>
                            </div>

                            <button
                                onClick={() => setSelectedNote(null)}
                                className="shrink-0 rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-red-500"
                                title="Close"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Complete Note Content */}
                        <div className="overflow-y-auto p-5 md:p-7">
                            <p className="whitespace-pre-wrap break-words text-base leading-8 text-[#34405F]">
                                {selectedNote.content}
                            </p>
                        </div>

                        {/* Popup Footer */}
                        <div className="border-t border-[#EEEAF8] p-4 text-right">
                            <button
                                onClick={() => setSelectedNote(null)}
                                className="rounded-xl bg-gradient-to-r from-[#5636E8] to-[#8241EC] px-6 py-2.5 font-semibold text-white transition hover:opacity-90"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PersonalNotes;
