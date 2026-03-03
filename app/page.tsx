'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { format, subDays, parseISO, startOfDay, isAfter } from 'date-fns';
import { Habit, Status } from './types';
import { HabitCard } from './components/HabitCard';
import { StatsSummary } from './components/StatsSummary';
import { Sparkles } from 'lucide-react';

const INITIAL_HABITS = [
  { id: 'running', name: 'Bieganie' },
  { id: 'breathing', name: 'Oddechy' },
  { id: 'cigarettes', name: 'Papierixy' },
  { id: 'persistence', name: 'Trwa' },
  { id: 'horse', name: 'Koń' },
];

export default function Page() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('motivation_app_data');
    if (saved) {
      try {
        setHabits(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse saved data', e);
        setHabits(INITIAL_HABITS.map(h => ({ ...h, entries: {} })));
      }
    } else {
      setHabits(INITIAL_HABITS.map(h => ({ ...h, entries: {} })));
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('motivation_app_data', JSON.stringify(habits));
    }
  }, [habits, isLoaded]);

  const handleToggleStatus = (habitId: string, date: string, status: Status) => {
    setHabits(prev => prev.map(habit => {
      if (habit.id === habitId) {
        return {
          ...habit,
          entries: {
            ...habit.entries,
            [date]: status
          }
        };
      }
      return habit;
    }));
  };

  const calculateStreak = (entries: Record<string, Status>) => {
    let streak = 0;
    // As we are showing March 2026, let's calculate streak relative to the end of March 2026
    // or the current date if it's within March 2026.
    // For a motivation app focusing on a specific month, we usually want to see the progress in that month.
    const today = new Date();
    const march2026End = new Date(2026, 2, 31);

    const referenceDate = startOfDay(isAfter(today, march2026End) ? march2026End : today);

    // Start from referenceDate and go backwards
    for (let i = 0; i < 365; i++) {
      const dateStr = format(subDays(referenceDate, i), 'yyyy-MM-dd');
      const status = entries[dateStr];

      if (status === 'success') {
        streak++;
      } else if (status === 'fail') {
        break;
      } else {
        continue;
      }
    }
    return streak;
  };

  const habitStats = useMemo(() => {
    return habits.map(h => ({
      ...h,
      streak: calculateStreak(h.entries)
    }));
  }, [habits]);

  const totalScore = useMemo(() => {
    return habitStats.reduce((acc, h) => acc + h.streak, 0);
  }, [habitStats]);

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen bg-black text-white p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col items-center mb-12 text-center">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-blue-500 animate-pulse" />
            <h1 className="text-4xl font-black tracking-tighter uppercase italic">
              Motywator <span className="text-blue-600">Pro</span>
            </h1>
          </div>
          <p className="text-zinc-500 max-w-md">
            Śledź swoje nawyki, buduj dyscyplinę i zbieraj punkty za każdy dzień wytrwałości.
          </p>
        </header>

        <div className="flex flex-col gap-8 mb-12">
          {habitStats.map(habit => (
            <HabitCard
              key={habit.id}
              habit={habit}
              onToggleStatus={handleToggleStatus}
              streak={habit.streak}
            />
          ))}
        </div>

        <StatsSummary totalScore={totalScore} habitCount={habits.length} />

        <footer className="mt-20 text-center pb-8">
          <p className="text-zinc-700 text-xs font-medium uppercase tracking-[0.2em]">
            Dyscyplina to wolność • {new Date().getFullYear()}
          </p>
        </footer>
      </div>
    </main>
  );
}
