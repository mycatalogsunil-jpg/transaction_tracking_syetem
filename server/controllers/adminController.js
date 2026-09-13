import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import ActivityLog from "../models/ActivityLog.js";

export const getAdminStats = async (req, res) => {
  const [
    totalUsers,
    activeUsers,
    blockedUsers,
    totalTransactions,
    transactionTotals,
    recentActivity,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ isActive: true }),
    User.countDocuments({ isActive: false }),
    Transaction.countDocuments(),
    Transaction.aggregate([
      {
        $match: { status: "completed" },
      },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]),
    ActivityLog.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(10),
  ]);

  res.json({
    success: true,
    stats: {
      totalUsers,
      activeUsers,
      blockedUsers,
      totalTransactions,
      totalIncomeEntries:
        transactionTotals.find((x) => x._id === "income")?.total || 0,
      totalExpenseEntries:
        transactionTotals.find((x) => x._id === "expense")?.total || 0,
    },
    recentActivity,
  });
};

export const getUsers = async (req, res) => {
  const search = req.query.search || "";
  const filter = search
    ? {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(filter)
    .sort({ createdAt: -1 })
    .select("name email role isActive createdAt");

  res.json({
    success: true,
    users,
  });
};

export const toggleUserStatus = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found.",
    });
  }

  if (String(user._id) === String(req.user._id)) {
    return res.status(400).json({
      success: false,
      message: "You cannot block your own account.",
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  res.json({
    success: true,
    message: user.isActive ? "User activated." : "User blocked.",
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    },
  });
};

export const getAllTransactions = async (req, res) => {
  const transactions = await Transaction.find()
    .populate("user", "name email")
    .sort({ transactionDate: -1, createdAt: -1 })
    .limit(500);

  res.json({
    success: true,
    transactions,
  });
};
