'use client';

import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeeklyRevenueChart: React.FC = () => {
  const { weeklyRevenue, theme, language, t } = useApp();

  const isDark = theme === 'dark';
  const isAm = language === 'am';

  const chartData = weeklyRevenue.map((item) => ({
    name: isAm ? item.dayAm : item.dayEn,
    total: item.total,
    date: item.date,
  }));

  // Trading Style Custom Tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="p-3 rounded-xl shadow-2xl bg-zinc-900 border border-zinc-700/80 text-white text-xs space-y-1 font-mono animate-fade-in">
          <p className="font-bold text-blue-400 border-b border-zinc-800 pb-1 mb-1">
            {data.name} ({data.date})
          </p>
          <div className="flex items-center justify-between space-x-6">
            <span className="text-zinc-400 font-sans">Revenue:</span>
            <span className="font-black text-emerald-400">{t.formatMoney(data.total)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const totalWeekly = weeklyRevenue.reduce((s, d) => s + d.total, 0);

  return (
    <div
      className={`rounded-2xl p-5 border transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">{t.weeklyAnalysis}</h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-blue-500/10 text-blue-600 dark:text-blue-500 border border-blue-500/20 flex items-center space-x-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Trading View</span>
            </span>
          </div>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.weeklySubtitle}</p>
        </div>

        <div className="flex items-center space-x-2 text-xs font-semibold px-3 py-1.5 rounded-xl border bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-500">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
          <span>Daily Revenue Trend (ETB)</span>
        </div>
      </div>

      {/* Recharts Area Chart - Single Professional Trading Style Color */}
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="tradingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#27272a' : '#e2e8f0'} />
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#a1a1aa' : '#475569', fontSize: 12, fontWeight: 700 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: isDark ? '#a1a1aa' : '#475569', fontSize: 11, fontWeight: 600 }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k ETB`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="#3b82f6"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#tradingGradient)"
              activeDot={{ r: 6, fill: '#3b82f6', stroke: '#ffffff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-medium ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-slate-100 text-slate-500'}`}>
        <div className="flex items-center space-x-1.5">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>{t.hoverTooltip}</span>
        </div>
        <span className="font-bold text-slate-900 dark:text-zinc-100">
          7-Day Revenue Total: <span className="text-blue-600 dark:text-blue-400 font-black">{t.formatMoney(totalWeekly)}</span>
        </span>
      </div>
    </div>
  );
};
