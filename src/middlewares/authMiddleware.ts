import { type NextFunction, type Request, type Response } from "express";
import jwt from "jsonwebtoken";
import { Env } from "../configs/env.config.js";

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string } & Record<string, any>;
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid or expired",
    });
  }

  try {
    const decoded = jwt.verify(token, Env.JWT_SECRET);
    req.user = decoded as { id: string; email: string };
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Token is not valid or expired",
    });
  }
};
