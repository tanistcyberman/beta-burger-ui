'use client';

import React, { useState } from 'react';
import { PlusCircle, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransactionTable } from '../../components/accounting/TransactionTable';
import { RecordExpenseModal } from '../../components/accounting/RecordExpenseModal';

export default function AccountingPage() {
  const { transactions, theme, t } = useApp();
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  const isDark = theme === 'dark';

  const totalIncomeAll = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpensesAll = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfitAll = totalIncomeAll - totalExpensesAll;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl border transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{t.accountingTitle}</h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.accountingSubtitle}</p>
        </div>

        <button
          onClick={() => setIsExpenseModalOpen(true)}
          className="px-4 py-2.5 rounded-lg bg-red-700 hover:bg-red-800 text-white font-semibold text-xs shadow-2xs flex items-center space-x-2 transition-colors shrink-0 cursor-pointer"
        >
          <PlusCircle className="w-4 h-4 text-white" />
          <span>{t.recordExpense}</span>
        </button>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className={`p-5 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.totalIncome}</span>
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">{t.formatMoney(totalIncomeAll)}</h3>
          </div>
        </div>

        <div className={`p-5 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.totalExpenses}</span>
            <div className="p-2 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-bold text-red-600 dark:text-red-400 tracking-tight">{t.formatMoney(totalExpensesAll)}</h3>
          </div>
        </div>

        <div className={`p-5 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'}`}>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-semibold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.netProfit}</span>
            <div className="p-2 rounded-lg bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className={`text-2xl font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{t.formatMoney(netProfitAll)}</h3>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <TransactionTable />

      <RecordExpenseModal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
      />
    </div>
  );
}
