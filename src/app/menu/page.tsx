'use client';

import React, { useState, useMemo } from 'react';
import { INITIAL_MENU_ITEMS } from '../../data/mockData';
import { CategoryType, MenuItem } from '../../types';
import { UtensilsCrossed, Flame, Sparkles, Search, Grid, ListFilter, ArrowUp, X } from 'lucide-react';

const CATEGORIES: { id: CategoryType; labelEn: string; labelAm: string }[] = [
  { id: 'all', labelEn: 'All Items', labelAm: 'ሁሉም' },
  { id: 'burgers', labelEn: 'Burgers', labelAm: 'በርገሮች' },
  { id: 'combos', labelEn: 'Combos', labelAm: 'ኮምቦዎች' },
  { id: 'sides', labelEn: 'Sides', labelAm: 'ሳይዶች' },
  { id: 'beverages', labelEn: 'Drinks', labelAm: 'መጠጦች' },
];

export default function PublicMenuPage() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'compact'>('grid');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return INITIAL_MENU_ITEMS.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        !searchQuery.trim() ||
        item.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nameAm.includes(searchQuery) ||
        item.descriptionEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.descriptionAm.includes(searchQuery);

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle scroll listener for back to top button on mobile
  React.useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-red-500 selection:text-white">
      {/* Top Banner & Mobile Sticky Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        {/* Brand Bar */}
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-red-700 flex items-center justify-center text-white shadow-md shadow-red-700/20 shrink-0">
              <UtensilsCrossed className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900 leading-tight">
                BETA BURGER MENU
              </h1>
              <p className="text-[10px] sm:text-xs font-semibold text-slate-500 tracking-wide">
                FRESH GOURMET BURGERS • ADDIS ABABA
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full bg-red-50 border border-red-100 text-red-700 text-[11px] font-bold">
              <Flame className="w-3 h-3 text-red-600 shrink-0" />
              <span className="hidden xs:inline">Public Customer Menu</span>
              <span className="xs:hidden">Menu</span>
            </div>

            {/* View Switcher (Grid vs Compact List on Mobile) */}
            <div className="hidden xs:flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  viewMode === 'compact' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
                }`}
                title="Compact List View"
              >
                <ListFilter className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Search Input Bar for Mobile & Desktop */}
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 pt-1 pb-2.5">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search burgers, drinks, sides... (የምግብ ስም ይፈልጉ)"
              className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-slate-100/80 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-600 transition-colors font-medium placeholder-slate-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category Navigation Horizontal Touch Carousel */}
        <div className="max-w-6xl mx-auto px-3.5 sm:px-6 pb-2.5 pt-0.5 overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center space-x-2 min-w-max pb-0.5">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              const count =
                cat.id === 'all'
                  ? INITIAL_MENU_ITEMS.length
                  : INITIAL_MENU_ITEMS.filter((i) => i.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-red-700 text-white shadow-sm shadow-red-700/30'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <span>{cat.labelEn}</span>
                  <span className={`text-[10px] font-normal ${isActive ? 'text-red-100' : 'text-slate-500'}`}>
                    ({cat.labelAm})
                  </span>
                  <span
                    className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm sm:text-base font-bold text-slate-800 flex items-center space-x-2">
            <span>
              {selectedCategory === 'all'
                ? 'All Menu Items'
                : CATEGORIES.find((c) => c.id === selectedCategory)?.labelEn}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
              {filteredItems.length}
            </span>
          </h2>
          <span className="text-[11px] text-slate-500 font-medium">Read-Only Price Catalog</span>
        </div>

        {/* Empty Search State */}
        {filteredItems.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center my-6">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm">No items found</h3>
            <p className="text-xs text-slate-500 mt-1">
              Try searching with different keywords or switch categories.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-4 px-4 py-2 bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs hover:bg-red-800 transition-colors"
            >
              Reset Search & Filters
            </button>
          </div>
        )}

        {/* GRID VIEW (Default Mobile & Desktop) */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {filteredItems.map((item: MenuItem) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
              >
                {/* Image Container */}
                <div className="relative w-full h-36 xs:h-40 sm:h-48 bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {item.popular && (
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-amber-500 text-white text-[9px] xs:text-[10px] font-black tracking-wide uppercase shadow-sm flex items-center space-x-1">
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>POPULAR</span>
                    </div>
                  )}
                  <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded-lg bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold tracking-wide">
                    {item.category.toUpperCase()}
                  </div>
                </div>

                {/* Read-Only Item Info */}
                <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-xs xs:text-sm sm:text-base leading-snug">
                      {item.nameEn}
                    </h3>
                    <p className="text-[11px] xs:text-xs font-bold text-red-700 mt-0.5">
                      {item.nameAm}
                    </p>

                    <p className="text-[11px] xs:text-xs text-slate-600 font-normal line-clamp-2 mt-1.5 leading-relaxed">
                      {item.descriptionEn}
                    </p>
                    <p className="text-[10px] text-slate-500 font-normal line-clamp-1 mt-0.5">
                      {item.descriptionAm}
                    </p>
                  </div>

                  {/* Read-Only Price Tag (No buttons or inputs) */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                      Price
                    </span>
                    <span className="text-sm xs:text-base sm:text-lg font-black text-slate-900 font-mono">
                      {item.price} <span className="text-xs font-bold text-red-700">ETB</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* COMPACT LIST VIEW (Optimized for fast mobile scrolling) */}
        {viewMode === 'compact' && (
          <div className="space-y-2.5">
            {filteredItems.map((item: MenuItem) => (
              <div
                key={item.id}
                className="bg-white border border-slate-200/90 rounded-xl p-2.5 sm:p-3 shadow-2xs flex items-center space-x-3"
              >
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-lg bg-slate-100 overflow-hidden shrink-0">
                  <img
                    src={item.image}
                    alt={item.nameEn}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {item.popular && (
                    <div className="absolute top-1 right-1 p-1 bg-amber-500 text-white rounded-full">
                      <Sparkles className="w-2.5 h-2.5" />
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-1">
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm truncate">
                      {item.nameEn}
                    </h3>
                    <span className="text-xs sm:text-sm font-black text-slate-900 font-mono shrink-0">
                      {item.price} <span className="text-[10px] font-bold text-red-700">ETB</span>
                    </span>
                  </div>
                  <p className="text-[11px] font-semibold text-red-700 truncate">{item.nameAm}</p>
                  <p className="text-[10px] sm:text-xs text-slate-500 truncate mt-0.5">
                    {item.descriptionEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Mobile Back to Top Floating Button */}
      {showScrollTop && (
        <button
          type="button"
          onClick={scrollToTop}
          className="fixed bottom-5 right-5 z-40 p-3 rounded-full bg-red-700 text-white shadow-lg shadow-red-900/40 hover:bg-red-800 transition-all transform active:scale-95"
          aria-label="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-5 text-center text-xs font-medium text-slate-500 mt-6">
        <div className="max-w-6xl mx-auto px-4">
          <p>© 2026 BETA BURGER • Public Mobile Menu Catalog</p>
          <p className="text-[10px] text-slate-400 mt-0.5">
            Addis Ababa, Ethiopia • Delicious Quality Guaranteed
          </p>
        </div>
      </footer>
    </div>
  );
}
