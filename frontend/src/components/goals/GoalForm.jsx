
import { useState } from "react";
import { X, Target } from "lucide-react";

const GoalForm = ({
    initialData,
    onSubmit,
    onCancel,
    loading
}) => {

    const [formData, setFormData] = useState({
        title: initialData?.title || "",
        description: initialData?.description || "",
        category: initialData?.category || "",
        targetDate: initialData?.targetDate
            ? new Date(initialData.targetDate).toISOString().split("T")[0]
            : "",
        priority: initialData?.priority || "Medium"
    });

    const [error, setError] = useState("");

    // Update form values
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Submit the form
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            !formData.title.trim() ||
            !formData.category ||
            !formData.targetDate
        ) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            await onSubmit({
                ...formData,
                title: formData.title.trim(),
                description: formData.description.trim()
            });
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Something went wrong. Please try again."
            );
        }
    };

    return (
        <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">

            {/* Form Header */}
            <div className="mb-6 flex items-center justify-between">

                <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-purple-100 p-3">
                        <Target className="h-6 w-6 text-purple-600" />
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-[#10183F]">
                            {initialData ? "Edit Learning Goal" : "Create Learning Goal"}
                        </h2>

                        <p className="text-sm text-[#68739B]">
                            Set a target and track your progress.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
                >
                    <X size={20} />
                </button>

            </div>

            {/* Error Message */}
            {error && (
                <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Goal Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

                {/* Goal Title */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                        Goal Title *
                    </label>

                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="Example: Learn React.js"
                        className="w-full rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                        required
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                        Description
                    </label>

                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="What do you want to learn?"
                        rows="3"
                        className="w-full resize-none rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
                    />
                </div>

                {/* Category */}
                <div>
                    <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                        Category *
                    </label>

                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 outline-none focus:border-purple-500"
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Data Structures & Algorithms">
                            Data Structures & Algorithms
                        </option>
                        <option value="Web Development">
                            Web Development
                        </option>
                        <option value="Data Analytics">
                            Data Analytics
                        </option>
                        <option value="Python">Python</option>
                        <option value="Java">Java</option>
                        <option value="SQL">SQL</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                {/* Target Date and Priority */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                            Target Date *
                        </label>

                        <input
                            type="date"
                            name="targetDate"
                            value={formData.targetDate}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D5FA] px-4 py-3 outline-none focus:border-purple-500"
                            required
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-semibold text-[#10183F]">
                            Priority
                        </label>

                        <select
                            name="priority"
                            value={formData.priority}
                            onChange={handleChange}
                            className="w-full rounded-xl border border-[#D9D5FA] bg-white px-4 py-3 outline-none focus:border-purple-500"
                        >
                            <option value="Low">Low</option>
                            <option value="Medium">Medium</option>
                            <option value="High">High</option>
                        </select>
                    </div>

                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3 border-t border-gray-100 pt-5">

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-xl border border-gray-300 px-5 py-3 font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="rounded-xl bg-gradient-to-r from-[#5030E8] to-[#773CEB] px-6 py-3 font-semibold text-white shadow-md hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Saving..."
                            : initialData
                                ? "Update Goal"
                                : "Create Goal"
                        }
                    </button>

                </div>

            </form>
        </div>
    );
};

export default GoalForm;
