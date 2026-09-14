'use client';

import React from 'react';
import { Plus, Flame } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CategoryType } from '../../types';

export const MenuGrid: React.FC = () => {
  const { menuItems, addToCart, activeCategory, setActiveCategory, searchQuery, cart, theme, language, t } = useApp();
  const isDark = theme === 'dark';
  const isAm = language === 'am';

  const categories: { id: CategoryType; label: string; icon: string }[] = [
    { id: 'all', label: t.allMenu, icon: '🍔' },
    { id: 'burgers', label: t.burgers, icon: '🍔' },
    { id: 'sides', label: t.sides, icon: '🍟' },
    { id: 'combos', label: t.combos, icon: '🥤' },
    { id: 'beverages', label: t.beverages, icon: '🥤' },
  ];

  const filteredItems = menuItems.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const name = isAm ? item.nameAm : item.nameEn;
    const desc = isAm ? item.descriptionAm : item.descriptionEn;
    const matchesSearch =
      name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Category Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
                isActive
                  ? 'bg-red-700 text-white shadow-2xs'
                  : isDark
                  ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800 border border-zinc-800'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Menu Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const inCartCount = cart.find((c) => c.menuItem.id === item.id)?.quantity || 0;
          const itemName = isAm ? item.nameAm : item.nameEn;
          const itemDesc = isAm ? item.descriptionAm : item.descriptionEn;

          return (
            <div
              key={item.id}
              onClick={() => addToCart(item)}
              className={`rounded-xl p-3.5 border transition-colors cursor-pointer relative flex flex-col justify-between group ${
                isDark
                  ? inCartCount > 0
                    ? 'bg-zinc-900 border-red-600/70 ring-1 ring-red-600/30'
                    : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                  : inCartCount > 0
                  ? 'bg-white border-red-500 ring-1 ring-red-500/20 shadow-sm'
                  : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
              }`}
            >
              {item.popular && (
                <span className="absolute top-2.5 left-2.5 z-10 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-red-100 text-red-700 dark:bg-red-950/80 dark:text-red-300 border border-red-200 dark:border-red-900/50 flex items-center space-x-1">
                  <Flame className="w-3 h-3 text-red-600 dark:text-red-400 inline" />
                  <span>{t.popular}</span>
                </span>
              )}

              {inCartCount > 0 && (
                <span className="absolute top-2.5 right-2.5 z-10 w-5 h-5 rounded-full bg-red-700 text-white font-bold text-[11px] flex items-center justify-center shadow-2xs">
                  {inCartCount}
                </span>
              )}

              <div className="h-28 w-full rounded-lg overflow-hidden bg-slate-100 dark:bg-zinc-800 mb-3 relative">
                <img
                  src={item.image}
                  alt={itemName}
                  className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-102"
                />
              </div>

              <div>
                <h4 className={`font-bold text-xs leading-snug transition-colors ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                  {itemName}
                </h4>
                <p className={`text-[11px] font-medium line-clamp-2 mt-1 leading-relaxed ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                  {itemDesc}
                </p>
              </div>

              <div className={`mt-3 pt-2.5 border-t flex items-center justify-between ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
                <div>
                  <span className={`text-sm font-bold ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                    {t.formatMoney(item.price)}
                  </span>
                </div>

                <button
                  type="button"
                  className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                    inCartCount > 0
                      ? 'bg-red-700 text-white hover:bg-red-800'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
