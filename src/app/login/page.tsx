'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { UtensilsCrossed, User, Lock, Eye, EyeOff, LogIn, AlertCircle, Sun, Moon, ShieldCheck, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, showToast, t, theme, toggleTheme, language, setLanguage } = useApp();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isDark = theme === 'dark';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!username.trim()) {
      setError(language === 'am' ? 'እባክዎን የተጠቃሚ ስም ያስገቡ' : 'Please enter username');
      return;
    }
    if (!password) {
      setError(language === 'am' ? 'እባክዎን የይለፍ ቃል ያስገቡ' : 'Please enter password');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const success = login(username, password);
      setIsSubmitting(false);

      if (success) {
        showToast(t.loginSuccess);
        router.replace('/');
      } else {
        setError(t.invalidCreds);
      }
    }, 400);
  };

  const handleAutoFill = () => {
    setUsername('biniyam worku aseffa');
    setPassword('beta_owner');
    setError(null);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header Toolbar: Theme & Language Switchers */}
      <div className="flex items-center justify-between w-full max-w-5xl mx-auto py-2">
        <div className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-red-700 flex items-center justify-center text-white shadow-md shadow-red-900/30">
            <UtensilsCrossed className="w-5 h-5" />
          </div>
          <div>
            <span className="font-black tracking-wider text-base text-red-600 dark:text-red-500 block leading-tight">
              BETA BURGER
            </span>
            <span className={`text-[10px] font-semibold tracking-wide ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
              SYSTEM AUTH
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2.5">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`p-2 rounded-xl border flex items-center space-x-1.5 text-xs font-semibold transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900 shadow-2xs'
            }`}
            title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
          </button>

          {/* Language Switcher */}
          <div
            className={`flex items-center p-0.5 rounded-xl border ${
              isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-2xs'
            }`}
          >
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                language === 'en'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage('am')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                language === 'am'
                  ? 'bg-red-700 text-white shadow-2xs'
                  : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              አማርኛ
            </button>
          </div>
        </div>
      </div>

      {/* Main Login Card Container */}
      <div className="flex-1 flex items-center justify-center py-8">
        <div className="w-full max-w-md">
          <div className={`rounded-2xl border p-7 sm:p-8 shadow-md transition-all ${
            isDark
              ? 'bg-zinc-900/90 border-zinc-800 shadow-black/50'
              : 'bg-white border-slate-200 shadow-slate-200/50'
          }`}>
            {/* Header / Brand Title */}
            <div className="text-center space-y-2 mb-7">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-red-600/10 text-red-600 dark:text-red-500 mb-1">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{t.loginTitle}</h1>
              <p className={`text-xs font-medium max-w-xs mx-auto ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {t.loginSubtitle}
              </p>
            </div>

            {/* Error Notification Banner */}
            {error && (
              <div className="mb-5 p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-2.5">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Input */}
              <div className="space-y-1.5">
                <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                  {t.usernameLabel}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={t.usernamePlaceholder}
                    className={`w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors ${
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className={`block text-xs font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                    {t.passwordLabel}
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Lock className={`w-4 h-4 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError(null);
                    }}
                    placeholder={t.passwordPlaceholder}
                    className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors ${
                      isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600'
                        : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className={`absolute inset-y-0 right-0 pr-3.5 flex items-center transition-colors ${
                      isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full mt-2 py-3 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-bold text-xs shadow-md shadow-red-900/30 flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>{t.signInButton}</span>
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Credentials Assistant */}
            <div className={`mt-6 pt-5 border-t text-center ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <button
                type="button"
                onClick={handleAutoFill}
                className={`w-full py-2 px-3 rounded-xl border border-dashed flex items-center justify-center space-x-2 text-xs font-semibold transition-colors ${
                  isDark
                    ? 'border-zinc-700 bg-zinc-800/40 text-zinc-300 hover:bg-zinc-800 hover:text-white'
                    : 'border-slate-300 bg-slate-50 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.fillDemoCreds}</span>
              </button>
              <p className={`text-[10px] font-medium mt-2 ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                {t.demoCredsHint}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-2 text-[11px] font-medium text-zinc-500">
        © 2026 BETA BURGER. All rights reserved. Point of Sale & Fraud Prevention POS.
      </footer>
    </div>
  );
}
