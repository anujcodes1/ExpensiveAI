import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const features = [
  { icon: "📊", title: "Smart Dashboard", desc: "See totals, monthly spend, and top categories at a glance." },
  { icon: "🤖", title: "AI Financial Score", desc: "Gemini-powered analysis of your spending health, in plain English." },
  { icon: "📈", title: "Visual Trends", desc: "Pie, bar, and monthly trend charts that make patterns obvious." },
  { icon: "🔍", title: "Powerful Search", desc: "Filter by category, date, amount, or title in seconds." },
];

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div>
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28 text-center">
        <span className="inline-block bg-brand-50 text-brand-600 text-xs font-semibold px-3 py-1 rounded-full mb-6">
          Powered by Gemini AI
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 max-w-3xl mx-auto">
          Know exactly where your money goes — and what to do about it.
        </h1>
        <p className="mt-6 text-lg text-gray-500 max-w-xl mx-auto">
          ExpenseAI tracks every rupee and turns it into a financial health score, spending insights,
          and savings recommendations. No spreadsheets required.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Link to={user ? "/dashboard" : "/signup"} className="btn-primary text-base px-6 py-3">
            {user ? "Go to Dashboard" : "Get Started Free"}
          </Link>
          <Link to={user ? "/expenses" : "/login"} className="btn-secondary text-base px-6 py-3">
            {user ? "View Expenses" : "Log In"}
          </Link>
        </div>
      </section>

      <section className="bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((f) => (
            <div key={f.title} className="text-center">
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="font-semibold text-gray-900">{f.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
