'use client';

import React, { useEffect, useState } from 'react';
import { Printer } from 'lucide-react';
import { getTripById } from '@/lib/api/trips';
import { getTripActivities, getTripDays } from '@/lib/api/itinerary';
import { getExpenses } from '@/lib/api/budget';
import { Trip } from '@/types';

export default function TripPrintPage({ params }: { params: { id: string } }) {
  const [trip, setTrip] = useState<Trip | null>(null);
  const [days, setDays] = useState<Awaited<ReturnType<typeof getTripDays>>>([]);
  const [activities, setActivities] = useState<Awaited<ReturnType<typeof getTripActivities>>>([]);
  const [expenses, setExpenses] = useState<Awaited<ReturnType<typeof getExpenses>>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getTripById(params.id), getTripDays(params.id), getTripActivities(params.id), getExpenses(params.id)])
      .then(([tripData, dayData, activityData, expenseData]) => {
        setTrip(tripData); setDays(dayData); setActivities(activityData); setExpenses(expenseData);
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  useEffect(() => {
    if (!loading && trip) {
      const timer = window.setTimeout(() => window.print(), 500);
      return () => window.clearTimeout(timer);
    }
  }, [loading, trip]);

  if (loading) return <main className="p-8 text-center">Preparing your trip summary...</main>;
  if (!trip) return <main className="p-8 text-center">Trip not found.</main>;

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <main className="bg-white text-slate-900 min-h-screen p-8 print:p-0">
      <div className="max-w-4xl mx-auto print:max-w-none">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6 mb-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-amber-600 font-semibold">GlobeTrotter · Alpha Protocol</p>
            <h1 className="text-3xl font-bold mt-2">{trip.name}</h1>
            <p className="text-slate-500 mt-1">{trip.startDate} → {trip.endDate}</p>
          </div>
          <button type="button" onClick={() => window.print()} className="print:hidden inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-900 text-white text-sm">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        </div>

        <section className="grid grid-cols-3 gap-4 mb-8">
          <div className="border rounded-xl p-4"><p className="text-xs text-slate-500">Days</p><p className="text-xl font-bold">{days.length}</p></div>
          <div className="border rounded-xl p-4"><p className="text-xs text-slate-500">Activities</p><p className="text-xl font-bold">{activities.length}</p></div>
          <div className="border rounded-xl p-4"><p className="text-xs text-slate-500">Spent</p><p className="text-xl font-bold">₹{totalSpent.toLocaleString('en-IN')}</p></div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Itinerary</h2>
          <div className="space-y-5">
            {days.map((day) => {
              const dayActivities = activities.filter((a) => a.tripDayId === day.id).sort((a, b) => a.sequenceOrder - b.sequenceOrder);
              return (
                <div key={day.id} className="border rounded-xl p-5 break-inside-avoid">
                  <div className="flex items-center justify-between mb-3"><h3 className="font-semibold">Day {day.dayNumber}</h3><span className="text-sm text-slate-500">{day.date}</span></div>
                  {day.notes && <p className="text-sm text-slate-500 mb-3">{day.notes}</p>}
                  {dayActivities.length > 0 ? (
                    <div className="space-y-2">
                      {dayActivities.map((activity) => (
                        <div key={activity.id} className="flex justify-between gap-4 text-sm">
                          <span>{activity.title}</span>
                          <span className="text-slate-500">{activity.startTime || ''}{activity.endTime ? ` – ${activity.endTime}` : ''}</span>
                        </div>
                      ))}
                    </div>
                  ) : <p className="text-sm text-slate-400">No activities planned.</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Expenses</h2>
          {expenses.length ? (
            <div className="border rounded-xl divide-y">
              {expenses.map((expense) => (
                <div key={expense.id} className="p-4 flex justify-between gap-4 text-sm">
                  <div><p className="font-medium">{expense.title}</p><p className="text-slate-500 capitalize">{expense.category} · {expense.expenseDate}</p></div>
                  <span className="font-semibold">₹{expense.amount.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          ) : <p className="text-sm text-slate-500">No expenses recorded.</p>}
        </section>

        <footer className="text-xs text-slate-400 border-t pt-4">Generated by GlobeTrotter — Alpha Protocol</footer>
      </div>
    </main>
  );
}
