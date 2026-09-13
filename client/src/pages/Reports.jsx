import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import api from "../api/axios.js";
import { formatCurrency, paymentLabel } from "../utils/format.js";

const Reports = () => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);

  useEffect(() => {
    api.get("/reports", { params: { year } }).then((res) => setData(res.data));
  }, [year]);

  const monthlyChart = useMemo(() => {
    if (!data) return [];

    const map = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2026, i, 1).toLocaleString("en-IN", { month: "short" }),
      income: 0,
      expense: 0,
    }));

    data.monthly.forEach((item) => {
      map[item._id.month - 1][item._id.type] = item.total;
    });

    return map;
  }, [data]);

  if (!data) return <p className="text-slate-500">Loading reports...</p>;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold">Reports</h2>
          <p className="mt-1 text-sm text-slate-500">
            Analyze yearly money movement.
          </p>
        </div>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="w-32 rounded-xl border border-slate-300 px-3 py-2.5"
        />
      </div>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="font-semibold">Monthly Income vs Expense</h3>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyChart}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => formatCurrency(value)} />
              <Bar dataKey="income" />
              <Bar dataKey="expense" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold">Category Breakdown</h3>
          <div className="mt-4 space-y-3">
            {data.byCategory.map((item, index) => (
              <div
                key={`${item._id.type}-${item._id.category}-${index}`}
                className="flex items-center justify-between border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-medium">{item._id.category}</p>
                  <p className="text-xs capitalize text-slate-500">
                    {item._id.type}
                  </p>
                </div>
                <p className="font-semibold">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h3 className="font-semibold">Payment Methods</h3>
          <div className="mt-4 space-y-3">
            {data.byPaymentMethod.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b border-slate-100 pb-3"
              >
                <div>
                  <p className="font-medium">{paymentLabel(item._id)}</p>
                  <p className="text-xs text-slate-500">{item.count} transactions</p>
                </div>
                <p className="font-semibold">{formatCurrency(item.total)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
