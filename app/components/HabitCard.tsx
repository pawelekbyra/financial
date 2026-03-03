'use client';

import React from 'react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import { Check, X } from 'lucide-react';
import { Habit, Status } from '../types';

interface HabitCardProps {
  habit: Habit;
  onToggleStatus: (habitId: string, date: string, status: Status) => void;
  streak: number;
}

export const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggleStatus, streak }) => {
  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = subDays(new Date(), i);
    return format(date, 'yyyy-MM-dd');
  }).reverse();

  return (
    <div className="relative group">
      <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-500"></div>
      <div className="relative bg-zinc-900 ring-1 ring-white/10 rounded-2xl p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">{habit.name}</h3>
            <p className="text-sm text-zinc-400">Ostatnie 14 dni</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-2xl font-black text-blue-500">{streak}</span>
            <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">Dni</span>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {last14Days.map((dateStr) => {
            const status = habit.entries[dateStr] || 'none';
            const isToday = isSameDay(new Date(), parseISO(dateStr));

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
                    w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                    ${status === 'success' ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)] text-emerald-950' : ''}
                    ${status === 'fail' ? 'bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.4)] text-rose-950' : ''}
                    ${status === 'none' ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-500' : ''}
                    ${isToday ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-zinc-900' : ''}
                  `}
                >
                  {status === 'success' && <Check size={20} strokeWidth={3} />}
                  {status === 'fail' && <X size={20} strokeWidth={3} />}
                  {status === 'none' && <div className="w-1 h-1 rounded-full bg-zinc-600" />}
                </button>
                <span className={`text-[10px] font-medium ${isToday ? 'text-blue-400' : 'text-zinc-600'}`}>
                  {format(parseISO(dateStr), 'dd/MM')}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
