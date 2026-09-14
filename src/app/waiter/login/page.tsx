'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../../context/AppContext';
import { DEFAULT_WAITERS } from '../../../data/mockData';
import { Utensils, KeyRound, LogIn, AlertCircle, Sun, Moon, UserCheck, Shield } from 'lucide-react';

export default function WaiterLoginPage() {
  const router = useRouter();
  const { waiterLogin, showToast, t, theme, toggleTheme, language, setLanguage } = useApp();

  const [selectedWaiter, setSelectedWaiter] = useState(DEFAULT_WAITERS[0].username);
  const [pin, setPin] = useState('1234');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    setIsSubmitting(true);
    setTimeout(() => {
      const success = waiterLogin(selectedWaiter, pin);
      setIsSubmitting(false);

      if (success) {
        showToast(language === 'am' ? 'እንኳን ደህና መጡ አስተናጋጅ!' : 'Waiter logged in successfully!');
        router.replace('/waiter');
      } else {
        setError(language === 'am' ? 'የተሳሳተ የይለፍ ቃል!' : 'Invalid waiter credentials or PIN!');
      }
    }, 300);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Header Toolbar */}
      <div className="flex items-center justify-between w-full max-w-4xl mx-auto py-2">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-md">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black tracking-wider text-base text-red-600 dark:text-red-500 block leading-tight">
              BETA BURGER
            </span>
            <span className={`text-[10px] font-bold tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              WAITER PORTAL
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center space-x-1 text-xs font-semibold ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-slate-200 text-slate-700'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
          <div className={`flex items-center p-0.5 rounded-xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${language === 'en' ? 'bg-red-700 text-white' : 'text-zinc-400'}`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('am')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold ${language === 'am' ? 'bg-red-700 text-white' : 'text-zinc-400'}`}
            >
              አማርኛ
            </button>
          </div>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <div className={`rounded-2xl border p-7 sm:p-8 shadow-xl transition-all ${
            isDark ? 'bg-zinc-900/90 border-zinc-800 shadow-black/50' : 'bg-white border-slate-200 shadow-slate-200/60'
          }`}>
            <div className="text-center space-y-2 mb-7">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-500 mb-1">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black tracking-tight">{t.waiterLoginTitle}</h1>
              <p className={`text-xs font-medium max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {t.waiterLoginSubtitle}
              </p>
            </div>

            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Waiter Selection Cards */}
              <div className="space-y-2">
                <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {t.selectWaiters}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {DEFAULT_WAITERS.map((waiter) => {
                    const isSelected = selectedWaiter === waiter.username;
                    return (
                      <button
                        key={waiter.id}
                        type="button"
                        onClick={() => setSelectedWaiter(waiter.username)}
                        className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-red-700 text-white border-red-700 shadow-md scale-[1.02]'
                            : isDark
                            ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="w-8 h-8 rounded-full bg-white/20 dark:bg-zinc-800 font-bold text-xs flex items-center justify-center mx-auto mb-1">
                          {waiter.name.charAt(0)}
                        </div>
                        <p className="text-[11px] font-bold truncate">{waiter.name.split(' ')[0]}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* PIN Input */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {t.pinLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <KeyRound className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="password"
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="Enter PIN (Default: 1234)"
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border font-mono tracking-widest focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-colors cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>START TAKING TABLE ORDERS</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <footer className="text-center py-2 text-[11px] font-medium text-zinc-500">
        © 2026 BETA BURGER • Waiter Mobile POS Portal
      </footer>
    </div>
  );
}
