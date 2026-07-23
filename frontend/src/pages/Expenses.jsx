import React, { useEffect, useState, useCallback } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { TableSkeleton } from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ExpenseModal from "../components/ExpenseModal.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const PAGE_LIMIT = 10;

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("-date");
  const [filters, setFilters] = useState({ search: "", category: "", dateFrom: "", dateTo: "", minAmount: "", maxAmount: "" });

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: PAGE_LIMIT, sort, ...filters };
      Object.keys(params).forEach((k) => (params[k] === "" ? delete params[k] : null));
      const res = await api.get("/expenses", { params });
      setExpenses(res.data.data);
      setTotalPages(res.data.pagination.totalPages || 1);
    } catch (err) {
      toast.error("Failed to load expenses");
    } finally {
      setLoading(false);
    }
  }, [page, sort, filters]);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch {}
  };

  useEffect(() => { fetchExpenses(); }, [fetchExpenses]);
  useEffect(() => { fetchCategories(); }, []);

  const handleAddOrEdit = async (form) => {
    try {
      if (editing) {
        await api.put(`/expenses/${editing._id}`, form);
        toast.success("Expense updated");
      } else {
        await api.post("/expenses", form);
        toast.success("Expense added");
      }
      setModalOpen(false);
      setEditing(null);
      fetchExpenses();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/expenses/${deleteTarget._id}`);
      toast.success("Expense deleted");
      setDeleteTarget(null);
      fetchExpenses();
    } catch {
      toast.error("Failed to delete expense");
    }
  };

  const toggleSort = (field) => {
    setSort((prev) => (prev === field ? `-${field}` : field));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Expenses</h1>
        <button className="btn-primary" onClick={() => { setEditing(null); setModalOpen(true); }}>
          + Add Expense
        </button>
      </div>

      <div className="card mb-6 grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <input placeholder="Search title..." className="input-field" value={filters.search}
          onChange={(e) => { setPage(1); setFilters({ ...filters, search: e.target.value }); }} />
        <input placeholder="Category" className="input-field" value={filters.category}
          onChange={(e) => { setPage(1); setFilters({ ...filters, category: e.target.value }); }} />
        <input type="date" className="input-field" value={filters.dateFrom}
          onChange={(e) => { setPage(1); setFilters({ ...filters, dateFrom: e.target.value }); }} />
        <input type="date" className="input-field" value={filters.dateTo}
          onChange={(e) => { setPage(1); setFilters({ ...filters, dateTo: e.target.value }); }} />
        <input type="number" placeholder="Min ₹" className="input-field" value={filters.minAmount}
          onChange={(e) => { setPage(1); setFilters({ ...filters, minAmount: e.target.value }); }} />
        <input type="number" placeholder="Max ₹" className="input-field" value={filters.maxAmount}
          onChange={(e) => { setPage(1); setFilters({ ...filters, maxAmount: e.target.value }); }} />
      </div>

      <div className="card p-0 overflow-hidden">
        {loading ? (
          <div className="p-6"><TableSkeleton /></div>
        ) : expenses.length === 0 ? (
          <EmptyState icon="🧾" title="No expenses found" description="Try adjusting your filters, or add your first expense." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort("title")}>Title</th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort("amount")}>Amount</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Payment</th>
                  <th className="px-4 py-3 cursor-pointer" onClick={() => toggleSort("date")}>Date</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {expenses.map((exp) => (
                  <tr key={exp._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800">{exp.title}</td>
                    <td className="px-4 py-3">₹{exp.amount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <span className="bg-brand-50 text-brand-600 text-xs font-medium px-2 py-1 rounded-full">{exp.category}</span>
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-500">{exp.paymentMethod}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(exp.date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right space-x-2 whitespace-nowrap">
                      <button className="text-brand-600 text-xs font-medium" onClick={() => { setEditing(exp); setModalOpen(true); }}>Edit</button>
                      <button className="text-red-500 text-xs font-medium" onClick={() => setDeleteTarget(exp)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="btn-secondary text-sm disabled:opacity-40">Previous</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="btn-secondary text-sm disabled:opacity-40">Next</button>
        </div>
      )}

      <ExpenseModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        onSubmit={handleAddOrEdit}
        categories={categories}
        initialData={editing}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Delete expense?"
        message={`This will permanently delete "${deleteTarget?.title}". This action cannot be undone.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Expenses;
