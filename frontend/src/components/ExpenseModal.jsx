import React, { useEffect, useState } from "react";

const PAYMENT_METHODS = ["cash", "card", "upi", "netbanking", "other"];

const emptyForm = {
  title: "",
  amount: "",
  category: "",
  paymentMethod: "cash",
  date: new Date().toISOString().slice(0, 10),
  notes: "",
};

const ExpenseModal = ({ open, onClose, onSubmit, categories = [], initialData = null }) => {
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setForm({
        title: initialData.title || "",
        amount: initialData.amount ?? "",
        category: initialData.category || "",
        paymentMethod: initialData.paymentMethod || "cash",
        date: initialData.date ? initialData.date.slice(0, 10) : emptyForm.date,
        notes: initialData.notes || "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [initialData, open]);

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form, amount: Number(form.amount) });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <h3 className="font-semibold text-lg text-gray-900 mb-4">
          {initialData ? "Edit Expense" : "Add Expense"}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Title</label>
            <input required className="input-field mt-1" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Amount</label>
              <input type="number" min="0" step="0.01" required className="input-field mt-1" value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Date</label>
              <input type="date" required className="input-field mt-1" value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Category</label>
            <input required list="category-options" className="input-field mt-1" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} />
            <datalist id="category-options">
              {categories.map((c) => <option key={c._id} value={c.name} />)}
            </datalist>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Payment Method</label>
            <select className="input-field mt-1" value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}>
              {PAYMENT_METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Notes</label>
            <textarea className="input-field mt-1" rows={2} value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="btn-secondary text-sm">Cancel</button>
            <button type="submit" disabled={submitting} className="btn-primary text-sm">
              {submitting ? "Saving..." : initialData ? "Save Changes" : "Add Expense"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
