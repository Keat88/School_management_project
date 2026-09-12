import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";

function formatCurrency(value) {
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(value);
}

function FeeCollectionChart({ data = [] }) {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 transition-colors">
      <h3 className="text-base font-semibold text-gray-800 dark:text-slate-100 mb-4">
        Fee Collection
      </h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="currentColor" 
              className="text-gray-100 dark:text-slate-800" 
            />
            <XAxis
              dataKey="month"
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
              tickFormatter={(v) => `$${v / 1000}k`}
            />
            <Tooltip
              wrapperClassName="rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-gray-800 dark:text-slate-100 shadow-xl !p-3"
              contentStyle={{ background: "transparent", border: "none", padding: 0 }}
              formatter={(value) => formatCurrency(value)}
              cursor={{ fill: "currentColor" }}
              cursorClassName="text-gray-50/5 dark:text-slate-800/40"
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
            <Bar
              dataKey="collected"
              name="Collected"
              stackId="fees"
              fill="#2563EB"
              radius={[0, 0, 0, 0]}
            />
            <Bar
              dataKey="pending"
              name="Pending"
              stackId="fees"
              fill="#FDBA74"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default FeeCollectionChart;