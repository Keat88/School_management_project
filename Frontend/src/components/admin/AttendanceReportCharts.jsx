import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function AttendanceReportChart({ data = [] }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">
        Attendance Report
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#F1F5F9" 
              className="dark:stroke-slate-800" 
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={{ stroke: "#E2E8F0" }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "#0F172A",
                border: "1px solid #334155",
                borderRadius: 12,
                color: "#F8FAFC",
                fontSize: 13,
                boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.3)",
              }}
              itemStyle={{ color: "#F8FAFC" }}
              formatter={(value) => [`${value}%`, "Attendance"]}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke="#2563EB"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#2563EB" }}
              activeDot={{ r: 5, fill: "#2563EB", stroke: "#93C5FD", strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}