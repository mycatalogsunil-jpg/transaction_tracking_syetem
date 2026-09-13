import { useEffect, useState } from "react";
import api from "../api/axios.js";
import { formatCurrency } from "../utils/format.js";

const BudgetPage = () => {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [amount, setAmount] = useState("");
  const [data, setData] = useState(null);

  const load = async () => {
    const res = await api.get("/budgets", {
      params: { month, year },
    });
    setData(res.data);
    setAmount(res.data.budget?.amount || "");
  };

  useEffect(() => {
    load();
  }, [month, year]);

  const save = async (e) => {
    e.preventDefault();
    await api.post("/budgets", {
      month,
      year,
      amount: Number(amount),
    });
    load();
  };

  const stats = data?.stats;

  return (
    <div>
      <h2 className="text-2xl font-bold">Budget</h2>
      <p className="mt-1 text-sm text-slate-500">
        Set and monitor your monthly expense budget.
      </p>

      <form
        onSubmit={save}
        className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-4"
      >
        <select
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        >
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(2026, i, 1).toLocaleString("en-IN", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <input
          type="number"
          min="1"
          required
          placeholder="Budget amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <button className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white">
          Save Budget
        </button>
      </form>

      {stats && (
        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="text-sm text-slate-500">Budget</p>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(stats.amount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Spent</p>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(stats.spent)}
              </p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Remaining</p>
              <p className="mt-1 text-xl font-bold">
                {formatCurrency(stats.remaining)}
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-slate-200">
            <div
              className="h-full bg-slate-900"
              style={{ width: `${Math.min(stats.percentage, 100)}%` }}
            />
          </div>

          <p className="mt-2 text-sm text-slate-500">
            {stats.percentage}% budget used
          </p>

          {stats.percentage >= 80 && (
            <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
              Warning: You have used {stats.percentage}% of this month's budget.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BudgetPage;
