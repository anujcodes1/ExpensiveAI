import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { CardSkeleton } from "../components/Loader.jsx";
import PieChartCard from "../components/Charts/PieChartCard.jsx";
import BarChartCard from "../components/Charts/BarChartCard.jsx";
import TrendChartCard from "../components/Charts/TrendChartCard.jsx";
import { useAuth } from "../context/AuthContext.jsx";

const SAVINGS_META = {
  improving: { label: "Improving", color: "text-green-600 bg-green-50", icon: "📉" },
  declining: { label: "Declining", color: "text-red-500 bg-red-50", icon: "📈" },
  neutral: { label: "Steady", color: "text-gray-600 bg-gray-100", icon: "➖" },
};

const Dashboard = () => {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [charts, setCharts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [summaryRes, chartsRes] = await Promise.all([
          api.get("/dashboard/summary"),
          api.get("/dashboard/charts"),
        ]);
        setSummary(summaryRes.data.data);
        setCharts(chartsRes.data.data);
      } catch {
        toast.error("Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const savings = SAVINGS_META[summary?.savingsIndicator || "neutral"];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back{user?.name ? `, ${user.name.split(" ")[0]}` : ""}</h1>
          <p className="text-sm text-gray-500">Here's your spending overview</p>
        </div>
        <Link to="/expenses" className="btn-primary">+ Add Expense</Link>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-gray-500">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{summary.totalExpenses.toLocaleString()}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">This Month</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">₹{summary.monthlyExpenses.toLocaleString()}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Top Category</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{summary.topCategory || "—"}</p>
          </div>
          <div className="card">
            <p className="text-sm text-gray-500">Savings Trend</p>
            <span className={`inline-flex items-center gap-1 text-sm font-semibold mt-1 px-2 py-1 rounded-full ${savings.color}`}>
              {savings.icon} {savings.label}
            </span>
          </div>
        </div>
      )}

      {!loading && charts && (
        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <PieChartCard data={charts.pie} />
          <BarChartCard data={charts.bar} />
          <div className="lg:col-span-2">
            <TrendChartCard data={charts.trend} />
          </div>
        </div>
      )}

      {!loading && summary && (
        <div className="card">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Transactions</h3>
          {summary.recentTransactions.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-6">No transactions yet</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {summary.recentTransactions.map((t) => (
                <div key={t._id} className="flex justify-between items-center py-3">
                  <div>
                    <p className="font-medium text-gray-800 text-sm">{t.title}</p>
                    <p className="text-xs text-gray-400">{t.category} • {new Date(t.date).toLocaleDateString()}</p>
                  </div>
                  <p className="font-semibold text-gray-900">₹{t.amount.toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
