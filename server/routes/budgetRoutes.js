import { Router } from "express";
import {
  setBudget,
  getBudget,
} from "../controllers/budgetController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.get("/", getBudget);
router.post("/", setBudget);

export default router;
