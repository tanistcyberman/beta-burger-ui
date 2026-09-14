'use client';

import React, { useState } from 'react';
import { X, PlusCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { EXPENSE_CATEGORIES } from '../../translations';

interface RecordExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RecordExpenseModal: React.FC<RecordExpenseModalProps> = ({ isOpen, onClose }) => {
  const { addExpense, theme, language, t } = useApp();

  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer'>('cash');

  const isDark = theme === 'dark';
  const isAm = language === 'am';

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!description.trim() || isNaN(numAmount) || numAmount <= 0) return;

    addExpense({
      description,
      amount: numAmount,
      category,
      paymentMethod,
    });

    setDescription('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-zinc-950/80 animate-fade-in">
      <div
        className={`rounded-xl max-w-md w-full p-5 shadow-xl border transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400 flex items-center justify-center font-bold">
              <PlusCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100">{t.expenseModalTitle}</h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-semibold mb-1">{t.expenseDescLabel} <span className="text-red-500">*</span></label>
            <input
              type="text"
              required
              placeholder={t.expenseDescPlaceholder}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
              }`}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">{t.expenseAmountLabel} <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 font-bold text-xs">
                {t.currencySymbol}
              </span>
              <input
                type="number"
                step="1"
                min="1"
                required
                placeholder="0"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className={`w-full pl-10 pr-3 py-2 border rounded-lg text-xs font-bold text-red-600 dark:text-red-400 focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">{t.expenseCategoryLabel}</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg text-xs font-medium focus:outline-none focus:ring-2 focus:ring-red-600 ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'
              }`}
            >
              {EXPENSE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {isAm ? cat.am : cat.en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold mb-1">{t.expensePaymentLabel}</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPaymentMethod('cash')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  paymentMethod === 'cash'
                    ? 'bg-red-700 text-white border-red-700 shadow-2xs'
                    : isDark
                    ? 'bg-zinc-950 text-zinc-300 border-zinc-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t.cash}
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('bank_transfer')}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-colors ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                    : isDark
                    ? 'bg-zinc-950 text-zinc-300 border-zinc-800'
                    : 'bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                {t.bankTransfer}
              </button>
            </div>
          </div>

          <div className={`pt-3 border-t flex items-center justify-end space-x-2.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
            <button
              type="button"
              onClick={onClose}
              className={`px-3.5 py-2 rounded-lg border text-xs font-medium transition-colors ${
                isDark ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
              }`}
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-800 text-white text-xs font-bold shadow-2xs transition-colors"
            >
              {t.saveExpense}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
