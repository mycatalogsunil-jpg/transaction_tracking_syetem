import Budget from "../models/Budget.js";
import Transaction from "../models/Transaction.js";

export const setBudget = async (req, res) => {
  const { month, year, amount } = req.body;

  if (!month || !year || !amount) {
    return res.status(400).json({
      success: false,
      message: "Month, year and amount are required.",
    });
  }

  const budget = await Budget.findOneAndUpdate(
    {
      user: req.user._id,
      month: Number(month),
      year: Number(year),
    },
    {
      amount: Number(amount),
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  res.json({
    success: true,
    message: "Budget saved.",
    budget,
  });
};

export const getBudget = async (req, res) => {
  const now = new Date();
  const month = Number(req.query.month || now.getMonth() + 1);
  const year = Number(req.query.year || now.getFullYear());

  const budget = await Budget.findOne({
    user: req.user._id,
    month,
    year,
  });

  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);

  const expenseData = await Transaction.aggregate([
    {
      $match: {
        user: req.user._id,
        type: "expense",
        status: "completed",
        transactionDate: { $gte: start, $lt: end },
      },
    },
    {
      $group: {
        _id: null,
        spent: { $sum: "$amount" },
      },
    },
  ]);

  const spent = expenseData[0]?.spent || 0;
  const amount = budget?.amount || 0;
  const remaining = amount - spent;
  const percentage = amount > 0 ? Math.round((spent / amount) * 100) : 0;

  res.json({
    success: true,
    budget,
    stats: {
      amount,
      spent,
      remaining,
      percentage,
    },
  });
};
