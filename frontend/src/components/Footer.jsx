import React from "react";

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 mt-auto">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row justify-between items-center gap-4">
      <div className="flex items-center gap-2 font-semibold text-brand-600">
        <span>💰</span> ExpenseAI
      </div>
      <p className="text-sm text-gray-500">© {new Date().getFullYear()} ExpenseAI. Built with React, Node.js & Gemini.</p>
    </div>
  </footer>
);

export default Footer;
