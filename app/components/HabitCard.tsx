'use client';

import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, getDay } from 'date-fns';
import { pl } from 'date-fns/locale';
import { Check, X } from 'lucide-react';
import { Habit, Status } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggleStatus: (habitId: string, date: string, status: Status) => void;
  streak: number;
}

const WEEKDAYS = ['Pn', 'Wt', 'Śr', 'Cz', 'Pt', 'So', 'Nd'];

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggleStatus, streak }) => {
  // Using March 2026 as requested
  const monthStart = startOfMonth(new Date(2026, 2, 1));
  const monthEnd = endOfMonth(monthStart);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get padding for the first day of the month (0 = Sunday, 1 = Monday...)
  // We want Monday as the first day
  const firstDayOfWeek = getDay(monthStart);
  const padding = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

  return (
    <div className="relative group w-full">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
      <div className="relative bg-zinc-900 ring-1 ring-white/10 rounded-3xl p-6 md:p-8 flex flex-col gap-6">
        <div className="flex justify-between items-center border-b border-white/5 pb-4">
          <div>
            <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{habit.name}</h3>
            <p className="text-sm text-zinc-500 font-medium">Marzec 2026</p>
          </div>
          <div className="flex items-center gap-3 bg-zinc-800/50 px-4 py-2 rounded-2xl ring-1 ring-white/5">
            <span className="text-3xl font-black text-blue-500 leading-none">{streak}</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-400 font-bold leading-none">Dni<br/>streak</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 md:gap-4">
          {WEEKDAYS.map(wd => (
            <div key={wd} className="text-center text-[10px] font-bold text-zinc-600 uppercase tracking-widest mb-2">
              {wd}
            </div>
          ))}

          {Array.from({ length: padding }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}

          {days.map((date) => {
            const dateStr = format(date, 'yyyy-MM-dd');
            const status = habit.entries[dateStr] || 'none';
            const isToday = isSameDay(new Date(), date);

            return (
              <div key={dateStr} className="flex flex-col items-center gap-1">
                <button
                  onClick={() => {
                    const nextStatus: Status =
                      status === 'none' ? 'success' :
                      status === 'success' ? 'fail' : 'none';
                    onToggleStatus(habit.id, dateStr, nextStatus);
                  }}
                  className={`
                    w-full aspect-square max-w-[50px] rounded-xl flex items-center justify-center transition-all duration-200
                    ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)] text-emerald-950' : ''}
                    ${status === 'fail' ? 'bg-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.3)] text-rose-950' : ''}
                    ${status === 'none' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-600' : ''}
                    ${isToday ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-zinc-900 scale-105' : ''}
                  `}
                >
                  <span className={`text-xs font-bold ${status === 'none' ? '' : 'hidden'}`}>
                    {format(date, 'd')}
                  </span>
                  {status === 'success' && <Check size={20} strokeWidth={4} />}
                  {status === 'fail' && <X size={20} strokeWidth={4} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
