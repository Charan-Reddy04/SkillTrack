import { useEffect, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  Plus,
  Trash2,
  Pencil,
  X,
  CheckCircle,
  Target
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import studyService from "../services/studyService";

const emptyForm = {
  date: new Date().toLocaleDateString("en-CA"),
  subject: "",
  durationMinutes: "",
  topic: "",
  tasksCompleted: "",
  notes: ""
};

const StudyTracker = () => {
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [dateFilter, setDateFilter] = useState("All");

  const loadSessions = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await studyService.getStudySessions();
      setSessions(response.sessions || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to load study records."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSessions();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setShowForm(true);
    setError("");
    setMessage("");
  };

  const handleEdit = (session) => {
    setEditingId(session._id);

    setFormData({
      date: session.date,
      subject: session.subject,
      durationMinutes: session.durationMinutes,
      topic: session.topic || "",
      tasksCompleted: session.tasksCompleted || "",
      notes: session.notes || ""
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

      const data = {
        ...formData,
        durationMinutes: Number(formData.durationMinutes)
      };

      if (editingId) {
        await studyService.updateStudySession(editingId, data);
        setMessage("Study record updated successfully!");
      } else {
        await studyService.createStudySession(data);
        setMessage("Study session added successfully!");
      }

      setShowForm(false);
      setEditingId(null);
      setFormData(emptyForm);

      await loadSessions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to save study record."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study record?")) {
      return;
    }

    try {
      setError("");
      setMessage("");

      await studyService.deleteStudySession(id);
      setMessage("Study record deleted successfully!");

      await loadSessions();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Unable to delete study record."
      );
    }
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours === 0) return `${remainingMinutes} min`;
    if (remainingMinutes === 0) return `${hours} hr`;

    return `${hours} hr ${remainingMinutes} min`;
  };

  const totalMinutes = sessions.reduce(
    (total, session) => total + session.durationMinutes,
    0
  );

  const totalDays = new Set(
    sessions.map((session) => session.date)
  ).size;

  const today = new Date().toLocaleDateString("en-CA");

  const todayMinutes = sessions
    .filter((session) => session.date === today)
    .reduce(
      (total, session) => total + session.durationMinutes,
      0
    );

  const filteredSessions = sessions.filter((session) => {
    if (dateFilter === "Today") {
      return session.date === today;
    }

    if (dateFilter === "This Month") {
      const currentMonth = today.slice(0, 7);
      return session.date.startsWith(currentMonth);
    }

    return true;
  });

  const groupedSessions = filteredSessions.reduce((groups, session) => {
    if (!groups[session.date]) {
      groups[session.date] = [];
    }

    groups[session.date].push(session);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-[#F5F3FF]">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-8">

        {/* Heading */}
        <div className="mb-8 flex flex-col justify-between gap-5 rounded-3xl bg-gradient-to-r from-[#3820A8] via-[#6435D9] to-[#9148E9] p-6 text-white shadow-lg md:flex-row md:items-center md:p-8">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <CalendarDays size={32} />
              <h1 className="text-2xl font-bold md:text-3xl">
                Daily Study Tracker
              </h1>
            </div>

            <p className="text-sm text-purple-100 md:text-base">
              Record your daily study time and track your learning progress.
            </p>
          </div>

          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 font-bold text-[#5030E8] hover:bg-purple-50"
          >
            <Plus size={19} />
            Add Study Session
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {message && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {message}
          </div>
        )}

        {/* Summary cards */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm">
            <Clock className="mb-3 text-[#6735D5]" size={25} />
            <p className="text-sm text-gray-500">Total Study Time</p>
            <h2 className="mt-1 text-2xl font-bold text-[#10183F]">
              {(totalMinutes / 60).toFixed(1)} hrs
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm">
            <BookOpen className="mb-3 text-[#6735D5]" size={25} />
            <p className="text-sm text-gray-500">Study Sessions</p>
            <h2 className="mt-1 text-2xl font-bold text-[#10183F]">
              {sessions.length}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm">
            <CalendarDays className="mb-3 text-[#6735D5]" size={25} />
            <p className="text-sm text-gray-500">Days Studied</p>
            <h2 className="mt-1 text-2xl font-bold text-[#10183F]">
              {totalDays}
            </h2>
          </div>

          <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm">
            <Target className="mb-3 text-[#6735D5]" size={25} />
            <p className="text-sm text-gray-500">Today's Study Time</p>
            <h2 className="mt-1 text-2xl font-bold text-[#10183F]">
              {formatDuration(todayMinutes)}
            </h2>
          </div>
        </div>

        {/* Add/Edit form */}
        {showForm && (
          <div className="mb-8 rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm md:p-7">

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-[#10183F]">
                {editingId ? "Edit Study Session" : "Add Study Session"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Study Date *
                  </label>

                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    className="w-full rounded-xl border border-[#D9D5FA] p-3 outline-none focus:border-[#6735D5]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Subject *
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Example: Python, DSA, SQL"
                    required
                    className="w-full rounded-xl border border-[#D9D5FA] p-3 outline-none focus:border-[#6735D5]"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Study Duration (Minutes) *
                  </label>

                  <input
                    type="number"
                    name="durationMinutes"
                    value={formData.durationMinutes}
                    onChange={handleChange}
                    placeholder="Example: 60"
                    min="1"
                    required
                    className="w-full rounded-xl border border-[#D9D5FA] p-3 outline-none focus:border-[#6735D5]"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Example: 60 minutes = 1 hour.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    Topic Studied
                  </label>

                  <input
                    type="text"
                    name="topic"
                    value={formData.topic}
                    onChange={handleChange}
                    placeholder="Example: Python Lists"
                    className="w-full rounded-xl border border-[#D9D5FA] p-3 outline-none focus:border-[#6735D5]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Tasks Completed
                </label>

                <textarea
                  name="tasksCompleted"
                  value={formData.tasksCompleted}
                  onChange={handleChange}
                  rows="3"
                  placeholder="Example: Completed 5 Python problems and revised loops."
                  className="w-full rounded-xl border border-[#D9D5FA] p-3 outline-none focus:border-[#6735D5]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-gray-700">
                  Additional Notes
                </label>

                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any additional information..."
                  className="w-full rounded-xl border border-[#D9D5FA] p-3 outline-none focus:border-[#6735D5]"
                />
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 font-semibold text-white disabled:opacity-60"
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Session"
                    : "Save Study Session"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-xl border border-[#D9D5FA] px-6 py-3 font-semibold text-[#5030E8]"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        )}

        {/* Study history */}
        <div className="rounded-2xl border border-[#E7E2FA] bg-white p-5 shadow-sm md:p-7">

          <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-bold text-[#10183F]">
                My Study History
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review your previous study sessions.
              </p>
            </div>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="rounded-xl border border-[#D9D5FA] bg-white px-4 py-2 text-sm outline-none focus:border-[#6735D5]"
            >
              <option value="All">All Records</option>
              <option value="Today">Today</option>
              <option value="This Month">This Month</option>
            </select>
          </div>

          {loading ? (
            <p className="py-10 text-center text-gray-500">
              Loading study records...
            </p>
          ) : filteredSessions.length === 0 ? (
            <div className="py-12 text-center">
              <CalendarDays
                size={45}
                className="mx-auto mb-3 text-purple-300"
              />

              <h3 className="font-bold text-[#10183F]">
                No Study Records Found
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Add your first study session to start tracking your progress.
              </p>
            </div>
          ) : (
            <div className="space-y-7">
              {Object.keys(groupedSessions)
                .sort((a, b) => b.localeCompare(a))
                .map((date) => (
                  <div key={date}>
                    <h3 className="mb-3 flex items-center gap-2 font-bold text-[#6735D5]">
                      <CalendarDays size={18} />
                      {new Date(date + "T00:00:00").toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric"
                        }
                      )}
                    </h3>

                    <div className="space-y-3">
                      {groupedSessions[date].map((session) => (
                        <div
                          key={session._id}
                          className="rounded-xl border border-[#E7E2FA] p-4"
                        >
                          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">

                            <div className="min-w-0 flex-1">
                              <h4 className="font-bold text-[#10183F]">
                                {session.subject}
                              </h4>

                              {session.topic && (
                                <p className="mt-1 text-sm text-gray-600">
                                  Topic: {session.topic}
                                </p>
                              )}

                              <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-[#6735D5]">
                                <Clock size={16} />
                                {formatDuration(session.durationMinutes)}
                              </p>

                              {session.tasksCompleted && (
                                <div className="mt-3 flex gap-2 text-sm text-gray-600">
                                  <CheckCircle
                                    size={17}
                                    className="shrink-0 text-green-600"
                                  />
                                  <p>{session.tasksCompleted}</p>
                                </div>
                              )}

                              {session.notes && (
                                <p className="mt-2 text-sm text-gray-500">
                                  Notes: {session.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(session)}
                                className="rounded-lg bg-purple-50 p-2 text-[#6735D5] hover:bg-purple-100"
                                title="Edit"
                              >
                                <Pencil size={17} />
                              </button>

                              <button
                                onClick={() => handleDelete(session._id)}
                                className="rounded-lg bg-red-50 p-2 text-red-600 hover:bg-red-100"
                                title="Delete"
                              >
                                <Trash2 size={17} />
                              </button>
                            </div>

                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default StudyTracker;