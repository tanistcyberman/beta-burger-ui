'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '../../context/AppContext';
import { MenuItem, CartItem, CategoryType } from '../../types';
import { Utensils, Plus, Minus, Send, Trash2, ChevronDown, ChevronUp, ShoppingBag, LogOut, X, Layers, Check } from 'lucide-react';

export default function WaiterPage() {
  const router = useRouter();
  const { menuItems, activeOrders, submitWaiterOrder, waiterUser, isWaiterAuthenticated, waiterLogout, theme, t, language } = useApp();
  const isDark = theme === 'dark';

  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [draftCart, setDraftCart] = useState<CartItem[]>([]);
  const [isTableModalOpen, setIsTableModalOpen] = useState<boolean>(false);
  const [customTable, setCustomTable] = useState<string>('');
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Auth protection for Waiter View
  useEffect(() => {
    if (!isWaiterAuthenticated) {
      router.replace('/waiter/login');
    }
  }, [isWaiterAuthenticated, router]);

  if (!isWaiterAuthenticated) {
    return null;
  }

  // 20 Physical Tables
  const physicalTables = Array.from({ length: 20 }, (_, i) => `Table ${i + 1}`);

  const categories: { id: CategoryType; labelEn: string; labelAm: string }[] = [
    { id: 'all', labelEn: 'All Menu', labelAm: 'ሁሉም' },
    { id: 'burgers', labelEn: 'Burgers', labelAm: 'በርገሮች' },
    { id: 'sides', labelEn: 'Sides', labelAm: 'ጎንዮሽ' },
    { id: 'combos', labelEn: 'Combos', labelAm: 'ኮምቦዎች' },
    { id: 'beverages', labelEn: 'Drinks', labelAm: 'ለስላሳ' },
  ];

  const filteredItems = menuItems.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const addToDraft = (item: MenuItem) => {
    setDraftCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateDraftQuantity = (itemId: string, delta: number) => {
    setDraftCart((prev) =>
      prev
        .map((c) => {
          if (c.menuItem.id === itemId) {
            const newQty = c.quantity + delta;
            return newQty > 0 ? { ...c, quantity: newQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearDraft = () => {
    setDraftCart([]);
    setIsDrawerOpen(false);
  };

  const totalDraftCount = draftCart.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = draftCart.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0);
  const tax = subtotal * 0.08;
  const grandTotal = subtotal + tax;

  const handleConfirmTableOrder = (tableNum: string) => {
    if (draftCart.length === 0) return;
    submitWaiterOrder(tableNum, draftCart, waiterUser?.name);
    clearDraft();
    setIsTableModalOpen(false);
    setCustomTable('');
  };

  const handleCustomTableSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customTable.trim() || draftCart.length === 0) return;
    handleConfirmTableOrder(customTable.trim());
  };

  return (
    <div className={`min-h-screen flex flex-col pb-28 transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-slate-50 text-slate-900'
    }`}>
      {/* Top Header Bar */}
      <div className={`sticky top-0 z-20 px-4 py-3 border-b backdrop-blur-md ${
        isDark ? 'bg-zinc-950/90 border-zinc-800' : 'bg-white/90 border-slate-200 shadow-2xs'
      }`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-700 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-black text-sm text-red-600 dark:text-red-500 leading-none">
                  WAITER MENU
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-800 text-zinc-300">
                  {waiterUser?.name || 'Staff'}
                </span>
              </div>
              <p className={`text-[10px] font-medium mt-0.5 ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Select menu items, then choose table
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={waiterLogout}
            className="p-2 rounded-xl border border-zinc-800 text-zinc-400 hover:text-red-400 cursor-pointer"
            title="Logout Waiter"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Category Pills (Horizontal Scroll) */}
        <div className="mt-3 flex items-center space-x-2 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-red-700 text-white shadow-xs'
                    : isDark
                    ? 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {language === 'am' ? cat.labelAm : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* STEP 1: INITIAL STATE - FOOD MENU GRID */}
      <div className="p-4 max-w-lg mx-auto w-full space-y-3">
        {filteredItems.map((item) => {
          const inCart = draftCart.find((c) => c.menuItem.id === item.id);
          const quantity = inCart ? inCart.quantity : 0;

          return (
            <div
              key={item.id}
              className={`p-3.5 rounded-2xl border flex items-center justify-between space-x-3 transition-all ${
                isDark
                  ? 'bg-zinc-900/90 border-zinc-800 hover:border-zinc-700'
                  : 'bg-white border-slate-200 shadow-sm hover:border-slate-300'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <img
                  src={item.image}
                  alt={item.nameEn}
                  className="w-14 h-14 rounded-xl object-cover shrink-0 bg-slate-800 border border-slate-700/40"
                />
                <div className="min-w-0">
                  <h3 className="font-bold text-xs truncate">
                    {language === 'am' ? item.nameAm : item.nameEn}
                  </h3>
                  <p className="text-xs font-extrabold text-red-600 dark:text-red-400 mt-0.5">
                    {t.formatMoney(item.price)}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {quantity === 0 ? (
                  <button
                    type="button"
                    onClick={() => addToDraft(item)}
                    className="px-3.5 py-1.5 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs shadow-2xs flex items-center space-x-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-1.5 bg-red-600/10 p-1 rounded-xl border border-red-600/30">
                    <button
                      type="button"
                      onClick={() => updateDraftQuantity(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-5 text-center text-xs font-black text-red-600 dark:text-red-400">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateDraftQuantity(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-red-700 text-white flex items-center justify-center font-bold cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart & Submit Order Action Bar */}
      <div className="fixed bottom-0 inset-x-0 z-30 p-4 max-w-lg mx-auto">
        {/* Slide-Up Drawer Details */}
        {isDrawerOpen && totalDraftCount > 0 && (
          <div className={`mb-3 p-4 rounded-2xl border shadow-2xl space-y-3 animate-fade-in ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-700/30">
              <div className="flex items-center space-x-2">
                <ShoppingBag className="w-4 h-4 text-red-500" />
                <span className="font-bold text-xs uppercase tracking-wider">{t.draftOrder}</span>
              </div>
              <button
                type="button"
                onClick={clearDraft}
                className="text-xs text-red-500 hover:underline flex items-center space-x-1 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{t.clearCart}</span>
              </button>
            </div>

            <div className="max-h-44 overflow-y-auto space-y-2 pr-1">
              {draftCart.map((item) => (
                <div key={item.menuItem.id} className="flex justify-between items-center text-xs">
                  <span className="font-semibold truncate max-w-[180px]">
                    {language === 'am' ? item.menuItem.nameAm : item.menuItem.nameEn}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1">
                      <button
                        type="button"
                        onClick={() => updateDraftQuantity(item.menuItem.id, -1)}
                        className="w-5 h-5 rounded bg-zinc-800 text-white flex items-center justify-center font-bold cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-4 text-center font-bold">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateDraftQuantity(item.menuItem.id, 1)}
                        className="w-5 h-5 rounded bg-zinc-800 text-white flex items-center justify-center font-bold cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-red-600 dark:text-red-400 w-16 text-right">
                      {t.formatMoney(item.menuItem.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-zinc-700/30 text-xs space-y-1 font-bold">
              <div className="flex justify-between">
                <span>{t.grandTotal}</span>
                <span className="text-emerald-500">{t.formatMoney(grandTotal)}</span>
              </div>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-white shadow-2xl flex items-center justify-between">
          <button
            type="button"
            onClick={() => setIsDrawerOpen((prev) => !prev)}
            disabled={totalDraftCount === 0}
            className="flex items-center space-x-3 text-left cursor-pointer disabled:opacity-40"
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-red-700 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </div>
              {totalDraftCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-2 py-0.5 rounded-full bg-amber-500 text-zinc-950 font-black text-[10px]">
                  {totalDraftCount}
                </span>
              )}
            </div>

            <div>
              <p className="text-xs font-bold flex items-center space-x-1">
                <span>Draft Order ({totalDraftCount})</span>
                {totalDraftCount > 0 && (isDrawerOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />)}
              </p>
              <p className="text-xs font-extrabold text-emerald-400">
                {t.formatMoney(grandTotal)}
              </p>
            </div>
          </button>

          {/* STEP 2: PLACE ORDER BUTTON (Disabled when cart empty) */}
          <button
            type="button"
            disabled={totalDraftCount === 0}
            onClick={() => setIsTableModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-black text-xs shadow-md flex items-center space-x-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
            <span>Submit Order</span>
          </button>
        </div>
      </div>

      {/* STEP 3: TABLE SELECTION MODAL */}
      {isTableModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto ${
            isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-zinc-700/30">
              <div>
                <h2 className="font-black text-base tracking-tight">{t.selectTable}</h2>
                <p className="text-xs text-zinc-400">
                  Select table for {totalDraftCount} items ({t.formatMoney(grandTotal)})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsTableModalOpen(false)}
                className="p-1.5 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-400 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 1–20 Table Grid */}
            <div className="grid grid-cols-4 gap-2.5">
              {physicalTables.map((tbl) => {
                const activeOrder = activeOrders.find(
                  (o) => o.tableNumber.toLowerCase() === tbl.toLowerCase() && o.status !== 'paid'
                );
                const isOccupied = !!activeOrder;

                return (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => handleConfirmTableOrder(tbl)}
                    className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 cursor-pointer ${
                      isOccupied
                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500 hover:bg-amber-500/20'
                        : isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-200 hover:bg-zinc-800'
                        : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-black text-xs">{tbl}</span>
                    {isOccupied ? (
                      <span className="px-1 py-0.5 rounded text-[8px] font-extrabold bg-amber-500 text-zinc-950">
                        Append Tab
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold text-emerald-500">
                        Free
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Custom Table Input */}
            <form onSubmit={handleCustomTableSubmit} className="pt-2 border-t border-zinc-700/30 space-y-2">
              <label className="block text-xs font-bold text-zinc-300">
                Custom Table / Ad-hoc Seating
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={customTable}
                  onChange={(e) => setCustomTable(e.target.value)}
                  placeholder={t.customTablePlaceholder}
                  className={`flex-1 px-3 py-2 text-xs rounded-xl border font-medium focus:outline-none focus:ring-2 focus:ring-red-600 ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  type="submit"
                  disabled={!customTable.trim()}
                  className="px-4 py-2 rounded-xl bg-red-700 hover:bg-red-800 text-white font-bold text-xs disabled:opacity-40 cursor-pointer"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
