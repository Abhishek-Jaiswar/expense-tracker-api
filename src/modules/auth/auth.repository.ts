import { db } from "../../config/db.js";
import type { AuthUser, SafeAuthUser } from "./auth.types.js";

class AuthRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const result = await db.query<AuthUser>(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );

    return result.rows[0] ?? null;
  }

  async findByUsername(username: string): Promise<AuthUser | null> {
    const result = await db.query<AuthUser>(
      "SELECT * FROM users WHERE username = $1",
      [username],
    );

    return result.rows[0] ?? null;
  }

  async createUser(input: {
    username: string;
    email: string;
    password: string;
    fullname: string;
  }): Promise<SafeAuthUser> {
    const result = await db.query<SafeAuthUser>(
      `
        INSERT INTO users (username, email, password, fullname)
        VALUES ($1, $2, $3, $4)
        RETURNING id, username, email, fullname, created_at, updated_at;
      `,
      [input.username, input.email, input.password, input.fullname],
    );

    return result.rows[0] as SafeAuthUser;
  }

  async findAuthUserByEmail(email: string): Promise<AuthUser | null> {
    const result = await db.query<AuthUser>(
      `
        SELECT id, username, email, password, fullname, created_at
        FROM users
        WHERE email = $1;
      `,
      [email],
    );

    return result.rows[0] ?? null;
  }
}

export const authRepository = new AuthRepository();
