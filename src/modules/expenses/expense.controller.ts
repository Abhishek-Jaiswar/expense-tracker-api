import type { Request, Response } from "express";
import {
  validateExpenses,
  validateExpenseUpdate,
} from "../../utils/validators/expense.validation.js";
import ExpenseModel from "../../models/expenses/expense.model.js";
import ExpenseRepository from "../../repositories/expenses/expenses.repository.js";
import type { ZodUUID } from "zod";

class ExpenseController {
  static async create(req: Request, res: Response) {
    try {
      const payload = req.body;
      const user_id = req.user?.id;
      const validation = validateExpenses.safeParse(payload);

      if (!validation.success) {
        return res.status(400).json({
          success: false,
          message: "Validation failed",
          errors: validation.error.issues,
        });
      }

      validation.data.user_id = (user_id as string) || validation.data.user_id;
      const expense = await ExpenseModel.create(validation.data);

      return res.status(201).json({
        success: true,
        message: "Expense created successfully",
        expense,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unexpected server error",
        error: error,
      });
    }
  }

  static async update(req: Request, res: Response) {
    let { expense_id } = req.params;
    const payload = req.body;
    const user_id = req.user?.id;

    if (!expense_id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required",
      });
    }

    const validation = validateExpenseUpdate.safeParse(payload);

    if (!validation.success) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.error.issues,
      });
    }

    try {
      const expense = await ExpenseRepository.getById(expense_id as string);
      if (expense.user_id !== user_id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only update your own expenses",
        });
      }

      const expenseUpdated = await ExpenseModel.update(
        expense_id as string,
        validation.data,
      );
      return res.status(200).json({
        success: true,
        message: "Expense updated successfully",
        expense: expenseUpdated,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unexpected server error",
        error: error,
      });
    }
  }

  static async delete(req: Request, res: Response) {
    let { expense_id } = req.params;
    const user_id = req.user?.id;

    if (!expense_id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required",
      });
    }

    try {
      const expense = await ExpenseRepository.getById(expense_id as string);
      if (expense.user_id !== user_id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only delete your own expenses",
        });
      }

      await ExpenseModel.delete(expense_id as string);
      return res.status(200).json({
        success: true,
        message: "Expense deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unexpected server error",
        error: error,
      });
    }
  }

  static async getAll(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const expenses = await ExpenseRepository.getAll(user_id as string);

      return res.status(200).json({
        success: true,
        message: "Expenses fetched successfully",
        count: expenses.length,
        expenses,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unexpected server error",
        error: error,
      });
    }
  }

  static async getById(req: Request, res: Response) {
    let { expense_id } = req.params;
    const user_id = req.user?.id;

    if (!expense_id) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required",
      });
    }

    try {
      const expense = await ExpenseRepository.getById(expense_id as string);

      if (expense.user_id !== user_id) {
        return res.status(403).json({
          success: false,
          message: "Unauthorized: You can only view your own expenses",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Got 1 Expense successfully",
        expense,
      });
    } catch (error) {
      console.error(error);
      return res.status(404).json({
        success: false,
        message: "Expense not found",
        error: error,
      });
    }
  }

  static async getTotalExpenses(req: Request, res: Response) {
    try {
      const user_id = req.user?.id;
      const stats = await ExpenseRepository.getTotalExpenses(user_id as string);

      return res.status(200).json({
        success: true,
        message: "Expense statistics calculated successfully",
        data: {
          user_id: stats?.user_id,
          expense_count: stats?.expense_count || 0,
          total_amount: stats?.total_amount || 0,
          average_amount: stats?.average_amount || 0,
          min_amount: stats?.min_amount || 0,
          max_amount: stats?.max_amount || 0,
        },
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: "Unexpected server error",
        error: error,
      });
    }
  }
}

export default ExpenseController;
