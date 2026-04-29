import type { Request, Response } from "express";
import { AppError } from "../../shared/errors/app-error.js";
import {
  createExpenseSchema,
  updateExpenseSchema,
} from "./expense.schema.js";
import { expenseService } from "./expense.service.js";

class ExpenseController {
  private getExpenseId(rawExpenseId: string | string[] | undefined) {
    if (typeof rawExpenseId !== "string" || rawExpenseId.length === 0) {
      throw new AppError(400, "Expense ID is required");
    }

    return rawExpenseId;
  }

  async create(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, "Authentication required");
    }

    const validation = createExpenseSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: validation.error.issues.map((issue) => issue.message),
      });
    }

    const payload = validation.data;
    const expense = await expenseService.create(userId, payload);

    return res.status(201).json({
      success: true,
      message: "Expense created successfully",
      data: expense,
    });
  }

  async getAll(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, "Authentication required");
    }

    const expenses = await expenseService.getAll(userId);

    return res.status(200).json({
      success: true,
      message: "Expenses fetched successfully",
      count: expenses.length,
      data: expenses,
    });
  }

  async getById(req: Request, res: Response) {
    const userId = req.user?.id;
    const expenseId = this.getExpenseId(req.params.expenseId);

    if (!userId) {
      throw new AppError(401, "Authentication required");
    }

    const expense = await expenseService.getById(userId, expenseId);

    return res.status(200).json({
      success: true,
      message: "Expense fetched successfully",
      data: expense,
    });
  }

  async update(req: Request, res: Response) {
    const userId = req.user?.id;
    const expenseId = this.getExpenseId(req.params.expenseId);

    if (!userId) {
      throw new AppError(401, "Authentication required");
    }

    const payload = updateExpenseSchema.parse(req.body);
    const expense = await expenseService.update(userId, expenseId, payload);

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  }

  async delete(req: Request, res: Response) {
    const userId = req.user?.id;
    const expenseId = this.getExpenseId(req.params.expenseId);

    if (!userId) {
      throw new AppError(401, "Authentication required");
    }

    await expenseService.delete(userId, expenseId);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  }

  async getStats(req: Request, res: Response) {
    const userId = req.user?.id;

    if (!userId) {
      throw new AppError(401, "Authentication required");
    }

    const stats = await expenseService.getStats(userId);

    return res.status(200).json({
      success: true,
      message: "Expense statistics calculated successfully",
      data: stats,
    });
  }
}

export const expenseController = new ExpenseController();
