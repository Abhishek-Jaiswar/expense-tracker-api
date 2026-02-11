import { pool } from "../../configs/db.config.js";
import type { TExpenses } from "../../utils/validators/expense.validation.js";

class ExpenseModel {
  static async create(payload: TExpenses) {
    const client = await pool.connect();
    const { expense_name, expense_amount, expense_description, expense_date } =
      payload;

    try {
      const query = `
            INSERT INTO expenses (
                expense_name,
                expense_amount,
                expense_description,
                expense_date
            ) VALUES (
                $1, $2, $3, $4 
            ) RETURNING *;
        `;

      const values = [
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
    const { expense_name, expense_amount, expense_description, expense_date } =
      payload;

    try {
      const query = `
        UPDATE expenses 
        SET 
          expense_name = $1,
          expense_amount = $2,
          expense_description = $3,
          expense_date = $4,
          updated_at = NOW()
        WHERE id = $5
        RETURNING *;
      `;

      const values = [
        expense_name,
        expense_amount,
        expense_description,
        expense_date,
        expense_id,
      ];

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
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute delete query!");
    } finally {
      client.release();
    }
  }
}


export default ExpenseModel;