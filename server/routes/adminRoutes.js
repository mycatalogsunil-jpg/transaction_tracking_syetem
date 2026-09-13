import { Router } from "express";
import {
  getAdminStats,
  getUsers,
  toggleUserStatus,
  getAllTransactions,
} from "../controllers/adminController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = Router();

router.use(protect, adminOnly);

router.get("/stats", getAdminStats);
router.get("/users", getUsers);
router.patch("/users/:id/toggle-status", toggleUserStatus);
router.get("/transactions", getAllTransactions);

export default router;
