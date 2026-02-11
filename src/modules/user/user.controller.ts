import type { Request, Response } from "express";
import UserAuthModel from "../../models/auth/user.auth.js";
import {
  validateLogin,
  validateRegister,
} from "../../utils/validators/user.validation.js";
import { clearJWTAuthCookie, setJWTCookie } from "../../utils/cookie.js";

class UserAuthController {
  static async register(req: Request, res: Response) {
    try {
      const payload = req.body;

      const validation = validateRegister.safeParse(payload);
      if (!validation.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validation.error.issues,
        });
      }

      const user = await UserAuthModel.register(validation.data);

      return res.status(201).json({
        message: "User registered successfully",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullname: user.fullname,
        },
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Registration failed",
      });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const payload = req.body;

      const validation = validateLogin.safeParse(payload);
      if (!validation.success) {
        return res.status(400).json({
          message: "Validation failed",
          errors: validation.error.issues,
        });
      }

      const user = await UserAuthModel.login(validation.data);

      setJWTCookie(res, user);

      return res.status(200).json({
        message: "Login successful",
        data: {
          id: user.id,
          email: user.email,
        },
      });
    } catch (error: any) {
      return res.status(401).json({
        message: error.message || "Login failed",
      });
    }
  }

  static async logout(_req: Request, res: Response) {
    try {
      clearJWTAuthCookie(res);
      return res.status(200).json({
        message: "Logout successful",
      });
    } catch (error: any) {
      return res.status(400).json({
        message: error.message || "Logout failed",
      });
    }
  }
}

export default UserAuthController;
