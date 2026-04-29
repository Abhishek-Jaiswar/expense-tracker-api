import { db } from "../../config/db.js";
import type {
  CreateExpenseInput,
  UpdateExpenseInput,
} from "./expense.schema.js";
import type { ExpenseRecord, ExpenseStats } from "./expense.types.js";

class ExpenseRepository {
  async create(userId: string, input: CreateExpenseInput): Promise<ExpenseRecord> {
    const result = await db.query<ExpenseRecord>(
      `
        INSERT INTO expenses (
          user_id,
          expense_name,
          expense_amount,
          expense_description,
          expense_date
        ) VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
      `,
      [
        userId,
        input.expense_name,
        input.expense_amount,
        input.expense_description,
        input.expense_date,
      ],
    );

    return result.rows[0] as ExpenseRecord;
  }

  async findAllByUserId(userId: string): Promise<ExpenseRecord[]> {
    const result = await db.query<ExpenseRecord>(
      `
        SELECT 
          * 
        FROM expenses 
        WHERE user_id = $1 
        ORDER BY expense_date DESC, created_at DESC
      `,
      [userId],
    );

    return result.rows;
  }

  async findById(expenseId: string): Promise<ExpenseRecord | null> {
    const result = await db.query<ExpenseRecord>(
      `
        SELECT 
          * 
        FROM expenses 
        WHERE id = $1
      `,
      [expenseId],
    );

    return result.rows[0] ?? null;
  }

  async update(
    expenseId: string,
    input: UpdateExpenseInput,
  ): Promise<ExpenseRecord | null> {
    const updateFields: string[] = [];
    const values: Array<string | number | Date> = [];
    let parameterIndex = 1;

    if (input.expense_name !== undefined) {
      updateFields.push(`expense_name = $${parameterIndex++}`);
      values.push(input.expense_name);
    }

    if (input.expense_amount !== undefined) {
      updateFields.push(`expense_amount = $${parameterIndex++}`);
      values.push(input.expense_amount);
    }

    if (input.expense_description !== undefined) {
      updateFields.push(`expense_description = $${parameterIndex++}`);
      values.push(input.expense_description);
    }

    if (input.expense_date !== undefined) {
      updateFields.push(`expense_date = $${parameterIndex++}`);
      values.push(input.expense_date);
    }

    if (updateFields.length === 0) {
      return this.findById(expenseId);
    }

    updateFields.push("updated_at = NOW()");
    values.push(expenseId);

    const result = await db.query<ExpenseRecord>(
      `
        UPDATE expenses
        SET ${updateFields.join(", ")}
        WHERE id = $${parameterIndex}
        RETURNING *;
      `,
      values,
    );

    return result.rows[0] ?? null;
  }

  async delete(expenseId: string): Promise<ExpenseRecord | null> {
    const result = await db.query<ExpenseRecord>(
      `
        DELETE FROM expenses 
        WHERE id = $1 
        RETURNING *;
      `,
      [expenseId],
    );

    return result.rows[0] ?? null;
  }

  async getStatsByUserId(userId: string): Promise<ExpenseStats | null> {
    const result = await db.query<ExpenseStats>(
      `
        SELECT
          user_id,
          COUNT(*)::text AS expense_count,
          COALESCE(SUM(expense_amount), 0)::text AS total_amount,
          COALESCE(AVG(expense_amount), 0)::text AS average_amount,
          COALESCE(MIN(expense_amount), 0)::text AS min_amount,
          COALESCE(MAX(expense_amount), 0)::text AS max_amount
        FROM expenses
        WHERE user_id = $1
        GROUP BY user_id;
      `,
      [userId],
    );

    return result.rows[0] ?? null;
  }
}

export const expenseRepository = new ExpenseRepository();
