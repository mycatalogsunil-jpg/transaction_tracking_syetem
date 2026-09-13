import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import StatCard from "../../components/StatCard.jsx";
import { formatCurrency, formatDate } from "../../utils/format.js";

const AdminDashboard = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/admin/stats").then((res) => setData(res.data));
  }, []);

  if (!data) return <p className="text-slate-500">Loading admin dashboard...</p>;

  const { stats, recentActivity } = data;

  return (
    <div>
      <h2 className="text-2xl font-bold">Admin Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">System-wide overview.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Users" value={stats.totalUsers} />
        <StatCard title="Active Users" value={stats.activeUsers} />
        <StatCard title="Blocked Users" value={stats.blockedUsers} />
        <StatCard title="Transactions" value={stats.totalTransactions} />
        <StatCard
          title="Income Entries Value"
          value={formatCurrency(stats.totalIncomeEntries)}
        />
        <StatCard
          title="Expense Entries Value"
          value={formatCurrency(stats.totalExpenseEntries)}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold">Recent Activity</h3>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivity.map((log) => (
            <div key={log._id} className="p-4">
              <p className="font-medium">{log.action}</p>
              <p className="mt-1 text-xs text-slate-500">
                {log.user?.name || "Unknown"} • {formatDate(log.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
