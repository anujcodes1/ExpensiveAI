import React from "react";

const ConfirmModal = ({ open, title, message, onConfirm, onCancel, confirmLabel = "Confirm" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-lg max-w-sm w-full p-6">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">{message}</p>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn-secondary text-sm">Cancel</button>
          <button onClick={onConfirm} className="btn-danger text-sm">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
