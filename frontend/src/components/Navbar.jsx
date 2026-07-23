import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navLinks = user
    ? [
        { to: "/dashboard", label: "Dashboard" },
        { to: "/expenses", label: "Expenses" },
        { to: "/categories", label: "Categories" },
        { to: "/insights", label: "AI Insights" },
        { to: "/profile", label: "Profile" },
      ]
    : [];

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
            <span>💰</span> ExpenseAI
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} className="text-sm font-medium text-gray-600 hover:text-brand-600 transition-colors">
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign up</Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setOpen(!open)} aria-label="Toggle menu">
            <div className="space-y-1.5">
              <span className="block w-6 h-0.5 bg-gray-700"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
              <span className="block w-6 h-0.5 bg-gray-700"></span>
            </div>
          </button>
        </div>

        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-3">
            {navLinks.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600">
                {link.label}
              </Link>
            ))}
            {user ? (
              <button onClick={handleLogout} className="btn-secondary text-sm w-fit">Logout</button>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary text-sm">Log in</Link>
                <Link to="/signup" className="btn-primary text-sm">Sign up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
