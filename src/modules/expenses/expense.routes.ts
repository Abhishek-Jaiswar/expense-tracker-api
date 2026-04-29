import { Router, type Router as ExpressRouter } from "express";
import { authMiddleware } from "../../middleware/auth.middleware.js";
import { expenseController } from "./expense.controller.js";

const expenseRouter: ExpressRouter = Router();

expenseRouter.get("/", authMiddleware, expenseController.getAll)
expenseRouter.post("/create", authMiddleware, expenseController.create)
expenseRouter.get("/expenses-stats", authMiddleware, expenseController.getStats)
expenseRouter.get("/:expenseId", authMiddleware, expenseController.getById)
expenseRouter.put("/update/:expenseId", authMiddleware, expenseController.update)
expenseRouter.delete("/:expenseId", authMiddleware, expenseController.delete)

export default expenseRouter;