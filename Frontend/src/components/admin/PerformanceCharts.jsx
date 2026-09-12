import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

function PerformanceChart({ data = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
      <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-4">
        Student Performance
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 5, right: 10, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              className="text-gray-100 dark:text-slate-800"
            />
            <XAxis
              dataKey="subject"
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-gray-500 dark:text-slate-400"
              axisLine={{ stroke: "currentColor" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "currentColor" }}
              className="text-gray-500 dark:text-slate-400"
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              wrapperClassName="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 shadow-xl !p-3"
              contentStyle={{
                background: "transparent",
                border: "none",
                padding: 0,
              }}
              formatter={(value) => [`${value}%`, "Average Score"]}
              cursor={{ fill: "currentColor" }}
              cursorClassName="text-gray-50/5 dark:text-slate-800/40"
            />
            <Bar
              dataKey="average"
              fill="#2563EB"
              radius={[6, 6, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default PerformanceChart;
