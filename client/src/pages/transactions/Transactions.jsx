import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios.js";
import { formatCurrency, formatDate, paymentLabel } from "../../utils/format.js";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    search: "",
    type: "",
    status: "",
  });
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);

    try {
      const params = {};
      if (filters.search) params.search = filters.search;
      if (filters.type) params.type = filters.type;
      if (filters.status) params.status = filters.status;

      const res = await api.get("/transactions", { params });
      setTransactions(res.data.transactions);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [filters.type, filters.status]);

  const remove = async (id) => {
    if (!window.confirm("Delete this transaction?")) return;
    await api.delete(`/transactions/${id}`);
    load();
  };

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Transactions</h2>
          <p className="text-sm text-slate-500">Manage your income and expenses.</p>
        </div>

        <Link
          to="/transactions/add"
          className="rounded-xl bg-slate-900 px-4 py-2.5 text-center text-sm font-semibold text-white"
        >
          + Add Transaction
        </Link>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4">
        <input
          placeholder="Search..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        >
          <option value="">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        >
          <option value="">All status</option>
          <option value="completed">Completed</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>

        <button
          onClick={load}
          className="rounded-xl border border-slate-300 px-4 py-2.5 font-medium"
        >
          Search
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-mono text-xs">{tx.transactionId}</td>
                  <td className="px-4 py-3">{formatDate(tx.transactionDate)}</td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3">{paymentLabel(tx.paymentMethod)}</td>
                  <td className="px-4 py-3 capitalize">{tx.status}</td>
                  <td
                    className={`px-4 py-3 font-semibold ${
                      tx.type === "income" ? "text-emerald-600" : "text-red-600"
                    }`}
                  >
                    {tx.type === "income" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Link
                        to={`/transactions/${tx._id}/edit`}
                        className="rounded-lg bg-slate-100 px-3 py-1.5"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => remove(tx._id)}
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {!transactions.length && !loading && (
                <tr>
                  <td colSpan="7" className="px-4 py-10 text-center text-slate-500">
                    No transactions found.
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

export default Transactions;
