'use client';

import React, { useState, useEffect, useMemo } from 'react';

type DayStatus = 'success' | 'relapse' | 'none';

interface Habit {
  id: string;
  name: string;
  history: Record<string, DayStatus>;
}

const INITIAL_HABITS: Habit[] = [
  { id: 'bieganie', name: 'Bieganie', history: {} },
  { id: 'oddechy', name: 'Oddechy', history: {} },
  { id: 'papierixy', name: 'Papierixy', history: {} },
  { id: 'trwa', name: 'Trwa', history: {} },
  { id: 'kon', name: 'Koń', history: {} },
];

export default function Page() {
  const [habits, setHabits] = useState<Habit[]>(INITIAL_HABITS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Persistence logic (Step 6) - I'll add the skeleton now and implement fully later
  useEffect(() => {
    const saved = localStorage.getItem('habitData');
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load habits', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('habitData', JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const calculateStreak = (history: Record<string, DayStatus>) => {
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // We iterate backwards from today
    const current = new Date(today);

    while (true) {
      const dateStr = formatDate(current);
      const status = history[dateStr];

      if (status === 'success') {
        streak++;
      } else if (status === 'relapse') {
        break;
      } else {
        // If it's 'none', and it's not today, we might want to break or continue
        // Usually, if you didn't mark yesterday, the streak is broken?
        // Or we just count consecutive greens from the most recent one?
        // Let's assume streak is consecutive greens from the latest green going backwards until a red or a gap.
        // Actually, many apps count from "today or yesterday" backwards.

        // For simplicity: find the most recent green/red. If it's green, count backwards.
        // If we haven't found any green/red yet, keep going back a bit?

        // Let's stick to: count consecutive successes from today (if today is success) or yesterday (if yesterday is success) backwards.
        if (streak > 0) {
          // We found a gap after some successes
          break;
        }

        // If we haven't found any success yet, and we are more than 1 day in the past, break
        const diff = today.getTime() - current.getTime();
        const diffDays = diff / (1000 * 60 * 60 * 24);
        if (diffDays > 1) {
            break;
        }
      }
      current.setDate(current.getDate() - 1);

      // Safety break
      if (streak > 1000) break;
    }
    return streak;
  };

  const habitStreaks = useMemo(() => {
    return habits.map(h => ({
      ...h,
      streak: calculateStreak(h.history)
    }));
  }, [habits]);

  const totalScore = useMemo(() => {
    return habitStreaks.reduce((acc, h) => acc + h.streak, 0);
  }, [habitStreaks]);

  const toggleDay = (habitId: string, dateStr: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const currentStatus = h.history[dateStr] || 'none';
        let nextStatus: DayStatus = 'none';
        if (currentStatus === 'none') nextStatus = 'success';
        else if (currentStatus === 'success') nextStatus = 'relapse';
        else nextStatus = 'none';

        return {
          ...h,
          history: {
            ...h.history,
            [dateStr]: nextStatus
          }
        };
      }
      return h;
    }));
  };

  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-950 text-zinc-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl w-full">
        {/* Header / Dashboard */}
        <header className="relative mb-12 flex flex-col items-center">
          <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 blur-2xl rounded-full opacity-50" />
          <div className="relative flex flex-col items-center text-center">
            <h1 className="text-sm font-medium tracking-[0.2em] uppercase text-zinc-500 mb-2">
              Całkowity Wynik
            </h1>
            <div className="flex items-baseline gap-2">
              <span className="text-8xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                {totalScore}
              </span>
              <span className="text-2xl font-bold text-zinc-600">PKT</span>
            </div>
            <p className="mt-4 text-zinc-400 max-w-xs text-sm">
              Twój dzienny postęp w budowaniu lepszego siebie.
            </p>
          </div>
        </header>

        {/* Habit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {habitStreaks.map((habit, idx) => (
            <div
              key={habit.id}
              style={{ animationDelay: `${idx * 100}ms` }}
              className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl p-6 hover:bg-zinc-900 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold tracking-tight">{habit.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                      Aktualna seria
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-white leading-none">
                    {habit.streak}
                  </span>
                  <span className="text-[10px] block font-bold text-zinc-600 uppercase">
                    Dni
                  </span>
                </div>
              </div>

              {/* Day Grid */}
              <div className="grid grid-cols-7 gap-2">
                {getDaysArray().map((date) => {
                  const dateStr = formatDate(date);
                  const status = habit.history[dateStr] || 'none';
                  const isToday = dateStr === formatDate(new Date());

                  return (
                    <button
                      key={dateStr}
                      onClick={() => toggleDay(habit.id, dateStr)}
                      className={`
                        aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all duration-200
                        ${status === 'success' ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]' : ''}
                        ${status === 'relapse' ? 'bg-rose-500 text-rose-950 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : ''}
                        ${status === 'none' ? 'bg-zinc-800 text-zinc-600 hover:bg-zinc-700' : ''}
                        ${isToday && status === 'none' ? 'ring-2 ring-white/20' : ''}
                      `}
                      title={dateStr}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Helpers for date handling
function formatDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDaysArray() {
  const date = new Date();
  const year = date.getFullYear();
  const month = date.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return Array.from({ length: daysInMonth }, (_, i) => {
    return new Date(year, month, i + 1);
  });
}
