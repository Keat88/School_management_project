import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const ChartDashboard = ({ data }) => (
  <div className="w-full h-[400px] mt-[-20px]">
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          dataKey="students"
          data={data}
          cx="50%"
          cy="50%"
          outerRadius="80%"
          fill="#8884d8"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

export default ChartDashboard;
