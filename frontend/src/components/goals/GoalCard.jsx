
import {
    CalendarDays,
    Pencil,
    Trash2,
    Flag,
    Target
} from "lucide-react";

const GoalCard = ({
    goal,
    onEdit,
    onDelete,
    onProgressChange
}) => {

    // Priority colors
    const priorityColors = {
        High: "bg-red-100 text-red-600",
        Medium: "bg-yellow-100 text-yellow-700",
        Low: "bg-green-100 text-green-600"
    };

    // Status colors
    const statusColors = {
        "Not Started": "bg-gray-100 text-gray-600",
        "In Progress": "bg-blue-100 text-blue-600",
        "Completed": "bg-green-100 text-green-600"
    };

    // Format target date
    const formattedDate = new Date(
        goal.targetDate
    ).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

    return (
        <div className="rounded-2xl border border-[#E9E5FF] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

            {/* Top Section */}
            <div className="flex items-start justify-between gap-3">

                <div className="flex items-start gap-3">

                    <div className="rounded-xl bg-purple-100 p-3">
                        <Target className="h-6 w-6 text-purple-600" />
                    </div>

                    <div>
                        <h3 className="text-lg font-bold text-[#10183F]">
                            {goal.title}
                        </h3>

                        <p className="mt-1 text-sm text-[#68739B]">
                            {goal.category}
                        </p>
                    </div>

                </div>

                {/* Edit and Delete */}
                <div className="flex gap-1">

                    <button
                        type="button"
                        onClick={() => onEdit(goal)}
                        title="Edit goal"
                        className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                    >
                        <Pencil size={18} />
                    </button>

                    <button
                        type="button"
                        onClick={() => onDelete(goal._id)}
                        title="Delete goal"
                        className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                    >
                        <Trash2 size={18} />
                    </button>

                </div>

            </div>

            {/* Description */}
            {goal.description && (
                <p className="mt-4 text-sm leading-6 text-gray-500">
                    {goal.description}
                </p>
            )}

            {/* Priority and Status */}
            <div className="mt-4 flex flex-wrap gap-2">

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        priorityColors[goal.priority] || priorityColors.Medium
                    }`}
                >
                    <Flag size={12} className="mr-1 inline" />
                    {goal.priority} Priority
                </span>

                <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        statusColors[goal.status] || statusColors["Not Started"]
                    }`}
                >
                    {goal.status}
                </span>

            </div>

            {/* Target Date */}
            <div className="mt-4 flex items-center gap-2 text-sm text-[#68739B]">
                <CalendarDays size={17} />
                <span>Target: {formattedDate}</span>
            </div>

            {/* Progress */}
            <div className="mt-5">

                <div className="mb-2 flex items-center justify-between">

                    <span className="text-sm font-semibold text-[#10183F]">
                        Progress
                    </span>

                    <span className="text-sm font-bold text-purple-600">
                        {goal.progress}%
                    </span>

                </div>

                <div className="h-2.5 w-full overflow-hidden rounded-full bg-purple-100">

                    <div
                        className="h-full rounded-full bg-gradient-to-r from-[#5030E8] to-[#773CEB] transition-all duration-500"
                        style={{
                            width: `${goal.progress}%`
                        }}
                    />

                </div>

            </div>

            {/* Update Progress */}
            <div className="mt-5 border-t border-gray-100 pt-4">

                <label className="mb-2 block text-sm font-medium text-[#10183F]">
                    Update Progress
                </label>

                <select
                    value={goal.progress}
                    onChange={(e) =>
                        onProgressChange(
                            goal._id,
                            Number(e.target.value)
                        )
                    }
                    className="w-full rounded-xl border border-[#D9D5FA] bg-white px-3 py-2.5 text-sm outline-none focus:border-purple-500"
                >
                    <option value="0">0% - Not Started</option>
                    <option value="25">25% - Started</option>
                    <option value="50">50% - Halfway</option>
                    <option value="75">75% - Almost Done</option>
                    <option value="100">100% - Completed</option>
                </select>

            </div>

        </div>
    );
};

export default GoalCard;
