import { z } from "zod";

export const createExpenseSchema = z.object({
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
    .refine((date) => !Number.isNaN(Date.parse(date)), {
      message: "Invalid date format",
    })
    .pipe(z.coerce.date()),
});

export const updateExpenseSchema = createExpenseSchema.partial();

export type CreateExpenseInput = z.infer<typeof createExpenseSchema>;
export type UpdateExpenseInput = z.infer<typeof updateExpenseSchema>;
