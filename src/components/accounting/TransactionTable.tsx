'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ShieldCheck, Banknote, Search } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getCategoryTranslation } from '../../translations';

export const TransactionTable: React.FC = () => {
  const { transactions, theme, language, t } = useApp();
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');
  const [tableSearch, setTableSearch] = useState('');

  const isDark = theme === 'dark';
  const isAm = language === 'am';

  const filteredTxs = transactions.filter((tx) => {
    const matchesType = filterType === 'all' || tx.type === filterType;
    const desc = isAm ? (tx.descriptionAm || tx.descriptionEn) : (tx.descriptionEn || tx.descriptionAm);
    const rawCat = isAm ? (tx.categoryAm || tx.categoryEn) : (tx.categoryEn || tx.categoryAm);
    const cat = getCategoryTranslation(rawCat, isAm ? 'am' : 'en');
    const matchesSearch =
      desc.toLowerCase().includes(tableSearch.toLowerCase()) ||
      tx.orderNumber.toLowerCase().includes(tableSearch.toLowerCase()) ||
      cat.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div
      className={`rounded-xl p-5 border space-y-4 transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className={`flex items-center space-x-1 p-0.5 rounded-lg w-fit ${isDark ? 'bg-zinc-950' : 'bg-slate-100'}`}>
          <button
            onClick={() => setFilterType('all')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              filterType === 'all'
                ? isDark
                  ? 'bg-zinc-800 text-zinc-100 shadow-2xs'
                  : 'bg-white text-slate-900 shadow-2xs'
                : isDark
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.filterAll} ({transactions.length})
          </button>
          <button
            onClick={() => setFilterType('income')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              filterType === 'income'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : isDark
                ? 'text-zinc-400 hover:text-emerald-400'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            {t.filterIncome}
          </button>
          <button
            onClick={() => setFilterType('expense')}
            className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${
              filterType === 'expense'
                ? 'bg-red-700 text-white shadow-2xs'
                : isDark
                ? 'text-zinc-400 hover:text-red-400'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            {t.filterExpense}
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={tableSearch}
            onChange={(e) => setTableSearch(e.target.value)}
            className={`w-full pl-9 pr-3 py-1.5 border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-600 ${
              isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
            }`}
          />
        </div>
      </div>

      <div className={`overflow-x-auto rounded-lg border ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-400' : 'bg-slate-100/80 border-slate-200 text-slate-700'}`}>
              <th className="py-2.5 px-3.5">{t.refOrderNum}</th>
              <th className="py-2.5 px-3.5">{t.dateTime}</th>
              <th className="py-2.5 px-3.5">{t.description}</th>
              <th className="py-2.5 px-3.5">{t.category}</th>
              <th className="py-2.5 px-3.5">{t.type}</th>
              <th className="py-2.5 px-3.5">{t.paymentMethodLabel}</th>
              <th className="py-2.5 px-3.5 text-right">{t.amount} ({t.currencySymbol})</th>
            </tr>
          </thead>
          <tbody className={`divide-y text-xs font-medium ${isDark ? 'divide-zinc-800/80 text-zinc-200' : 'divide-slate-200/60 text-slate-800'}`}>
            {filteredTxs.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-slate-400 font-medium">
                  {t.noRecords}
                </td>
              </tr>
            ) : (
              filteredTxs.map((tx, idx) => {
                const isIncome = tx.type === 'income';
                const isBank = tx.paymentMethod === 'bank_transfer';
                const description = isAm ? (tx.descriptionAm || tx.descriptionEn) : (tx.descriptionEn || tx.descriptionAm);
                const rawCat = isAm ? (tx.categoryAm || tx.categoryEn) : (tx.categoryEn || tx.categoryAm);
                const categoryDisplay = getCategoryTranslation(rawCat, isAm ? 'am' : 'en');
                const isEven = idx % 2 === 0;

                return (
                  <tr
                    key={tx.id}
                    className={`transition-colors ${
                      isDark
                        ? isEven
                          ? 'bg-zinc-900 hover:bg-zinc-850'
                          : 'bg-zinc-950/40 hover:bg-zinc-850'
                        : isEven
                        ? 'bg-white hover:bg-slate-50'
                        : 'bg-gray-50/50 hover:bg-slate-100/50'
                    }`}
                  >
                    <td className="py-3 px-3.5 font-mono font-bold text-xs">
                      {tx.orderNumber.replace('#BB-', '').replace('EXP-', '')}
                    </td>
                    <td className="py-3 px-3.5 text-[11px]">
                      <div className="font-semibold">{tx.date}</div>
                      <div className={isDark ? 'text-zinc-500' : 'text-slate-400'}>{tx.time}</div>
                    </td>
                    <td className="py-3 px-3.5 max-w-xs">
                      <p className="font-semibold line-clamp-1">{description}</p>
                      {tx.bankDetails && (
                        <p className="text-[10px] text-indigo-600 dark:text-indigo-400 font-mono mt-0.5 font-medium">
                          Ref: {tx.bankDetails.referenceId}
                        </p>
                      )}
                    </td>
                    <td className="py-3 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${isDark ? 'bg-zinc-800 text-zinc-300' : 'bg-slate-100 text-slate-700'}`}>
                        {categoryDisplay}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <span
                        className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          isIncome
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 border border-red-200 dark:border-red-800'
                        }`}
                      >
                        {isIncome ? (
                          <>
                            <ArrowUpRight className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                            <span>{t.income}</span>
                          </>
                        ) : (
                          <>
                            <ArrowDownRight className="w-3 h-3 text-red-600 dark:text-red-400" />
                            <span>{t.expense}</span>
                          </>
                        )}
                      </span>
                    </td>
                    <td className="py-3 px-3.5">
                      <div className="flex items-center space-x-1.5 font-semibold text-xs">
                        {isBank ? (
                          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
                        ) : (
                          <Banknote className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        )}
                        <span>
                          {tx.paymentMethod === 'bank_transfer' ? t.bankTransfer : t.cash}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-3.5 text-right">
                      <span className={`text-xs font-bold ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                        {isIncome ? `+${t.formatMoney(tx.amount)}` : `-${t.formatMoney(tx.amount)}`}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
