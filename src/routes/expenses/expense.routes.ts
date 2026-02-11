import express from "express";
import ExpenseController from "../../modules/expenses/expense.controller.js";
import { authMiddleware } from "../../middlewares/authMiddleware.js";

const router: express.Router = express.Router();

router.post("/create", authMiddleware, ExpenseController.create);
router.get("/", authMiddleware, ExpenseController.getAll);
router.get("/expenses-stats", authMiddleware, ExpenseController.getTotalExpenses);
router.get("/:expense_id", authMiddleware, ExpenseController.getById);
router.put("/update/:expense_id", authMiddleware, ExpenseController.update);
router.delete("/:expense_id", authMiddleware, ExpenseController.delete);

export default router;
