import React, { useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || "", avatar: user?.avatar || "" });
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "" });
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await api.put("/profile", form);
      updateUser(res.data.user);
      toast.success("Profile updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSavingPassword(true);
    try {
      await api.put("/profile/password", pwForm);
      toast.success("Password updated");
      setPwForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profile</h1>

      <form onSubmit={handleProfileSave} className="card space-y-4">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center text-2xl font-bold overflow-hidden">
            {form.avatar ? <img src={form.avatar} alt="avatar" className="h-full w-full object-cover" /> : (user?.name?.[0] || "U")}
          </div>
          <div className="flex-1">
            <label className="text-sm font-medium text-gray-700">Avatar URL</label>
            <input className="input-field mt-1" value={form.avatar}
              onChange={(e) => setForm({ ...form, avatar: e.target.value })} placeholder="https://..." />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Name</label>
          <input className="input-field mt-1" value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">Email</label>
          <input disabled className="input-field mt-1 bg-gray-50 text-gray-400" value={user?.email || ""} />
        </div>
        <button type="submit" disabled={savingProfile} className="btn-primary">
          {savingProfile ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <form onSubmit={handlePasswordChange} className="card space-y-4">
        <h3 className="font-semibold text-gray-800">Change Password</h3>
        <div>
          <label className="text-sm font-medium text-gray-700">Current Password</label>
          <input type="password" required className="input-field mt-1" value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })} />
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700">New Password</label>
          <input type="password" required minLength={6} className="input-field mt-1" value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })} />
        </div>
        <button type="submit" disabled={savingPassword} className="btn-primary">
          {savingPassword ? "Updating..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
