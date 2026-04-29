export type ExpenseRecord = {
  id: string;
  user_id: string;
  expense_name: string;
  expense_description: string;
  expense_amount: number;
  expense_date: Date;
  created_at?: Date;
  updated_at?: Date;
};

export type ExpenseStats = {
  user_id: string;
  expense_count: string;
  total_amount: string;
  average_amount: string;
  min_amount: string;
  max_amount: string;
};
