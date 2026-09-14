'use client';

import React from 'react';
import { ShieldCheck, Loader2, CheckCircle2, RefreshCw, Landmark } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const TransferVerificationUI: React.FC = () => {
  const {
    bankTxnId,
    setBankTxnId,
    isVerifying,
    verificationStep,
    verifiedReceipt,
    verifyBankTransfer,
    resetVerification,
    grandTotal,
    theme,
    t,
  } = useApp();

  const isDark = theme === 'dark';

  const handleGenerateSampleId = () => {
    const samples = ['FT262991045A', 'TLB-98421045', 'CBE-88491023', 'ABY-77391024'];
    const sample = samples[Math.floor(Math.random() * samples.length)];
    setBankTxnId(sample);
  };

  return (
    <div
      className={`rounded-xl p-4 border space-y-3 transition-colors ${
        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-slate-50 text-slate-900 border-slate-200'
      }`}
    >
      <div className={`flex items-center justify-between pb-2.5 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <div className="flex items-center space-x-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-bold text-xs">{t.posTitle}</h4>
            <p className={`text-[10px] font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Fraud Prevention Enabled</p>
          </div>
        </div>

        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
          API Ready
        </span>
      </div>

      {!verifiedReceipt && (
        <div className="space-y-2.5">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className={`block text-[11px] font-semibold ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                {t.enterTxnId} <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateSampleId}
                className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                {t.autoFillDemo}
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="e.g. FT26255X8910 or TLB-984210"
                value={bankTxnId}
                onChange={(e) => setBankTxnId(e.target.value)}
                disabled={isVerifying}
                className={`w-full pl-3 pr-9 py-2 border rounded-lg text-xs font-mono font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-600 ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-indigo-300 placeholder-zinc-500'
                    : 'bg-white border-slate-200 text-indigo-700 placeholder-slate-400'
                }`}
              />
              <Landmark className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isVerifying && (
            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-900 dark:text-indigo-200 flex items-center space-x-2.5 text-xs">
              <Loader2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-spin shrink-0" />
              <div>
                <p className="font-bold">Verifying Transaction...</p>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-300">{verificationStep}</p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={verifyBankTransfer}
            disabled={isVerifying || !bankTxnId.trim() || grandTotal === 0}
            className={`w-full py-2.5 px-3 rounded-lg font-bold text-xs transition-colors flex items-center justify-center space-x-2 ${
              isVerifying || !bankTxnId.trim() || grandTotal === 0
                ? 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-600 cursor-not-allowed border border-slate-200 dark:border-zinc-700'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
            }`}
          >
            {isVerifying ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>{t.verifyingState}</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{t.verifyTransaction}</span>
              </>
            )}
          </button>
        </div>
      )}

      {verifiedReceipt && (
        <div className="space-y-2.5 animate-fade-in">
          <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-xs">{t.verifiedSuccess}</p>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-300 font-medium">Bank gateway matched exact total.</p>
              </div>
            </div>
            <button
              onClick={resetVerification}
              className="text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white p-1 rounded transition-colors flex items-center space-x-1"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>

          <div className={`rounded-lg p-3 border space-y-2 text-xs ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'}`}>
            <div className={`flex items-center justify-between border-b pb-1.5 ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>{t.officialReceipt}</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                ● {verifiedReceipt.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 text-xs font-medium">
              <div>
                <span className="text-[10px] text-slate-700 dark:text-zinc-400 font-semibold block">{t.bankName}:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{verifiedReceipt.bankName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-700 dark:text-zinc-400 font-semibold block">{t.payerAccount}:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{verifiedReceipt.payerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-700 dark:text-zinc-400 font-semibold block">{t.referenceId}:</span>
                <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{verifiedReceipt.referenceId}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-700 dark:text-zinc-400 font-semibold block">{t.verifiedTime}:</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{verifiedReceipt.timestamp}</span>
              </div>
            </div>

            <div className={`pt-2 border-t flex items-baseline justify-between ${isDark ? 'border-zinc-800' : 'border-slate-100'}`}>
              <span className="text-xs font-bold">{t.verifiedAmount}:</span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{t.formatMoney(verifiedReceipt.amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
