import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { formatDate } from "../../utils/format.js";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const load = async () => {
    const res = await api.get("/admin/users", {
      params: search ? { search } : {},
    });
    setUsers(res.data.users);
  };

  useEffect(() => {
    load();
  }, []);

  const toggle = async (id) => {
    await api.patch(`/admin/users/${id}/toggle-status`);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Users</h2>

      <div className="mt-6 flex gap-3">
        <input
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md rounded-xl border border-slate-300 px-3 py-2.5"
        />
        <button
          onClick={load}
          className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white"
        >
          Search
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Joined</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-medium">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    {user.isActive ? "Active" : "Blocked"}
                  </td>
                  <td className="px-4 py-3">{formatDate(user.createdAt)}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => toggle(user._id)}
                      className={`rounded-lg px-3 py-1.5 ${
                        user.isActive
                          ? "bg-red-50 text-red-600"
                          : "bg-emerald-50 text-emerald-600"
                      }`}
                    >
                      {user.isActive ? "Block" : "Activate"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
