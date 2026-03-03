'use client';

import React from 'react';
import { Trophy, Flame } from 'lucide-react';

interface StatsSummaryProps {
  totalScore: number;
  habitCount: number;
}

export const StatsSummary: React.FC<StatsSummaryProps> = ({ totalScore, habitCount }) => {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-3xl blur opacity-25"></div>
        <div className="relative bg-zinc-900 ring-1 ring-white/10 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 ring-1 ring-blue-500/20">
              <Trophy size={32} />
            </div>
            <div>
              <h2 className="text-zinc-400 font-medium uppercase tracking-widest text-xs mb-1">Całkowity Wynik</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tighter">{totalScore}</span>
                <span className="text-zinc-500 font-bold uppercase text-sm tracking-widest">Punktów</span>
              </div>
            </div>
          </div>

          <div className="h-px md:h-12 w-full md:w-px bg-white/10" />

          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 ring-1 ring-emerald-500/20">
              <Flame size={32} />
            </div>
            <div>
              <h2 className="text-zinc-400 font-medium uppercase tracking-widest text-xs mb-1">Aktywne Nawyki</h2>
              <div className="flex items-baseline gap-2">
                <span className="text-5xl font-black text-white tracking-tighter">{habitCount}</span>
                <span className="text-zinc-500 font-bold uppercase text-sm tracking-widest">Śledzonych</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
