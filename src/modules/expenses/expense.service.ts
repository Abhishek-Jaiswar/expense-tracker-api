import { Env } from "../../config/env.js";
import { redisClient } from "../../config/redis.js";
import { AppError } from "../../shared/errors/app-error.js";
import { getExpensesCacheKey } from "./expense.cache.js";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "./expense.schema.js";
import { expenseRepository } from "./expense.repository.js";

class ExpenseService {
  async create(userId: string, input: CreateExpenseInput) {
    const expense = await expenseRepository.create(userId, input);
    await this.invalidateUserExpenseList(userId);
    return expense;
  }

  async getAll(userId: string) {
    const cacheKey = getExpensesCacheKey(userId);
    const cachedExpenses = await redisClient.get(cacheKey);

    if (cachedExpenses) {
      return JSON.parse(cachedExpenses);
    }

    const expenses = await expenseRepository.findAllByUserId(userId);
    await redisClient.set(cacheKey, JSON.stringify(expenses), {
      EX: Env.REDIS_TTL_SECONDS,
    });

    return expenses;
  }

  async getById(userId: string, expenseId: string) {
    const expense = await expenseRepository.findById(expenseId);

    if (!expense) {
      throw new AppError(404, "Expense not found");
    }

    if (expense.user_id !== userId) {
      throw new AppError(403, "Unauthorized: You can only view your own expenses");
    }

    return expense;
  }

  async update(userId: string, expenseId: string, input: UpdateExpenseInput) {
    const existingExpense = await this.getById(userId, expenseId);
    const updatedExpense = await expenseRepository.update(expenseId, input);

    if (!updatedExpense) {
      throw new AppError(404, "Expense not found");
    }

    await this.invalidateUserExpenseList(existingExpense.user_id);
    return updatedExpense;
  }

  async delete(userId: string, expenseId: string) {
    const existingExpense = await this.getById(userId, expenseId);
    const deletedExpense = await expenseRepository.delete(expenseId);

    if (!deletedExpense) {
      throw new AppError(404, "Expense not found");
    }

    await this.invalidateUserExpenseList(existingExpense.user_id);
    return deletedExpense;
  }

  async getStats(userId: string) {
    const stats = await expenseRepository.getStatsByUserId(userId);

    return {
      user_id: userId,
      expense_count: Number(stats?.expense_count ?? 0),
      total_amount: Number(stats?.total_amount ?? 0),
      average_amount: Number(stats?.average_amount ?? 0),
      min_amount: Number(stats?.min_amount ?? 0),
      max_amount: Number(stats?.max_amount ?? 0),
    };
  }

  async invalidateUserExpenseList(userId: string) {
    await redisClient.del(getExpensesCacheKey(userId));
  }
}

export const expenseService = new ExpenseService();
