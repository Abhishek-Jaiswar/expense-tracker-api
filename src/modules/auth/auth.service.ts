import bcrypt from "bcrypt";
import { AppError } from "../../shared/errors/app-error.js";
import type { LoginInput, RegisterInput } from "./auth.schema.js";
import { authRepository } from "./auth.repository.js";

class AuthService {
  async register(input: RegisterInput) {
    const [existingEmailUser, existingUsernameUser] = await Promise.all([
      authRepository.findByEmail(input.email),
      authRepository.findByUsername(input.username),
    ]);

    if (existingEmailUser) {
      throw new AppError(409, "Email already in use");
    }

    if (existingUsernameUser) {
      throw new AppError(409, "Username already in use");
    }

    const hashedPassword = await bcrypt.hash(input.password, 10);

    return authRepository.createUser({
      ...input,
      password: hashedPassword,
    });
  }

  async login(input: LoginInput) {
    const user = await authRepository.findAuthUserByEmail(input.email);

    if (!user) {
      throw new AppError(401, "Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(input.password, user.password);

    if (!isValidPassword) {
      throw new AppError(401, "Invalid credentials");
    }

    return user;
  }
}

export const authService = new AuthService();
