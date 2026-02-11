import { z } from "zod";

export const validateRegister = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
  fullname: z.string().min(1, { message: "Full name is required" }),
});

export type TUserRegister = z.infer<typeof validateRegister>;

export const validateLogin = z.object({
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

export type TUserLogin = z.infer<typeof validateLogin>;
