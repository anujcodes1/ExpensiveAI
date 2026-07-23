import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success("Welcome back!");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
        <p className="text-sm text-gray-500 mb-6">Log in to your ExpenseAI account</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Email</label>
            <input type="email" required className="input-field mt-1" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Password</label>
            <input type="password" required className="input-field mt-1" value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} />
          </div>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        <p className="text-sm text-gray-500 mt-6 text-center">
          Don't have an account? <Link to="/signup" className="text-brand-600 font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
