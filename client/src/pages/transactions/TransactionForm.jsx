import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios.js";

const defaultForm = {
  type: "expense",
  amount: "",
  category: "",
  paymentMethod: "upi",
  status: "completed",
  transactionDate: new Date().toISOString().slice(0, 10),
  referenceNumber: "",
  description: "",
};

const TransactionForm = ({ initialData, onSubmit, submitLabel }) => {
  const [form, setForm] = useState(defaultForm);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data.categories));
  }, []);

  useEffect(() => {
    if (initialData) {
      setForm({
        type: initialData.type,
        amount: initialData.amount,
        category: initialData.category,
        paymentMethod: initialData.paymentMethod,
        status: initialData.status,
        transactionDate: new Date(initialData.transactionDate)
          .toISOString()
          .slice(0, 10),
        referenceNumber: initialData.referenceNumber || "",
        description: initialData.description || "",
      });
    }
  }, [initialData]);

  const filteredCategories = useMemo(
    () => categories.filter((cat) => cat.type === form.type),
    [categories, form.type]
  );

  useEffect(() => {
    if (
      form.category &&
      !filteredCategories.some((cat) => cat.name === form.category)
    ) {
      setForm((prev) => ({ ...prev, category: "" }));
    }
  }, [form.type]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await onSubmit({
        ...form,
        amount: Number(form.amount),
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mt-6 max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
    >
      {error && (
        <div className="mb-4 rounded-xl bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">Type</label>
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          >
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            required
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <select
            required
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          >
            <option value="">Select category</option>
            {filteredCategories.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Payment Method</label>
          <select
            value={form.paymentMethod}
            onChange={(e) =>
              setForm({ ...form, paymentMethod: e.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          >
            <option value="cash">Cash</option>
            <option value="upi">UPI</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="credit_card">Credit Card</option>
            <option value="debit_card">Debit Card</option>
            <option value="wallet">Wallet</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            required
            value={form.transactionDate}
            onChange={(e) =>
              setForm({ ...form, transactionDate: e.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Status</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Reference Number</label>
          <input
            value={form.referenceNumber}
            onChange={(e) =>
              setForm({ ...form, referenceNumber: e.target.value })
            }
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Description</label>
          <textarea
            rows="4"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="mt-2 w-full rounded-xl border border-slate-300 px-3 py-2.5"
          />
        </div>
      </div>

      <button className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 font-semibold text-white">
        {submitLabel}
      </button>
    </form>
  );
};

export default TransactionForm;
