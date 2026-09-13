import Category from "../models/Category.js";

export const getCategories = async (req, res) => {
  const categories = await Category.find({
    isActive: true,
    $or: [{ user: null }, { user: req.user._id }],
  }).sort({ type: 1, name: 1 });

  res.json({
    success: true,
    categories,
  });
};

export const createCategory = async (req, res) => {
  const { name, type } = req.body;

  if (!name || !type) {
    return res.status(400).json({
      success: false,
      message: "Name and type are required.",
    });
  }

  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Category type must be income or expense.",
    });
  }

  const existing = await Category.findOne({
    name: name.trim(),
    type,
    user: req.user._id,
  });

  if (existing) {
    return res.status(409).json({
      success: false,
      message: "Category already exists.",
    });
  }

  const category = await Category.create({
    name: name.trim(),
    type,
    user: req.user._id,
  });

  res.status(201).json({
    success: true,
    category,
  });
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user._id,
    isDefault: false,
  });

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Custom category not found.",
    });
  }

  await Category.deleteOne({ _id: category._id });

  res.json({
    success: true,
    message: "Category deleted.",
  });
};
