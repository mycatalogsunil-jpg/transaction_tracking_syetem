import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Category from "../models/Category.js";

dotenv.config();
await connectDB();

const categories = [
  { name: "Salary", type: "income" },
  { name: "Business", type: "income" },
  { name: "Freelancing", type: "income" },
  { name: "Commission", type: "income" },
  { name: "Investment", type: "income" },
  { name: "Other Income", type: "income" },

  { name: "Food", type: "expense" },
  { name: "Shopping", type: "expense" },
  { name: "Rent", type: "expense" },
  { name: "Travel", type: "expense" },
  { name: "Education", type: "expense" },
  { name: "Medical", type: "expense" },
  { name: "Electricity", type: "expense" },
  { name: "Entertainment", type: "expense" },
  { name: "Other Expense", type: "expense" },
];

for (const item of categories) {
  await Category.findOneAndUpdate(
    {
      name: item.name,
      type: item.type,
      user: null,
    },
    {
      ...item,
      user: null,
      isDefault: true,
      isActive: true,
    },
    { upsert: true, new: true }
  );
}

console.log("Default categories seeded.");
process.exit(0);
