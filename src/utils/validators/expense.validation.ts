import { string, z } from "zod";

export const validateExpenses = z.object({
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
  expense_date: z.date(),
});

export type TExpenses = z.infer<typeof validateExpenses>;

// id;
// user_id;
// expense_name;
// expense_amount;
// expense_description;
// expense_date;
// created_at;
// updated_at;
