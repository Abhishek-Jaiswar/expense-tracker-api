import { pool } from "../../configs/db.config.js";

class ExpenseRepository {
  static async getAll(user_id: string) {
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM expenses WHERE user_id = $1;`;
      const result = await client.query(query, [user_id]);

      return result.rows;
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute query..");
    } finally {
      client.release();
    }
  }

  static async getById(expense_id: string) {
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM expenses WHERE id = $1;`;
      const result = await client.query(query, [expense_id]);

      if (result.rows.length === 0) {
        throw new Error("Expense not found.");
      }
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute query..");
    } finally {
      client.release();
    }
  }

  static async getTotalExpenses(user_id: string) {
    const client = await pool.connect();
    try {
      const query = `
          SELECT user_id,
            COUNT(*) as expense_count,
            SUM(expense_amount) as total_amount,
            AVG(expense_amount) as average_amount,
            MIN(expense_amount) as min_amount,
            MAX(expense_amount) as max_amount
          FROM expenses
          WHERE user_id = $1
          GROUP BY user_id;
      `;

      const result = await client.query(query, [user_id]);
      return result.rows[0];
    } catch (error) {
      console.log(error);
      throw new Error("Failed to execute query..");
    } finally {
      client.release();
    }
  }
}

export default ExpenseRepository;
