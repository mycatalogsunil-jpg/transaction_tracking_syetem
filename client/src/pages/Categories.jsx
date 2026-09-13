import { useEffect, useState } from "react";
import api from "../api/axios.js";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: "",
    type: "expense",
  });

  const load = async () => {
    const res = await api.get("/categories");
    setCategories(res.data.categories);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    await api.post("/categories", form);
    setForm({ name: "", type: "expense" });
    load();
  };

  const remove = async (id) => {
    await api.delete(`/categories/${id}`);
    load();
  };

  return (
    <div>
      <h2 className="text-2xl font-bold">Categories</h2>
      <p className="mt-1 text-sm text-slate-500">
        Default categories plus your custom categories.
      </p>

      <form
        onSubmit={submit}
        className="mt-6 grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-3"
      >
        <input
          required
          placeholder="Category name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        />

        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="rounded-xl border border-slate-300 px-3 py-2.5"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button className="rounded-xl bg-slate-900 px-4 py-2.5 font-semibold text-white">
          Add Category
        </button>
      </form>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="font-semibold">{cat.name}</p>
                <p className="text-xs capitalize text-slate-500">{cat.type}</p>
              </div>

              {!cat.isDefault && (
                <button
                  onClick={() => remove(cat._id)}
                  className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Categories;
