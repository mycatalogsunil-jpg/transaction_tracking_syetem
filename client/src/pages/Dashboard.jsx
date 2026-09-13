import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios.js";
import StatCard from "../components/StatCard.jsx";
import { formatCurrency, formatDate } from "../utils/format.js";

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then((res) => setData(res.data))
      .catch((err) =>
        setError(err.response?.data?.message || "Failed to load dashboard.")
      );
  }, []);

  if (error) {
    return <div className="rounded-xl bg-red-50 p-4 text-red-600">{error}</div>;
  }

  if (!data) return <p className="text-slate-500">Loading dashboard...</p>;

  const { summary, recentTransactions, monthlyTrend } = data;

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold">Dashboard</h2>
        <p className="mt-1 text-sm text-slate-500">
          Overview of your money flow.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Current Balance" value={formatCurrency(summary.balance)} />
        <StatCard title="Total Income" value={formatCurrency(summary.totalIncome)} />
        <StatCard title="Total Expense" value={formatCurrency(summary.totalExpense)} />
        <StatCard title="Transactions" value={summary.totalTransactions} />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <StatCard
          title="This Month Income"
          value={formatCurrency(summary.thisMonthIncome)}
        />
        <StatCard
          title="This Month Expense"
          value={formatCurrency(summary.thisMonthExpense)}
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="font-semibold">Last 6 Months</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Area type="monotone" dataKey="income" />
              <Area type="monotone" dataKey="expense" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 p-5">
          <h3 className="font-semibold">Recent Transactions</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.map((tx) => (
                <tr key={tx._id} className="border-t border-slate-100">
                  <td className="px-5 py-3">{formatDate(tx.transactionDate)}</td>
                  <td className="px-5 py-3">{tx.category}</td>
                  <td className="px-5 py-3 capitalize">{tx.type}</td>
                  <td
                    className={`px-5 py-3 font-semibold ${
                      tx.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>
                </tr>
              ))}

              {!recentTransactions.length && (
                <tr>
                  <td className="px-5 py-8 text-center text-slate-500" colSpan="4">
                    No transactions yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
