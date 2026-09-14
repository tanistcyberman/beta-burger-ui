'use client';

import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ActiveOrder } from '../../types';
import { PaymentModal } from '../../components/pos/PaymentModal';
import { OrderEditModal } from '../../components/pos/OrderEditModal';
import { CheckCircle2, CreditCard, Clock, Edit3, User, ShieldCheck } from 'lucide-react';

export default function ActiveOrdersPage() {
  const { activeOrders, markOrderServed, theme, t, language } = useApp();
  const isDark = theme === 'dark';

  const [checkoutOrder, setCheckoutOrder] = useState<ActiveOrder | null>(null);
  const [editingOrder, setEditingOrder] = useState<ActiveOrder | null>(null);

  const pendingOrders = activeOrders.filter((o) => o.status === 'pending');
  const servedOrders = activeOrders.filter((o) => o.status === 'served');
  const paidOrders = activeOrders.filter((o) => o.status === 'paid').slice(0, 10);

  const formatElapsed = (isoTime: string) => {
    const elapsedMs = Date.now() - new Date(isoTime).getTime();
    const mins = Math.max(0, Math.floor(elapsedMs / (1000 * 60)));
    if (mins < 1) return language === 'am' ? 'አሁን' : 'Just now';
    return language === 'am' ? `${mins}m በፊት` : `${mins}m ago`;
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Top Header Banner */}
      <div
        className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border transition-colors ${
          isDark
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
            : 'bg-white border-slate-200 text-slate-900 shadow-sm'
        }`}
      >
        <div>
          <h1 className={`text-xl font-bold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>{t.posTitle}</h1>
          <p className={`text-xs mt-0.5 font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            {t.posSubtitle}
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className={`flex items-center space-x-2 text-xs font-semibold px-3.5 py-1.5 rounded-xl border ${
            isDark
              ? 'bg-zinc-800 border-zinc-700 text-zinc-300'
              : 'bg-slate-50 border-slate-200 text-slate-700'
          }`}>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Real-time Table Running Tabs</span>
          </div>
        </div>
      </div>

      {/* 3-Column Enterprise Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Column 1: Kitchen Pending (Unpaid & Waiting) */}
        <div
          className={`rounded-2xl border p-4 space-y-4 transition-colors ${
            isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <h2 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-900'}`}>{t.kitchenPending}</h2>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              {pendingOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[320px]">
            {pendingOrders.length === 0 ? (
              <div className={`text-center py-12 text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                No orders waiting in kitchen.
              </div>
            ) : (
              pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl border border-l-4 border-l-amber-500 space-y-3 transition-all hover:shadow-md ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  {/* Card Header: Table Number & Running Total */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-black text-sm tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        {order.tableNumber.toUpperCase()}
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        #{order.orderNumber.replace('#BB-', '')}
                      </span>
                    </div>
                    <span className={`font-black text-xs ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                      {t.formatMoney(order.grandTotal)}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className={`text-xs space-y-1.5 py-2 border-y ${isDark ? 'border-zinc-800/80' : 'border-slate-100'}`}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={`flex justify-between items-center ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        <span className="font-bold text-[11px]">
                          {item.quantity}x {language === 'am' ? item.menuItem.nameAm : item.menuItem.nameEn}
                        </span>
                        <span className={`font-mono text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {t.formatMoney(item.menuItem.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={`flex items-center justify-between text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <span className={`flex items-center space-x-1 font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{formatElapsed(order.createdAt)}</span>
                    </span>
                    {order.waiterName && (
                      <span className={`flex items-center space-x-1 font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <User className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
                        <span>{order.waiterName}</span>
                      </span>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingOrder(order)}
                      className={`py-1.5 rounded-lg border text-xs font-bold flex items-center justify-center space-x-1 transition-colors cursor-pointer ${
                        isDark ? 'border-zinc-800 bg-zinc-800 text-zinc-300 hover:bg-zinc-700' : 'border-slate-300 bg-slate-100 text-slate-800 hover:bg-slate-200'
                      }`}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{t.editCancel}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => markOrderServed(order.id)}
                      className="py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-1 transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{t.markServed}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 2: Currently Eating (Unpaid & Served) */}
        <div
          className={`rounded-2xl border p-4 space-y-4 transition-colors ${
            isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              <h2 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-900'}`}>{t.currentlyEating}</h2>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
              {servedOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[320px]">
            {servedOrders.length === 0 ? (
              <div className={`text-center py-12 text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                No active tables currently eating.
              </div>
            ) : (
              servedOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-4 rounded-xl border border-l-4 border-l-blue-500 space-y-3 transition-all hover:shadow-md ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
                  }`}
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`font-black text-sm tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        {order.tableNumber.toUpperCase()}
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        #{order.orderNumber.replace('#BB-', '')}
                      </span>
                    </div>
                    <span className={`font-black text-xs ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                      {t.formatMoney(order.grandTotal)}
                    </span>
                  </div>

                  {/* Items list */}
                  <div className={`text-xs space-y-1.5 py-2 border-y ${isDark ? 'border-zinc-800/80' : 'border-slate-100'}`}>
                    {order.items.map((item, idx) => (
                      <div key={idx} className={`flex justify-between items-center ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
                        <span className="font-bold text-[11px]">
                          {item.quantity}x {language === 'am' ? item.menuItem.nameAm : item.menuItem.nameEn}
                        </span>
                        <span className={`font-mono text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                          {t.formatMoney(item.menuItem.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className={`flex items-center justify-between text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                    <span className={`flex items-center space-x-1 font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                      <Clock className="w-3.5 h-3.5 text-blue-500" />
                      <span>Served {formatElapsed(order.servedAt || order.createdAt)}</span>
                    </span>
                    {order.waiterName && (
                      <span className={`flex items-center space-x-1 font-bold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                        <User className={`w-3 h-3 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`} />
                        <span>{order.waiterName}</span>
                      </span>
                    )}
                  </div>

                  {/* Action Button: Green Checkout */}
                  <button
                    type="button"
                    onClick={() => setCheckoutOrder(order)}
                    className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{t.checkout}</span>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Column 3: Recent Completed Sales (Paid) */}
        <div
          className={`rounded-2xl border p-4 space-y-4 transition-colors ${
            isDark ? 'bg-zinc-950/80 border-zinc-800' : 'bg-slate-100/90 border-slate-200'
          }`}
        >
          <div className={`flex items-center justify-between pb-3 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <h2 className={`font-bold text-xs uppercase tracking-wider ${isDark ? 'text-zinc-300' : 'text-slate-900'}`}>{t.recentCompleted}</h2>
            </div>
            <span className="px-2 py-0.5 text-xs font-bold rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {paidOrders.length}
            </span>
          </div>

          <div className="space-y-3 min-h-[320px]">
            {paidOrders.length === 0 ? (
              <div className={`text-center py-12 text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
                No recent completed sales today.
              </div>
            ) : (
              paidOrders.map((order) => (
                <div
                  key={order.id}
                  className={`p-3.5 rounded-xl border border-l-4 border-l-emerald-500 flex items-center justify-between space-x-3 transition-all hover:shadow-sm ${
                    isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-extrabold text-xs ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                        {order.tableNumber.toUpperCase()}
                      </span>
                      <span className={`font-mono text-[11px] font-bold ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                        #{order.orderNumber.replace('#BB-', '')}
                      </span>
                    </div>
                    <p className={`text-[10px] font-semibold mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
                      Paid via {order.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash'}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className={`font-black text-xs block ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                      +{t.formatMoney(order.grandTotal)}
                    </span>
                    <span className={`text-[10px] font-bold uppercase ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>
                      ✓ Paid
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {checkoutOrder && (
        <PaymentModal order={checkoutOrder} onClose={() => setCheckoutOrder(null)} />
      )}

      {/* Edit / Cancel Modal */}
      {editingOrder && (
        <OrderEditModal order={editingOrder} onClose={() => setEditingOrder(null)} />
      )}
    </div>
  );
}
