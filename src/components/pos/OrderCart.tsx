'use client';

import React from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Banknote, Landmark, CheckCircle2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TransferVerificationUI } from './TransferVerificationUI';

export const OrderCart: React.FC = () => {
  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    tax,
    grandTotal,
    paymentMethod,
    setPaymentMethod,
    verifiedReceipt,
    completeSale,
    theme,
    language,
    t,
  } = useApp();

  const isDark = theme === 'dark';
  const isAm = language === 'am';
  const isBank = paymentMethod === 'bank_transfer';
  const canComplete = cart.length > 0 && (!isBank || (isBank && verifiedReceipt !== null));

  return (
    <div
      className={`rounded-xl p-5 border flex flex-col h-[calc(100vh-6rem)] sticky top-20 transition-colors ${
        isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900 shadow-sm'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between pb-3.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-lg bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-400">
            <ShoppingCart className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm">{t.currentOrder}</h3>
          </div>
        </div>

        {cart.length > 0 && (
          <button
            onClick={clearCart}
            className="text-xs font-semibold text-red-600 dark:text-red-400 hover:underline transition-colors flex items-center space-x-1"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.clearCart}</span>
          </button>
        )}
      </div>

      {/* Cart Items List */}
      <div className="flex-1 overflow-y-auto py-3 space-y-2 scrollbar-thin">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-2.5 ${isDark ? 'bg-zinc-950' : 'bg-slate-50'}`}>
              <ShoppingCart className="w-6 h-6 text-slate-400" />
            </div>
            <p className={`font-bold text-xs ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>{t.cartEmpty}</p>
            <p className="text-[11px] font-medium text-slate-400 mt-0.5 max-w-xs">{t.cartEmptySub}</p>
          </div>
        ) : (
          cart.map(({ menuItem, quantity }) => {
            const itemName = isAm ? menuItem.nameAm : menuItem.nameEn;

            return (
              <div
                key={menuItem.id}
                className={`p-2.5 rounded-lg border flex items-center justify-between transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <img
                    src={menuItem.image}
                    alt={itemName}
                    className="w-10 h-10 rounded-md object-cover bg-slate-200 dark:bg-zinc-800 shrink-0"
                  />
                  <div>
                    <h4 className="font-bold text-xs line-clamp-1">{itemName}</h4>
                    <p className="text-[11px] font-bold text-red-600 dark:text-red-400 mt-0.5">{t.formatMoney(menuItem.price * quantity)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <div className={`flex items-center space-x-1 border rounded-lg p-0.5 ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
                    <button
                      onClick={() => updateQuantity(menuItem.id, -1)}
                      className="w-5 h-5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center font-bold text-xs">{quantity}</span>
                    <button
                      onClick={() => updateQuantity(menuItem.id, 1)}
                      className="w-5 h-5 rounded bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-200 flex items-center justify-center font-bold text-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>

                  <button
                    onClick={() => removeFromCart(menuItem.id)}
                    className="text-slate-400 hover:text-red-600 p-1 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Totals Section */}
      <div className={`pt-3 border-t space-y-1.5 ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div className={`flex justify-between text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
          <span>{t.subtotal}</span>
          <span className="font-bold text-slate-900 dark:text-zinc-100">{t.formatMoney(subtotal)}</span>
        </div>
        <div className={`flex justify-between text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-600'}`}>
          <span>{t.tax}</span>
          <span className="font-bold text-slate-900 dark:text-zinc-100">{t.formatMoney(tax)}</span>
        </div>
        <div className={`flex justify-between items-baseline pt-2 border-t ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
          <span className="text-sm font-bold">{t.grandTotal}</span>
          <span className="text-xl font-bold text-red-600 dark:text-red-400">{t.formatMoney(grandTotal)}</span>
        </div>
      </div>

      {/* Payment Method Switcher */}
      <div className="mt-3.5 space-y-2.5">
        <label className={`block text-[11px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
          {t.paymentChannel}:
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setPaymentMethod('cash')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-colors ${
              paymentMethod === 'cash'
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                : isDark
                ? 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Banknote className="w-4 h-4" />
            <span>{t.cash}</span>
          </button>

          <button
            type="button"
            onClick={() => setPaymentMethod('bank_transfer')}
            className={`py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center space-x-1.5 border transition-colors ${
              paymentMethod === 'bank_transfer'
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-2xs'
                : isDark
                ? 'bg-zinc-950 text-zinc-300 border-zinc-800 hover:bg-zinc-800'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Landmark className="w-4 h-4" />
            <span>{t.bankTransfer}</span>
          </button>
        </div>

        {isBank && <TransferVerificationUI />}

        <button
          type="button"
          onClick={completeSale}
          disabled={!canComplete}
          className={`w-full py-3 px-4 rounded-lg font-bold text-xs shadow-2xs transition-colors flex items-center justify-center space-x-2 ${
            !canComplete
              ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed border border-slate-200 dark:border-zinc-700'
              : 'bg-red-700 hover:bg-red-800 text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>{t.completeSale}</span>
        </button>
      </div>
    </div>
  );
};
