import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export default function AttendanceReportChart({ data = [] }) {
  return (
    <div className="rounded-lg border border-slate-100 bg-white p-6 shadow-slate-200/50 dark:bg-slate-900 dark:border-slate-800 dark:shadow-none transition-all">
      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-5">
        Attendance & Performance Overview
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
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
              yAxisId="left"
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              domain={[0, 100]}
              tick={{ fontSize: 12, fill: "#64748B" }}
              axisLine={false}
              tickLine={false}
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
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            {/* Bar 1 (e.g., Present or Collected) */}
            <Bar yAxisId="left" dataKey="present_count" name="Present" fill="#2563EB" radius={[4, 4, 0, 0]} barSize={12} />
            
            {/* Bar 2 (e.g., Total or Pending) */}
            <Bar yAxisId="left" dataKey="total_count" name="Total Students" fill="#F97316" radius={[4, 4, 0, 0]} barSize={12} />

            {/* Smooth Trend Line */}
            <Line
              yAxisId="right"
              type="natural"
              dataKey="rate"
              name="Attendance Rate"
              stroke="#10B981"
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#10B981" }}
              activeDot={{ r: 5, fill: "#10B981", stroke: "#A7F3D0", strokeWidth: 2 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}