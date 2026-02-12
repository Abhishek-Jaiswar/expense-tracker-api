import type { User } from "../../@types/user.js";
import { pool } from "../../configs/db.config.js";
import { userRepository } from "../../repositories/user/user.repository.js";

import type {
  TUserLogin,
  TUserRegister,
} from "../../utils/validators/user.validation.js";
import bcrypt from "bcrypt";

class UserAuthModel {
  static async register(payload: TUserRegister) {
    const client = await pool.connect();
    const { username, password, email, fullname } = payload;

    const user = await userRepository.findByEmail(email);
    if (user) {
      throw new Error("Email already in use");
    }

    const SALT_ROUNDS = 10;
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    try {
      const query = `
            INSERT INTO users (
                username,
                email,
                password,
                fullname
            ) VALUES (
                $1, $2, $3, $4
            ) RETURNING *;
        `;

      const values = [username, email, hashedPassword, fullname];

      const result = await client.query(query, values);

      if (result.rowCount === 0) {
        throw new Error("Failed to register user");
      }

      return result.rows[0];
    } catch (error) {
      console.log("Failed to insert user: ", error);
      throw new Error("Unable to process query");
    } finally {
      client.release();
    }
  }

  static async login(payload: TUserLogin) {
    const client = await pool.connect();
    const { email, password } = payload;

    const user = await userRepository.findByEmail(email);

    if (!user) throw new Error("User not found");

    const isValidPassword = await bcrypt.compare(password, user?.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    try {
      const query = `
            SELECT id, email, fullname
            FROM users
            WHERE email = $1;
        `;

      const result = await client.query(query, [email]);

      return result.rows[0];
    } catch (error) {
      console.log("Failed to insert user: ", error);
      throw new Error("Unable to process query");
    } finally {
      client.release();
    }
  }

  async delete(id: string): Promise<void> {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      throw new Error("User not found");
    }
  }
}

export default UserAuthModel;
