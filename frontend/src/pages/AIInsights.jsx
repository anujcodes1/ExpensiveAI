import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

const ScoreRing = ({ score }) => {
  const color = score >= 70 ? "#22c55e" : score >= 40 ? "#f59e0b" : "#ef4444";
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  return (
    <svg width="140" height="140" viewBox="0 0 140 140">
      <circle cx="70" cy="70" r="54" stroke="#e5e7eb" strokeWidth="12" fill="none" />
      <circle cx="70" cy="70" r="54" stroke={color} strokeWidth="12" fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round"
        transform="rotate(-90 70 70)" />
      <text x="70" y="76" textAnchor="middle" fontSize="28" fontWeight="700" fill="#111827">{score}</text>
    </svg>
  );
};

const AIInsights = () => {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [hasData, setHasData] = useState(true);

  const fetchInsight = async () => {
    setLoading(true);
    try {
      const res = await api.get("/ai/insights");
      setInsight(res.data.data);
    } catch (err) {
      if (err.response?.status !== 404) toast.error("Failed to load insights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchInsight(); }, []);

  const runAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await api.post("/ai/analyze");
      setInsight(res.data.data);
      toast.success("Analysis complete");
    } catch (err) {
      toast.error(err.response?.data?.message || "AI analysis failed. Try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
          <p className="text-sm text-gray-500">Powered by Gemini — your financial health, decoded</p>
        </div>
        <button onClick={runAnalysis} disabled={analyzing} className="btn-primary">
          {analyzing ? "Analyzing..." : insight ? "Re-run Analysis" : "Run Analysis"}
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : !insight ? (
        <EmptyState icon="🤖" title="No insights yet" description="Run your first AI analysis to get a financial health score and personalized recommendations." />
      ) : (
        <div className="space-y-6">
          <div className="card flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={insight.score} />
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">Financial Health Score</p>
              <p className="text-gray-700">{insight.summary}</p>
              <p className="text-xs text-gray-400 mt-2">
                Generated {new Date(insight.generatedAt).toLocaleString()}
              </p>
            </div>
          </div>

          {insight.budgetSuggestions?.length > 0 && (
            <div className="card">
              <h3 className="font-semibold text-gray-800 mb-4">Suggested Monthly Budgets</h3>
              <div className="grid sm:grid-cols-2 gap-3">
                {insight.budgetSuggestions.map((b, i) => (
                  <div key={i} className="flex justify-between bg-gray-50 rounded-lg px-4 py-3">
                    <span className="text-sm font-medium text-gray-700">{b.category}</span>
                    <span className="text-sm font-semibold text-gray-900">₹{b.suggestedLimit?.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="card">
            <h3 className="font-semibold text-gray-800 mb-4">Recommendations & Savings Tips</h3>
            <ul className="space-y-2">
              {insight.recommendations.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-brand-500">✓</span> {r}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIInsights;
