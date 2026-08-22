'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { PageContainer } from '@/components/layout/PageContainer';
import { getTripById } from '@/lib/api/trips';
import { createExpense, deleteExpense, getExpenses, type Expense } from '@/lib/api/budget';
import { BudgetSummary } from '@/components/budget/BudgetSummary';
import type { Trip } from '@/types';

const categories = ['Transport', 'Accommodation', 'Food', 'Activities', 'Shopping', 'Other'];

export default function TripBudgetPage() {
  const params = useParams();
  const tripId = params?.id as string;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [form, setForm] = useState({ title: '', category: 'Food', amount: '', date: new Date().toISOString().slice(0, 10) });

  async function load() {
    const [t, e] = await Promise.all([getTripById(tripId), getExpenses(tripId)]);
    setTrip(t); setExpenses(e);
  }
  useEffect(() => { load().catch(console.error); }, [tripId]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !Number(form.amount)) return;
    await createExpense({ tripId, title: form.title.trim(), category: form.category, amount: Number(form.amount), expenseDate: form.date });
    setForm({ ...form, title: '', amount: '' });
    await load();
  }

  const spent = expenses.reduce((sum, e) => sum + e.amount, 0);

  if (!trip) return <PageContainer><p className="py-20 text-center font-bold">Loading trip...</p></PageContainer>;

  return (
    <PageContainer>
      <Link href={`/trips/${tripId}`} className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-slate-900"><ArrowLeft className="h-4 w-4" /> Back to trip</Link>
      <div className="mt-4"><h1 className="text-3xl font-black text-slate-900">Budget</h1><p className="mt-1 text-sm text-slate-500">Track spending for {trip.name}.</p></div>
      <div className="mt-6"><BudgetSummary estimated={trip.estimatedBudget} spent={spent} /></div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[380px_1fr]">
        <form onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-extrabold text-slate-900">Add Expense</h2>
          <div className="mt-4 space-y-3">
            <input required value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="Expense title" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm">{categories.map(c => <option key={c}>{c}</option>)}</select>
            <input required type="number" min="0" step="0.01" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="Amount (₹)" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <input required type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm" />
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 text-xs font-extrabold text-slate-950"><Plus className="h-4 w-4" /> Add Expense</button>
          </div>
        </form>

        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="font-extrabold text-slate-900">Expense History</h2>
          <div className="mt-4 space-y-2">
            {expenses.length === 0 ? <div className="rounded-2xl bg-slate-50 p-8 text-center text-xs text-slate-500">No expenses recorded yet.</div> :
              expenses.map(expense => (
                <div key={expense.id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 p-4">
                  <div><p className="text-sm font-extrabold text-slate-900">{expense.title}</p><p className="mt-1 text-xs text-slate-500">{expense.category} · {expense.expenseDate}</p></div>
                  <div className="flex items-center gap-3"><span className="font-black text-slate-900">₹{expense.amount.toLocaleString('en-IN')}</span><button onClick={() => deleteExpense(expense.id).then(load)} className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-600" aria-label="Delete expense"><Trash2 className="h-4 w-4" /></button></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
