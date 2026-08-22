import { createClient } from '@/lib/supabase/client';
import { isSupabaseConfigured } from '@/lib/supabase/config';

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

const expensesStorageKey = (tripId: string) => `gt_expenses_${tripId}`;

function readLocalExpenses(tripId: string): Expense[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(expensesStorageKey(tripId));
  if (!raw) return [];

  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeLocalExpenses(tripId: string, expenses: Expense[]) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(expensesStorageKey(tripId), JSON.stringify(expenses));
  }
}

export async function getExpenses(tripId: string): Promise<Expense[]> {
  if (!isSupabaseConfigured()) {
    return readLocalExpenses(tripId);
  }

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
  if (!isSupabaseConfigured()) {
    const next: Expense = {
      id: `local-expense-${Date.now()}`,
      tripId: input.tripId,
      title: input.title,
      category: input.category,
      amount: input.amount,
      expenseDate: input.expenseDate,
      notes: input.notes || null,
    };
    writeLocalExpenses(input.tripId, [next, ...readLocalExpenses(input.tripId)]);
    return next;
  }

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
  if (!isSupabaseConfigured()) {
    if (typeof window === 'undefined') {
      throw new Error('Expenses are unavailable outside the browser in demo mode.');
    }

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key?.startsWith('gt_expenses_')) continue;

      const tripId = key.replace('gt_expenses_', '');
      const expenses = readLocalExpenses(tripId);
      const existing = expenses.find((expense) => expense.id === id);
      if (!existing) continue;

      const updated = { ...existing, ...input };
      writeLocalExpenses(
        tripId,
        expenses.map((expense) => (expense.id === id ? updated : expense)),
      );
      return updated;
    }

    throw new Error('Expense not found.');
  }

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
  if (!isSupabaseConfigured()) {
    if (typeof window === 'undefined') return;

    for (let i = 0; i < localStorage.length; i += 1) {
      const key = localStorage.key(i);
      if (!key?.startsWith('gt_expenses_')) continue;
      const tripId = key.replace('gt_expenses_', '');
      writeLocalExpenses(
        tripId,
        readLocalExpenses(tripId).filter((expense) => expense.id !== id),
      );
    }
    return;
  }

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
