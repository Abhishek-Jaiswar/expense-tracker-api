import type { Response } from "express";
import jwt, { type SignOptions } from "jsonwebtoken";
import { Env } from "../../config/env.js";
import type { AuthUser } from "../../modules/auth/auth.types.js";

const COOKIE_NAME = "access_token";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

export const setJWTCookie = (res: Response, user: AuthUser) => {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const options: SignOptions = {
    expiresIn: Env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>,
    audience: "user",
    issuer: "expense-tracker-api",
  };

  const token = jwt.sign(payload, Env.JWT_SECRET, options);

  res.cookie(COOKIE_NAME, token, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
    maxAge: ONE_WEEK,
    path: "/",
  });
};

export const clearJWTAuthCookie = (res: Response) => {
  res.clearCookie(COOKIE_NAME, {
    httpOnly: true,
    secure: Env.NODE_ENV === "production",
    sameSite: Env.NODE_ENV === "production" ? "strict" : "lax",
    path: "/",
  });
};
