import React from "react";
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#3366ff", "#5c8dff", "#8fb3ff", "#254edb", "#1a3bb3", "#c2d9ff", "#111e4d"];

const PieChartCard = ({ data = [] }) => (
  <div className="card">
    <h3 className="font-semibold text-gray-800 mb-4">Spending by Category</h3>
    {data.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-10">No data yet</p>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={90} label>
            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
          </Pie>
          <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default PieChartCard;
