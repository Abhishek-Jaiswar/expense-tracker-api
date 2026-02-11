import { pool } from "../../configs/db.config.js";

class ExpenseRepository {
  static async getAll() {
    const client = await pool.connect();
    try {
      const query = `SELECT * FROM expenses;`;
      const result = await client.query(query);

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
}

export default ExpenseRepository;
