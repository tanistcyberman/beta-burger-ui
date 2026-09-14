'use client';

import React from 'react';
import { DollarSign, ShoppingBag, CreditCard, ArrowUpRight, Wallet, Landmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SummaryCardGroup: React.FC = () => {
  const { todayTotalRevenue, todayItemsSold, todayCashBalance, todayDigitalBalance, theme, language, t } = useApp();

  const isDark = theme === 'dark';
  const totalSplit = todayCashBalance + todayDigitalBalance || 1;
  const cashPercent = Math.round((todayCashBalance / totalSplit) * 100);
  const digitalPercent = Math.round((todayDigitalBalance / totalSplit) * 100);

  const topSellerName = language === 'am' ? 'በታ ሲግኔቸር ኮምቦ' : 'Beta Tripple Layer';

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
      {/* Card 1: Today's Total Revenue */}
      <div
        className={`rounded-xl p-5 border transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {t.todaysRevenue}
          </span>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-red-950/60 text-red-400' : 'bg-red-50 text-red-700'}`}>
            <DollarSign className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">{t.formatMoney(todayTotalRevenue)}</h2>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> +14.2%
            </span>
          </div>
        </div>

        <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
          <span>{t.autoCalculated}</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{t.accurate}</span>
        </div>
      </div>

      {/* Card 2: Today's Items Sold */}
      <div
        className={`rounded-xl p-5 border transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {t.itemsSold}
          </span>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'}`}>
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-baseline space-x-2">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
              {todayItemsSold} <span className={`text-xs font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.units}</span>
            </h2>
          </div>
        </div>

        <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
          <span>{t.topSeller}:</span>
          <span className="font-semibold text-slate-900 dark:text-zinc-100">{topSellerName}</span>
        </div>
      </div>

      {/* Card 3: Current Cash vs Digital Balance Split */}
      <div
        className={`rounded-xl p-5 border transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {t.cashVsDigital}
          </span>
          <div className={`p-2 rounded-lg ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'}`}>
            <CreditCard className="w-4 h-4" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className={`p-2 rounded-lg border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center space-x-1 text-[11px] font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <Wallet className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              <span>{t.cash}</span>
            </div>
            <p className="text-sm font-bold mt-0.5">
              {t.formatMoney(todayCashBalance)}
            </p>
            <p className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">{cashPercent}%</p>
          </div>

          <div className={`p-2 rounded-lg border ${isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
            <div className={`flex items-center space-x-1 text-[11px] font-semibold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
              <Landmark className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
              <span>{t.bankTransfer}</span>
            </div>
            <p className="text-sm font-bold mt-0.5">
              {t.formatMoney(todayDigitalBalance)}
            </p>
            <p className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">{digitalPercent}% {t.verified}</p>
          </div>
        </div>

        <div className="mt-3">
          <div className={`h-1.5 w-full rounded-full overflow-hidden flex ${isDark ? 'bg-zinc-800' : 'bg-slate-100'}`}>
            <div style={{ width: `${cashPercent}%` }} className="bg-emerald-600 transition-all duration-300" />
            <div style={{ width: `${digitalPercent}%` }} className="bg-indigo-600 transition-all duration-300" />
          </div>
        </div>
      </div>
    </div>
  );
};
