import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { CardSkeleton } from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import ConfirmModal from "../components/ConfirmModal.jsx";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", icon: "🏷️" });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCategories(); }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    try {
      await api.post("/categories", form);
      toast.success("Category added");
      setForm({ name: "", icon: "🏷️" });
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add category");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/categories/${deleteTarget._id}`);
      toast.success("Category deleted");
      setDeleteTarget(null);
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete category");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Categories</h1>

      <form onSubmit={handleAdd} className="card flex flex-col sm:flex-row gap-3 mb-8">
        <input placeholder="Icon (emoji)" className="input-field sm:w-24" value={form.icon}
          onChange={(e) => setForm({ ...form, icon: e.target.value })} />
        <input placeholder="Category name" required className="input-field flex-1" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <button type="submit" className="btn-primary">Add Category</button>
      </form>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <CardSkeleton key={i} />)}
        </div>
      ) : categories.length === 0 ? (
        <EmptyState icon="🏷️" title="No categories yet" description="Add your first category above." />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((c) => (
            <div key={c._id} className="card flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{c.icon}</span>
                <span className="font-medium text-gray-800">{c.name}</span>
              </div>
              {!c.isPredefined && (
                <button className="text-red-500 text-xs font-medium" onClick={() => setDeleteTarget(c)}>Delete</button>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete category?"
        message={`Remove "${deleteTarget?.name}"? Existing expenses keep this category label.`}
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default Categories;
