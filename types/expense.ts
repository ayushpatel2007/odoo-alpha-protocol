export type Expense = {
  id: string;
  tripId: string;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  notes?: string | null;
};
