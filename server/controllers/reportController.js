import Transaction from "../models/Transaction.js";

export const getReport = async (req, res) => {
  const now = new Date();
  const year = Number(req.query.year || now.getFullYear());
  const month = req.query.month ? Number(req.query.month) : null;

  const match = {
    user: req.user._id,
    status: "completed",
  };

  if (month) {
    match.transactionDate = {
      $gte: new Date(year, month - 1, 1),
      $lt: new Date(year, month, 1),
    };
  } else {
    match.transactionDate = {
      $gte: new Date(year, 0, 1),
      $lt: new Date(year + 1, 0, 1),
    };
  }

  const [totals, byCategory, byPaymentMethod, monthly] = await Promise.all([
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: {
            type: "$type",
            category: "$category",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      { $match: match },
      {
        $group: {
          _id: "$paymentMethod",
          total: { $sum: "$amount" },
          count: { $sum: 1 },
        },
      },
      { $sort: { total: -1 } },
    ]),
    Transaction.aggregate([
      {
        $match: {
          user: req.user._id,
          status: "completed",
          transactionDate: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$transactionDate" },
            type: "$type",
          },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id.month": 1 } },
    ]),
  ]);

  res.json({
    success: true,
    totals,
    byCategory,
    byPaymentMethod,
    monthly,
  });
};
