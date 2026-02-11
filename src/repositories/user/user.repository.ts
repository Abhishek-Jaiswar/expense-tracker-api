import { pool } from "../../configs/db.config.js";

export type User = {
  id: string;
  username: string;
  email: string;
  password: string;
  fullname: string;
  created_at?: Date;
  updated_at?: Date;
};

class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findById(id: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findByUsername(username: string): Promise<User | null> {
    const result = await pool.query("SELECT * FROM users WHERE username = $1", [
      username,
    ]);

    if (result.rows.length === 0) {
      return null;
    }

    return result.rows[0];
  }

  async findAll(): Promise<User[]> {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  }

}

export const userRepository = new UserRepository();
