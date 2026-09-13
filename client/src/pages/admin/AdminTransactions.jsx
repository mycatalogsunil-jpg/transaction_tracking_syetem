import { useEffect, useState } from "react";
import api from "../../api/axios.js";
import { formatCurrency, formatDate } from "../../utils/format.js";

const AdminTransactions = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    api.get("/admin/transactions").then((res) => {
      setTransactions(res.data.transactions);
    });
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold">All Transactions</h2>
      <p className="mt-1 text-sm text-slate-500">
        Read-only system transaction view.
      </p>

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Transaction ID</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr key={tx._id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium">{tx.user?.name}</p>
                    <p className="text-xs text-slate-500">{tx.user?.email}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs">{tx.transactionId}</td>
                  <td className="px-4 py-3">{formatDate(tx.transactionDate)}</td>
                  <td className="px-4 py-3">{tx.category}</td>
                  <td className="px-4 py-3 capitalize">{tx.type}</td>
                  <td className="px-4 py-3 font-semibold">
                    {formatCurrency(tx.amount)}
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

export default AdminTransactions;
