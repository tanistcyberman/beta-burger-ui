'use client';

import React from 'react';
import { X, Trash2, AlertTriangle, Layers } from 'lucide-react';
import { ActiveOrder } from '../../types';
import { useApp } from '../../context/AppContext';

interface OrderEditModalProps {
  order: ActiveOrder;
  onClose: () => void;
}

export const OrderEditModal: React.FC<OrderEditModalProps> = ({ order, onClose }) => {
  const { removeOrderItem, cancelEntireOrder, theme, t, language } = useApp();
  const isDark = theme === 'dark';

  const handleRemoveItem = (index: number) => {
    removeOrderItem(order.id, index);
    if (order.items.length <= 1) {
      onClose();
    }
  };

  const handleCancelEntire = () => {
    cancelEntireOrder(order.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-4 border-b flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-red-600/10 text-red-600 dark:text-red-400 flex items-center justify-center font-bold text-xs">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-sm text-slate-900 dark:text-zinc-100">{t.editOrderTitle}</h2>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-600 text-white">
                  {order.tableNumber}
                </span>
              </div>
              <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                {order.orderNumber} {order.waiterName ? `• Waiter: ${order.waiterName}` : ''}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-1.5 rounded-xl border transition-colors cursor-pointer ${
              isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800' : 'border-slate-200 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Items List */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          <p className="text-xs font-bold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
            Current Running Tab Items:
          </p>

          <div className="space-y-2">
            {order.items.map((item, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl border flex items-center justify-between transition-colors ${
                  isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="min-w-0 pr-2">
                  <p className="font-bold text-xs text-slate-900 dark:text-zinc-100">
                    {item.quantity}x {language === 'am' ? item.menuItem.nameAm : item.menuItem.nameEn}
                  </p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-400 mt-0.5">
                    {t.formatMoney(item.menuItem.price)} each
                  </p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <span className="font-extrabold text-xs text-red-600 dark:text-red-400">
                    {t.formatMoney(item.menuItem.price * item.quantity)}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-600 hover:bg-red-600 hover:text-white transition-colors cursor-pointer"
                    title="Remove item from tab"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Running Totals */}
          <div className={`pt-3 border-t text-xs space-y-1 font-bold ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
            <div className="flex justify-between text-slate-500 dark:text-zinc-400">
              <span>{t.subtotal}</span>
              <span>{t.formatMoney(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-500 dark:text-zinc-400">
              <span>{t.tax}</span>
              <span>{t.formatMoney(order.tax)}</span>
            </div>
            <div className={`flex justify-between text-sm pt-1 border-t font-black ${isDark ? 'border-zinc-800 text-zinc-100' : 'border-slate-200 text-slate-900'}`}>
              <span>{t.grandTotal}</span>
              <span className="text-emerald-600 dark:text-emerald-500">{t.formatMoney(order.grandTotal)}</span>
            </div>
          </div>
        </div>

        {/* Modal Footer - Cancel Entire Order */}
        <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
              isDark ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handleCancelEntire}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-xs flex items-center space-x-1.5 cursor-pointer transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>{t.cancelEntireOrder}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
