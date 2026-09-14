'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Toast } from './Toast';

export const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, isAuthenticated, isAuthLoading } = useApp();
  const isDark = theme === 'dark';
  const pathname = usePathname();
  const router = useRouter();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isAuthLoading) {
      if (!isAuthenticated && !isLoginPage) {
        router.replace('/login');
      } else if (isAuthenticated && isLoginPage) {
        router.replace('/');
      }
    }
  }, [isAuthenticated, isAuthLoading, isLoginPage, router]);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  if (isAuthLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
        <div className="flex flex-col items-center space-y-3">
          <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold tracking-wider opacity-70">LOADING BETA BURGER...</span>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return (
      <div className={`min-h-screen transition-colors duration-200 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'}`}>
        {children}
        <Toast />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#F0F3F8] text-slate-900'}`}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <Header />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <Toast />
    </div>
  );
};
