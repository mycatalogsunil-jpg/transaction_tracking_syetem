import { useState } from "react";
import api from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {
  const { user, setUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [message, setMessage] = useState("");

  const saveProfile = async (e) => {
    e.preventDefault();
    const res = await api.put("/auth/profile", { name });
    setUser(res.data.user);
    localStorage.setItem("user", JSON.stringify(res.data.user));
    setMessage("Profile updated.");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    const res = await api.put("/auth/change-password", passwordForm);
    setPasswordForm({ currentPassword: "", newPassword: "" });
    setMessage(res.data.message);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Profile</h2>

      {message && (
        <div className="mt-4 max-w-2xl rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700">
          {message}
        </div>
      )}

      <form
        onSubmit={saveProfile}
        className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h3 className="font-semibold">Basic Information</h3>

        <label className="mt-4 block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <label className="mt-4 block text-sm font-medium">Email</label>
        <input
          value={user?.email || ""}
          disabled
          className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5"
        />

        <button className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white">
          Save Profile
        </button>
      </form>

      <form
        onSubmit={changePassword}
        className="mt-6 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6"
      >
        <h3 className="font-semibold">Change Password</h3>

        <input
          type="password"
          required
          placeholder="Current password"
          value={passwordForm.currentPassword}
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              currentPassword: e.target.value,
            })
          }
          className="mt-4 w-full rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <input
          type="password"
          required
          minLength={6}
          placeholder="New password"
          value={passwordForm.newPassword}
          onChange={(e) =>
            setPasswordForm({
              ...passwordForm,
              newPassword: e.target.value,
            })
          }
          className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <button className="mt-5 rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white">
          Change Password
        </button>
      </form>
    </div>
  );
};

export default Profile;
