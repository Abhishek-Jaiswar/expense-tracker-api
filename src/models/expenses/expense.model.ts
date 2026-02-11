import { pool } from "../../configs/db.config.js";
import type { TExpenses } from "../../utils/validators/expense.validation.js";

class ExpenseModel {
  static async create(payload: TExpenses) {
    const client = await pool.connect();
    const {
      user_id,
      expense_name,
      expense_amount,
      expense_description,
      expense_date,
    } = payload;

    try {
      const query = `
            INSERT INTO expenses (
                user_id,
                expense_name,
                expense_amount,
                expense_description,
                expense_date
            ) VALUES (
                $1, $2, $3, $4, $5
            ) RETURNING *;
        `;

      const values = [
        user_id,
        expense_name,
        expense_amount,
        expense_description,
        expense_date,
      ];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Failed to execute query..");
      }

      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute insert query!");
    } finally {
      client.release();
    }
  }

  static async update(expense_id: string, payload: any) {
    const client = await pool.connect();

    try {
      const updateFields: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (payload.expense_name !== undefined) {
        updateFields.push(`expense_name = $${paramCount}`);
        values.push(payload.expense_name);
        paramCount++;
      }

      if (payload.expense_amount !== undefined) {
        updateFields.push(`expense_amount = $${paramCount}`);
        values.push(payload.expense_amount);
        paramCount++;
      }

      if (payload.expense_description !== undefined) {
        updateFields.push(`expense_description = $${paramCount}`);
        values.push(payload.expense_description);
        paramCount++;
      }

      if (payload.expense_date !== undefined) {
        updateFields.push(`expense_date = $${paramCount}`);
        values.push(payload.expense_date);
        paramCount++;
      }

      updateFields.push(`updated_at = NOW()`);
      values.push(expense_id);

      if (updateFields.length === 1) {
        throw new Error("No fields to update.");
      }

      const query = `
        UPDATE expenses 
        SET ${updateFields.join(", ")}
        WHERE id = $${paramCount}
        RETURNING *;
      `;

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Expense not found or failed to update.");
      }

      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute update query!");
    } finally {
      client.release(); 
    }
  }

  static async delete(expense_id: string) {
    const client = await pool.connect();

    try {
      const query = `
                DELETE FROM expenses
                WHERE id = $1
                RETURNING *;
            `;

      const values = [expense_id];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Expense not found or failed to delete.");
      }

      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute delete query!");
    } finally {
      client.release();
    }
  }

  
}

export default ExpenseModel;
