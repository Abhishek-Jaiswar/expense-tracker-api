import type { Request, Response } from "express";
import { clearJWTAuthCookie, setJWTCookie } from "../../shared/utils/cookie.js";
import { loginSchema, registerSchema } from "./auth.schema.js";
import { authService } from "./auth.service.js";

class AuthController {
  async register(req: Request, res: Response) {
    const validation = registerSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: validation.error.issues.map((issue) => issue.message),
      });
    }

    const payload = validation.data;
    const user = await authService.register(payload);

    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  }

  async login(req: Request, res: Response) {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({
        message: "Validation failed",
        error: validation.error.issues.map((issue) => issue.message),
      });
    }

    const payload = validation.data;
    const user = await authService.login(payload);

    setJWTCookie(res, user);

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        id: user.id,
        email: user.email,
        fullname: user.fullname,
      },
    });
  }

  async logout(_req: Request, res: Response) {
    clearJWTAuthCookie(res);

    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  }
}

export const authController = new AuthController();
