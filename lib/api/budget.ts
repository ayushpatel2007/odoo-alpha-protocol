import { createClient } from '@/lib/supabase/client';

export type Expense = {
  id: string;
  tripId: string;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  notes?: string | null;
};

const mapExpense = (e: any): Expense => ({
  id: e.id,
  tripId: e.trip_id,
  title: e.title,
  category: e.category,
  amount: Number(e.amount || 0),
  expenseDate: e.expense_date,
  notes: e.notes,
});

export async function getExpenses(tripId: string): Promise<Expense[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('trip_id', tripId)
    .order('expense_date', { ascending: false });

  if (error) throw new Error(error.message);
  return (data || []).map(mapExpense);
}

export async function createExpense(input: {
  tripId: string;
  title: string;
  category: string;
  amount: number;
  expenseDate: string;
  notes?: string;
}): Promise<Expense> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('expenses')
    .insert({
      trip_id: input.tripId,
      title: input.title,
      category: input.category,
      amount: input.amount,
      expense_date: input.expenseDate,
      notes: input.notes || null,
    })
    .select('*')
    .single();

  if (error) throw new Error(error.message);
  return mapExpense(data);
}

export async function updateExpense(id: string, input: Partial<Omit<Expense, 'id' | 'tripId'>>): Promise<Expense> {
  const supabase = createClient();
  const payload: Record<string, unknown> = {};
  if (input.title !== undefined) payload.title = input.title;
  if (input.category !== undefined) payload.category = input.category;
  if (input.amount !== undefined) payload.amount = input.amount;
  if (input.expenseDate !== undefined) payload.expense_date = input.expenseDate;
  if (input.notes !== undefined) payload.notes = input.notes;

  const { data, error } = await supabase.from('expenses').update(payload).eq('id', id).select('*').single();
  if (error) throw new Error(error.message);
  return mapExpense(data);
}

export async function deleteExpense(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from('expenses').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

export function getExpenseSummary(expenses: Expense[]) {
  return expenses.reduce<Record<string, number>>((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});
}
