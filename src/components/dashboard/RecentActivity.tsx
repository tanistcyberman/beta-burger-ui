'use client';

import React from 'react';
import { ShieldCheck, Banknote, Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useApp } from '../../context/AppContext';

export const RecentActivity: React.FC = () => {
  const { transactions, theme, language, t } = useApp();

  const isDark = theme === 'dark';
  const isAm = language === 'am';
  const salesTxs = transactions.filter((t) => t.type === 'income').slice(0, 5);

  return (
    <div
      className={`rounded-xl p-5 border transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold tracking-tight text-slate-900 dark:text-zinc-100">{t.recentActivity}</h3>
        </div>
        <Link
          href="/accounting"
          className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline flex items-center space-x-1 group"
        >
          <span>{t.viewLedger}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="space-y-2.5">
        {salesTxs.map((tx) => {
          const isBank = tx.paymentMethod === 'bank_transfer';
          const description = isAm ? tx.descriptionAm : tx.descriptionEn;

          return (
            <div
              key={tx.id}
              className={`p-3 rounded-lg border flex items-center justify-between transition-colors ${
                isDark
                  ? 'bg-zinc-950/60 border-zinc-800 hover:bg-zinc-950'
                  : 'bg-slate-50/80 border-slate-200/80 hover:bg-slate-100/60'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    isBank
                      ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/50'
                      : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50'
                  }`}
                >
                  {isBank ? <ShieldCheck className="w-4 h-4" /> : <Banknote className="w-4 h-4" />}
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-xs">{tx.orderNumber}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                        isBank
                          ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300'
                          : 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                      }`}
                    >
                      {isBank ? t.bankTransfer : t.cash}
                    </span>
                  </div>
                  <p className={`text-[11px] font-medium line-clamp-1 mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                    {description}
                  </p>
                </div>
              </div>

              <div className="text-right">
                <p className="font-bold text-xs text-emerald-600 dark:text-emerald-400">+{t.formatMoney(tx.amount)}</p>
                <div className="flex items-center justify-end space-x-1 text-[10px] font-medium text-slate-400 mt-0.5">
                  <Clock className="w-3 h-3" />
                  <span>{tx.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
