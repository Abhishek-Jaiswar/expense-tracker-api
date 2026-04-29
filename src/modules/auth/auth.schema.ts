import { z } from "zod";

export const registerSchema = z.object({
  username: z.string().trim().min(1, { message: "Username is required" }),
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  fullname: z.string().trim().min(1, { message: "Full name is required" }),
});

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
