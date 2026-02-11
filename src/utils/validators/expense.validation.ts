import { string, z } from "zod";

export const validateExpenses = z.object({
  user_id: z.string().uuid({ message: "Invalid user ID" }),
  expense_name: z
    .string()
    .trim()
    .min(1, { message: "Expense name is required" }),
  expense_description: z
    .string()
    .trim()
    .min(1, { message: "Expense description is required" }),
  expense_amount: z.coerce
    .number()
    .positive()
    .min(1, { message: "Expense amount is required" }),
  expense_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .pipe(z.coerce.date()),
});

export type TExpenses = z.infer<typeof validateExpenses>;

export const validateExpenseUpdate = z.object({
  expense_name: z
    .string()
    .trim()
    .min(1, { message: "Expense name is required" })
    .optional(),
  expense_description: z
    .string()
    .trim()
    .min(1, { message: "Expense description is required" })
    .optional(),
  expense_amount: z.coerce
    .number()
    .positive()
    .min(1, { message: "Expense amount is required" })
    .optional(),
  expense_date: z
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .pipe(z.coerce.date())
    .optional(),
});

export type TExpenseUpdate = z.infer<typeof validateExpenseUpdate>;
