'use client';

import React from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Toast: React.FC = () => {
  const { toastMessage, setToastMessage } = useApp();

  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
      <div className="bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-800 flex items-center space-x-3 max-w-md">
        <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-4 h-4" />
        </div>
        <div className="flex-1 text-xs font-medium leading-relaxed pr-2">
          {toastMessage}
        </div>
        <button
          onClick={() => setToastMessage(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
