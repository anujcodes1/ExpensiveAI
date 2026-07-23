import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
    <p className="text-6xl mb-4">🔎</p>
    <h1 className="text-2xl font-bold text-gray-900">Page not found</h1>
    <p className="text-gray-500 mt-2">The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn-primary mt-6">Back to Home</Link>
  </div>
);

export default NotFound;
