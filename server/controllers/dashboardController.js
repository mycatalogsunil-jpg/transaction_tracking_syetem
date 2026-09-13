import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getDashboardSummary = async (req, res) => {
  const userId = new mongoose.Types.ObjectId(req.user._id);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const [totals, monthTotals, recentTransactions, monthlyTrend] =
    await Promise.all([
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            status: "completed",
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
      ]),
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            status: "completed",
            transactionDate: { $gte: monthStart, $lt: nextMonth },
          },
        },
        {
          $group: {
            _id: "$type",
            total: { $sum: "$amount" },
          },
        },
      ]),
      Transaction.find({ user: userId })
        .sort({ transactionDate: -1, createdAt: -1 })
        .limit(5),
      Transaction.aggregate([
        {
          $match: {
            user: userId,
            status: "completed",
            transactionDate: {
              $gte: new Date(now.getFullYear(), now.getMonth() - 5, 1),
            },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$transactionDate" },
              month: { $month: "$transactionDate" },
              type: "$type",
            },
            total: { $sum: "$amount" },
          },
        },
        {
          $sort: {
            "_id.year": 1,
            "_id.month": 1,
          },
        },
      ]),
    ]);

  const income = totals.find((item) => item._id === "income")?.total || 0;
  const expense = totals.find((item) => item._id === "expense")?.total || 0;
  const totalTransactions = totals.reduce(
    (sum, item) => sum + item.count,
    0
  );

  const thisMonthIncome =
    monthTotals.find((item) => item._id === "income")?.total || 0;
  const thisMonthExpense =
    monthTotals.find((item) => item._id === "expense")?.total || 0;

  const trendMap = new Map();

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    trendMap.set(key, {
      month: d.toLocaleString("en-IN", { month: "short" }),
      year: d.getFullYear(),
      income: 0,
      expense: 0,
    });
  }

  monthlyTrend.forEach((item) => {
    const key = `${item._id.year}-${item._id.month}`;
    const target = trendMap.get(key);
    if (target) target[item._id.type] = item.total;
  });

  res.json({
    success: true,
    summary: {
      balance: income - expense,
      totalIncome: income,
      totalExpense: expense,
      totalTransactions,
      thisMonthIncome,
      thisMonthExpense,
    },
    recentTransactions,
    monthlyTrend: Array.from(trendMap.values()),
  });
};
