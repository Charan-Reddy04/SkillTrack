
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip
} from "recharts";

const activityData = [
    { day: "Mon", hours: 2 },
    { day: "Tue", hours: 3 },
    { day: "Wed", hours: 1.5 },
    { day: "Thu", hours: 4 },
    { day: "Fri", hours: 2.5 },
    { day: "Sat", hours: 5 },
    { day: "Sun", hours: 3 }
];

function ActivityChart() {
    return (
        <div className="w-full min-w-0 rounded-2xl border border-[#EAE6FA] bg-white p-4 shadow-sm sm:p-5">

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3 sm:mb-6">

                <div className="min-w-0">
                    <h3 className="font-bold text-[#18204D]">
                        Weekly Study Activity
                    </h3>

                    <p className="mt-1 text-xs text-[#9299B5]">
                        Your study hours throughout the week
                    </p>
                </div>

                <span className="shrink-0 rounded-lg bg-[#F3F0FF] px-3 py-2 text-xs text-[#7045ED]">
                    This week
                </span>

            </div>

            <div className="h-56 w-full min-w-0 sm:h-64">

                <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                        data={activityData}
                        margin={{
                            top: 5,
                            right: 5,
                            left: -20,
                            bottom: 0
                        }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#EEEAF8"
                        />

                        <XAxis
                            dataKey="day"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9299B5", fontSize: 11 }}
                            interval={0}
                        />

                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9299B5", fontSize: 11 }}
                        />

                        <Tooltip
                            cursor={{ fill: "#F5F2FF" }}
                            formatter={(value) => [
                                `${value} hours`,
                                "Study time"
                            ]}
                        />

                        <Bar
                            dataKey="hours"
                            fill="#7950ED"
                            radius={[7, 7, 0, 0]}
                            maxBarSize={35}
                        />
                    </BarChart>
                </ResponsiveContainer>

            </div>

            <p className="mt-2 text-xs text-[#9299B5]">
                Sample chart data – we'll connect your actual study records later.
            </p>

        </div>
    );
}

export default ActivityChart;
