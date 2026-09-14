'use client';

import React from 'react';
import { SummaryCardGroup } from '../components/dashboard/SummaryCard';
import { WeeklyRevenueChart } from '../components/dashboard/WeeklyRevenueChart';
import { RecentActivity } from '../components/dashboard/RecentActivity';
import { ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const { theme, t } = useApp();
  const isDark = theme === 'dark';

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Clean Header Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white text-slate-900 border-slate-200 shadow-sm'
        }`}
      >
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{t.dashboardTitle}</h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.dashboardSubtitle}</p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link
            href="/pos"
            className="px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs shadow-2xs flex items-center space-x-2 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t.newSale}</span>
          </Link>
        </div>
      </div>

      {/* Top Metric Cards */}
      <SummaryCardGroup />

      {/* Weekly Revenue Chart & Live Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeeklyRevenueChart />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </div>
  );
}
