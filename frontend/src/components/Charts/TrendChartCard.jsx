import React from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";

const TrendChartCard = ({ data = [] }) => (
  <div className="card">
    <h3 className="font-semibold text-gray-800 mb-4">Monthly Trend</h3>
    {data.length === 0 ? (
      <p className="text-sm text-gray-400 text-center py-10">No data yet</p>
    ) : (
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
          <Line type="monotone" dataKey="amount" stroke="#3366ff" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    )}
  </div>
);

export default TrendChartCard;
