'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, ReceiptText, Flame, ShieldCheck, Smartphone, Layers } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { activeOrders, theme, t } = useApp();

  const isDark = theme === 'dark';
  const activeCount = activeOrders.filter((o) => o.status !== 'paid').length;

  const navItems = [
    {
      name: t.dashboard,
      href: '/',
      icon: LayoutDashboard,
    },
    {
      name: t.activeOrders,
      href: '/active-orders',
      icon: Layers,
      badge: activeCount > 0 ? `${activeCount}` : undefined,
    },
    {
      name: t.waiterMode,
      href: '/waiter',
      icon: Smartphone,
    },
    {
      name: t.accounting,
      href: '/accounting',
      icon: ReceiptText,
    },
  ];

  return (
    <aside
      className={`w-64 flex flex-col justify-between h-screen sticky top-0 border-r transition-colors duration-200 z-30 ${
        isDark ? 'bg-zinc-950 text-zinc-100 border-zinc-800' : 'bg-white text-slate-900 border-slate-200/90 shadow-sm shadow-slate-200/40'
      }`}
    >
      <div>
        {/* Brand Header */}
        <Link
          href="/"
          className={`p-5 border-b flex items-center space-x-3 transition-colors cursor-pointer ${
            isDark ? 'border-zinc-800 hover:bg-zinc-900/60' : 'border-slate-200/80 hover:bg-slate-50'
          }`}
          title="Return to Home Dashboard"
        >
          <div className="w-10 h-10 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold shadow-2xs">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center space-x-1">
              <span className={`font-bold text-lg tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>BETA</span>
              <span className="font-bold text-lg tracking-tight text-red-600">BURGER</span>
            </div>
            <p className={`text-[11px] font-medium tracking-wide uppercase ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.appSubtitle}</p>
          </div>
        </Link>

        {/* Branch Pill */}
        <div className={`mx-4 mt-5 p-3 rounded-xl border flex items-center space-x-2.5 ${
          isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-slate-50 border-slate-200'
        }`}>
          <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
          <p className={`text-xs font-semibold ${isDark ? 'text-zinc-200' : 'text-slate-700'}`}>{t.branchStatus}</p>
        </div>

        {/* Navigation Menu */}
        <div className="px-3 mt-6">
          <nav className="space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-red-700 text-white shadow-2xs'
                      : isDark
                      ? 'text-zinc-400 hover:bg-zinc-900 hover:text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`w-4 h-4 ${
                      isActive
                        ? 'text-white'
                        : isDark
                        ? 'text-zinc-500 group-hover:text-zinc-300'
                        : 'text-slate-400 group-hover:text-slate-700'
                    }`} />
                    <span>{item.name}</span>
                  </div>

                  {item.badge && (
                    <span className="px-2 py-0.5 text-[11px] font-bold bg-red-600 text-white rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Verification Shield Indicator */}
      <div className={`p-4 border-t ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-200 bg-slate-50/50'}`}>
        <div className={`p-3 rounded-xl border flex items-center space-x-2.5 ${
          isDark ? 'bg-zinc-900/50 border-zinc-800' : 'bg-white border-slate-200 shadow-2xs'
        }`}>
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <div>
            <p className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>Fraud Protection</p>
            <p className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Verified Bank Receipts</p>
          </div>
        </div>
      </div>
    </aside>
  );
};
