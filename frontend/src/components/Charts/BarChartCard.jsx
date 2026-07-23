import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const BarChartCard = ({ data = [] }) => (
  <div className="card">
    <h3 className="font-semibold text-gray-800 mb-4">Category Comparison</h3>
    {data.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-10">No data yet</p>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
          <Bar dataKey="amount" fill="#3366ff" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default BarChartCard;
