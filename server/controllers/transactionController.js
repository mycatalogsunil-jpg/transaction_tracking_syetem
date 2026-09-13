import Transaction from "../models/Transaction.js";
import { logActivity } from "../utils/logActivity.js";

const makeTransactionId = () => {
  const now = new Date();
  const date = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
  ].join("");
  const random = Math.floor(1000 + Math.random() * 9000);
  return `TXN-${date}-${Date.now().toString().slice(-6)}-${random}`;
};

export const createTransaction = async (req, res) => {
  const {
    type,
    amount,
    category,
    paymentMethod,
    description,
    status,
    referenceNumber,
    transactionDate,
  } = req.body;

  if (!type || !amount || !category || !transactionDate) {
    return res.status(400).json({
      success: false,
      message: "Type, amount, category and transaction date are required.",
    });
  }

  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid transaction type.",
    });
  }

  const transaction = await Transaction.create({
    transactionId: makeTransactionId(),
    user: req.user._id,
    type,
    amount: Number(amount),
    category: category.trim(),
    paymentMethod: paymentMethod || "cash",
    description: description?.trim() || "",
    status: status || "completed",
    referenceNumber: referenceNumber?.trim() || "",
    transactionDate,
  });

  await logActivity({
    userId: req.user._id,
    action: "TRANSACTION_CREATED",
    entityType: "Transaction",
    entityId: transaction._id,
    details: transaction.transactionId,
  });

  res.status(201).json({
    success: true,
    transaction,
  });
};

export const getTransactions = async (req, res) => {
  const {
    type,
    category,
    paymentMethod,
    status,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    search,
    page = 1,
    limit = 20,
  } = req.query;

  const filter = { user: req.user._id };

  if (type) filter.type = type;
  if (category) filter.category = category;
  if (paymentMethod) filter.paymentMethod = paymentMethod;
  if (status) filter.status = status;

  if (startDate || endDate) {
    filter.transactionDate = {};
    if (startDate) filter.transactionDate.$gte = new Date(startDate);
    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filter.transactionDate.$lte = end;
    }
  }

  if (minAmount || maxAmount) {
    filter.amount = {};
    if (minAmount) filter.amount.$gte = Number(minAmount);
    if (maxAmount) filter.amount.$lte = Number(maxAmount);
  }

  if (search) {
    filter.$or = [
      { transactionId: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { referenceNumber: { $regex: search, $options: "i" } },
    ];
  }

  const pageNumber = Math.max(1, Number(page));
  const pageSize = Math.min(100, Math.max(1, Number(limit)));

  const [transactions, total] = await Promise.all([
    Transaction.find(filter)
      .sort({ transactionDate: -1, createdAt: -1 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize),
    Transaction.countDocuments(filter),
  ]);

  res.json({
    success: true,
    transactions,
    pagination: {
      page: pageNumber,
      limit: pageSize,
      total,
      pages: Math.ceil(total / pageSize),
    },
  });
};

export const getTransactionById = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found.",
    });
  }

  res.json({
    success: true,
    transaction,
  });
};

export const updateTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found.",
    });
  }

  const allowedFields = [
    "type",
    "amount",
    "category",
    "paymentMethod",
    "description",
    "status",
    "referenceNumber",
    "transactionDate",
  ];

  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      transaction[field] = req.body[field];
    }
  }

  await transaction.save();

  await logActivity({
    userId: req.user._id,
    action: "TRANSACTION_UPDATED",
    entityType: "Transaction",
    entityId: transaction._id,
    details: transaction.transactionId,
  });

  res.json({
    success: true,
    message: "Transaction updated.",
    transaction,
  });
};

export const deleteTransaction = async (req, res) => {
  const transaction = await Transaction.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!transaction) {
    return res.status(404).json({
      success: false,
      message: "Transaction not found.",
    });
  }

  await Transaction.deleteOne({ _id: transaction._id });

  await logActivity({
    userId: req.user._id,
    action: "TRANSACTION_DELETED",
    entityType: "Transaction",
    entityId: transaction._id,
    details: transaction.transactionId,
  });

  res.json({
    success: true,
    message: "Transaction deleted.",
  });
};
