'use client';

import React, { useMemo } from 'react';
import { Activity, CalendarDays, Clock3, IndianRupee, MapPin, WalletCards } from 'lucide-react';
import { Trip } from '@/types';
import { TripActivity, TripDay } from '@/lib/api/itinerary';
import { Expense } from '@/lib/api/budget';

type Props = { trip: Trip; days: TripDay[]; activities: TripActivity[]; expenses: Expense[]; };

const money = (value: number) => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0,
}).format(value);

export function TripInsights({ trip, days, activities, expenses }: Props) {
  const summary = useMemo(() => {
    const spent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const activityCost = activities.reduce((sum, a) => sum + (a.customCost || a.activity?.estimatedCost || 0), 0);
    const durationDays = Math.max(1, Math.ceil(
      (new Date(`${trip.endDate}T00:00:00`).getTime() - new Date(`${trip.startDate}T00:00:00`).getTime()) / 86400000
    ) + 1);
    const categoryTotals = expenses.reduce<Record<string, number>>((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount; return acc;
    }, {});
    const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0];
    return { spent, activityCost, durationDays, avgDailySpend: spent / durationDays,
      remaining: Math.max(0, trip.estimatedBudget - spent), topCategory, categoryTotals };
  }, [trip, expenses, activities]);

  const maxCategory = Math.max(...Object.values(summary.categoryTotals), 1);

  const cards = [
    { label: 'Trip days', value: String(summary.durationDays), icon: CalendarDays },
    { label: 'Activities', value: String(activities.length), icon: Activity },
    { label: 'Spent', value: money(summary.spent), icon: IndianRupee },
    { label: 'Remaining', value: money(summary.remaining), icon: WalletCards },
  ];

  return (
    <div className="space-y-6">
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => { const Icon = card.icon; return (
          <div key={card.label} className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5">
            <div className="flex items-center justify-between"><span className="text-sm text-slate-400">{card.label}</span><Icon className="w-5 h-5 text-amber-400" /></div>
            <p className="text-xl font-bold mt-3 text-white">{card.value}</p>
          </div>
        ); })}
      </section>

      <section className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between mb-5">
            <div><h2 className="font-semibold text-lg">Budget health</h2><p className="text-sm text-slate-400 mt-1">{money(summary.spent)} of {money(trip.estimatedBudget)} estimated budget used</p></div>
            <span className="text-amber-400 font-semibold">{trip.estimatedBudget > 0 ? Math.round((summary.spent / trip.estimatedBudget) * 100) : 0}%</span>
          </div>
          <div className="h-3 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, trip.estimatedBudget > 0 ? (summary.spent / trip.estimatedBudget) * 100 : 0)}%` }} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6">
            <div><p className="text-xs text-slate-500">Daily average</p><p className="font-semibold mt-1">{money(summary.avgDailySpend)}</p></div>
            <div><p className="text-xs text-slate-500">Activity estimate</p><p className="font-semibold mt-1">{money(summary.activityCost)}</p></div>
            <div><p className="text-xs text-slate-500">Largest category</p><p className="font-semibold mt-1">{summary.topCategory?.[0] || 'No expenses'}</p></div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center gap-2 mb-5"><MapPin className="w-5 h-5 text-amber-400" /><h2 className="font-semibold text-lg">Destinations</h2></div>
          <div className="space-y-3">
            {(trip.destinations || []).map((destination) => (
              <div key={destination.id} className="flex items-center justify-between gap-3">
                <div><p className="font-medium">{destination.city}</p><p className="text-xs text-slate-500">{destination.country}</p></div>
                <span className="text-xs text-slate-400">{destination.rating.toFixed(1)} ★</span>
              </div>
            ))}
            {(trip.destinations || []).length === 0 && <p className="text-sm text-slate-500">No destinations added.</p>}
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="font-semibold text-lg mb-5">Spending by category</h2>
          {Object.keys(summary.categoryTotals).length === 0 ? <p className="text-sm text-slate-500">No expenses recorded yet.</p> : (
            <div className="space-y-4">
              {Object.entries(summary.categoryTotals).sort((a, b) => b[1] - a[1]).map(([category, amount]) => (
                <div key={category}>
                  <div className="flex justify-between text-sm mb-1.5"><span className="text-slate-300 capitalize">{category}</span><span className="font-medium">{money(amount)}</span></div>
                  <div className="h-2 rounded-full bg-slate-800 overflow-hidden"><div className="h-full bg-amber-500 rounded-full" style={{ width: `${Math.min(100, (amount / maxCategory) * 100)}%` }} /></div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <h2 className="font-semibold text-lg mb-5">Activity pace</h2>
          <div className="flex items-end gap-2 h-36">
            {days.length > 0 ? days.map((day) => {
              const count = activities.filter((a) => a.tripDayId === day.id).length;
              const max = Math.max(1, ...days.map((d) => activities.filter((a) => a.tripDayId === d.id).length));
              return (
                <div key={day.id} className="flex-1 min-w-0 flex flex-col items-center justify-end gap-2">
                  <span className="text-[11px] text-slate-400">{count}</span>
                  <div className="w-full max-w-10 rounded-t-md bg-amber-500/80" style={{ height: `${Math.max(8, (count / max) * 100)}px` }} />
                  <span className="text-[10px] text-slate-500">D{day.dayNumber}</span>
                </div>
              );
            }) : <div className="w-full text-sm text-slate-500 text-center">Add itinerary days to see activity pace.</div>}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
        <div className="flex items-center gap-2 mb-5"><Clock3 className="w-5 h-5 text-amber-400" /><h2 className="font-semibold text-lg">Recent expenses</h2></div>
        <div className="divide-y divide-slate-800">
          {expenses.slice(0, 6).map((expense) => (
            <div key={expense.id} className="py-3 flex items-center justify-between gap-4">
              <div><p className="font-medium">{expense.title}</p><p className="text-xs text-slate-500 capitalize">{expense.category} · {expense.expenseDate}</p></div>
              <span className="font-semibold">{money(expense.amount)}</span>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-sm text-slate-500">No expenses recorded yet.</p>}
        </div>
      </section>
    </div>
  );
}
