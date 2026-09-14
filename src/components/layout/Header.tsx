'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, Sun, Moon, Settings, LogOut, ChevronDown, UserCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const router = useRouter();
  const { searchQuery, setSearchQuery, language, setLanguage, theme, toggleTheme, t, showToast, logout } = useApp();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isDark = theme === 'dark';

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSettings = () => {
    setIsProfileOpen(false);
    showToast(t.settingsMsg);
  };

  const handleLogout = () => {
    setIsProfileOpen(false);
    showToast(t.logoutMsg);
    logout();
  };

  return (
    <header
      className={`h-16 px-6 flex items-center justify-between sticky top-0 z-20 border-b transition-colors duration-200 ${
        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-900 shadow-xs shadow-slate-200/50'
      }`}
    >
      {/* Search Input */}
      <div className="flex items-center space-x-3 w-80">
        <div className="relative w-full">
          <Search
            className={`w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 ${
              isDark ? 'text-zinc-500' : 'text-slate-400'
            }`}
          />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-9 pr-3.5 py-1.5 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500 font-medium'
                : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 font-medium focus:bg-white'
            }`}
          />
        </div>
      </div>

      {/* Controls: Theme, Language Switcher, Profile Menu */}
      <div className="flex items-center space-x-3">
        {/* Light / Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className={`p-2 rounded-xl border flex items-center space-x-1.5 text-xs font-semibold transition-colors ${
            isDark
              ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100'
              : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
          }`}
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
        </button>

        {/* Amharic / English Language Switcher */}
        <div
          className={`flex items-center p-0.5 rounded-xl border ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-slate-100 border-slate-200'
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

        {/* Clickable Profile Button & Dropdown Menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            className={`flex items-center space-x-2 pl-3 border-l py-1 px-1.5 rounded-xl transition-colors ${
              isDark
                ? 'border-zinc-800 hover:bg-zinc-900'
                : 'border-slate-200 hover:bg-slate-100'
            }`}
          >
            <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-200 dark:bg-zinc-800 dark:text-zinc-200 flex items-center justify-center font-bold text-xs border border-slate-700/50">
              BW
            </div>
            <div className="hidden lg:block text-left">
              <p className={`text-xs font-bold leading-none ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                {t.managerName}
              </p>
              <p className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {t.shiftRole}
              </p>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProfileOpen ? 'rotate-180' : ''} ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div
              className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border py-1.5 z-50 animate-fade-in ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
              }`}
            >
              <div className={`px-3.5 py-2 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                <p className="text-xs font-bold text-red-600">{t.managerName}</p>
                <p className="text-[10px] text-zinc-400">Shift Supervisor</p>
              </div>

              <button
                type="button"
                onClick={handleSettings}
                className={`w-full px-3.5 py-2 text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-50 text-slate-700'
                }`}
              >
                <Settings className="w-4 h-4 text-zinc-400" />
                <span>{t.settings}</span>
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className={`w-full px-3.5 py-2 text-xs font-medium flex items-center space-x-2.5 transition-colors ${
                  isDark ? 'hover:bg-zinc-800 text-red-400' : 'hover:bg-slate-50 text-red-600'
                }`}
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>{t.logout}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
