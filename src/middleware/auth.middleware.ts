import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../config/env.js";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Authentication required",
    });
  }

  try {
    req.user = jwt.verify(token, Env.JWT_SECRET) as Express.AuthenticatedUser;
    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Token is invalid or expired",
    });
  }
};
