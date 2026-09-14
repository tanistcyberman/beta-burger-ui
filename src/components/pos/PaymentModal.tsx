'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Banknote, CreditCard, Sparkles, Building2, User, Clock, Hash, AlertCircle } from 'lucide-react';
import { ActiveOrder, BankDetails } from '../../types';
import { useApp } from '../../context/AppContext';

interface PaymentModalProps {
  order: ActiveOrder;
  onClose: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ order, onClose }) => {
  const { checkoutOrder, theme, t, language } = useApp();
  const isDark = theme === 'dark';

  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer'>('cash');
  const [bankTxnId, setBankTxnId] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifiedReceipt, setVerifiedReceipt] = useState<BankDetails | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Bank Transfer Verification Simulation
  const handleVerifyBankTransfer = () => {
    if (!bankTxnId.trim()) {
      setErrorMsg(language === 'am' ? 'እባክዎን የመለያ ቁጥር ያስገቡ' : 'Please enter a transaction ID');
      return;
    }

    setErrorMsg(null);
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);

      const mockBanks = ['Commercial Bank of Ethiopia (CBE)', 'Telebirr Mobile Money', 'Dashen Bank', 'Bank of Abyssinia'];
      const mockNames = ['Abebe Bikila', 'Tigist Assefa', 'Kenenisa Bekele', 'Haile Gebrselassie', 'Meron Tesfaye'];
      const randomBank = mockBanks[Math.floor(Math.random() * mockBanks.length)];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      const cleanRef = bankTxnId.trim().toUpperCase();

      const receipt: BankDetails = {
        bankName: randomBank,
        referenceId: cleanRef,
        payerName: randomName,
        payerAccount: '1000****' + Math.floor(1000 + Math.random() * 9000),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        amount: order.grandTotal,
        status: 'CONFIRMED',
      };

      setVerifiedReceipt(receipt);
    }, 1800);
  };

  const handleAutoFillDemo = () => {
    setBankTxnId(`TXN-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setErrorMsg(null);
  };

  const handleFinalizePayment = () => {
    if (paymentMethod === 'bank_transfer' && !verifiedReceipt) {
      setErrorMsg(language === 'am' ? 'እባክዎን ከማጠናቀቅዎ በፊት የባንክ ክፍያውን ያረጋግጡ!' : 'Please verify the bank transfer before completing payment!');
      return;
    }

    checkoutOrder(order.id, paymentMethod, verifiedReceipt || undefined);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl overflow-hidden flex flex-col max-h-[90vh] ${
          isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-slate-200 text-slate-900'
        }`}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-bold text-base text-slate-900 dark:text-zinc-100">{t.checkoutTitle}</h2>
                <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-red-600 text-white">
                  {order.tableNumber}
                </span>
              </div>
              <p className={`text-xs ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
                Order {order.orderNumber} • {order.items.length} items
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isDark ? 'border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Order Items Summary */}
          <div className={`p-4 rounded-xl border space-y-2 text-xs ${isDark ? 'bg-zinc-950/50 border-zinc-800' : 'bg-slate-50 border-slate-200'}`}>
            <p className="font-bold text-xs uppercase tracking-wider text-red-600 dark:text-red-500 mb-2">{t.currentOrder}</p>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1 border-b border-dashed border-zinc-700/30 last:border-0">
                <span className="font-medium">{item.quantity}x {language === 'am' ? item.menuItem.nameAm : item.menuItem.nameEn}</span>
                <span className="font-bold">{t.formatMoney(item.menuItem.price * item.quantity)}</span>
              </div>
            ))}
            <div className="pt-2 border-t flex justify-between items-center text-sm font-black">
              <span>{t.grandTotal}</span>
              <span className="text-emerald-600 dark:text-emerald-400">{t.formatMoney(order.grandTotal)}</span>
            </div>
          </div>

          {/* Payment Channel Selector */}
          <div>
            <label className={`block text-xs font-bold mb-2 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
              {t.paymentChannel}
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('cash');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'cash'
                    ? 'bg-red-700 text-white border-red-700 shadow-md'
                    : isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>{t.cash}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPaymentMethod('bank_transfer');
                  setErrorMsg(null);
                }}
                className={`p-3.5 rounded-xl border flex items-center space-x-3 text-xs font-bold transition-all cursor-pointer ${
                  paymentMethod === 'bank_transfer'
                    ? 'bg-red-700 text-white border-red-700 shadow-md'
                    : isDark
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <span>{t.bankTransfer}</span>
              </button>
            </div>
          </div>

          {/* Bank Transfer Fraud Verification Section */}
          {paymentMethod === 'bank_transfer' && (
            <div className={`p-4 rounded-xl border space-y-3 animate-fade-in ${
              isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-slate-50 border-slate-200'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-500 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Bank Verification Engine</span>
                </span>
                <button
                  type="button"
                  onClick={handleAutoFillDemo}
                  className="text-[11px] font-semibold text-red-600 dark:text-red-400 hover:underline cursor-pointer"
                >
                  {t.autoFillDemo}
                </button>
              </div>

              {!verifiedReceipt ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={bankTxnId}
                    onChange={(e) => {
                      setBankTxnId(e.target.value);
                      if (errorMsg) setErrorMsg(null);
                    }}
                    placeholder={t.enterTxnId}
                    className={`w-full px-3.5 py-2.5 text-xs rounded-xl border font-mono focus:outline-none focus:ring-2 focus:ring-red-600 ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100 placeholder-zinc-500' : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400'
                    }`}
                  />

                  <button
                    type="button"
                    onClick={handleVerifyBankTransfer}
                    disabled={isVerifying}
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center justify-center space-x-2 transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isVerifying ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>{t.verifyingState}</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{t.verifyTransaction}</span>
                      </>
                    )}
                  </button>
                </div>
              ) : (
                /* Verified Receipt Display */
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-2 animate-fade-in">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>{t.verifiedSuccess}</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-black bg-emerald-600 text-white">
                      CONFIRMED
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px]">
                    <div>
                      <p className="text-slate-700 dark:text-zinc-400 font-semibold">{t.bankName}</p>
                      <p className="font-bold text-slate-900 dark:text-zinc-100">{verifiedReceipt.bankName}</p>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-zinc-400 font-semibold">{t.referenceId}</p>
                      <p className="font-mono font-bold text-red-600 dark:text-red-400">{verifiedReceipt.referenceId}</p>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-zinc-400 font-semibold">{t.payerAccount}</p>
                      <p className="font-bold text-slate-900 dark:text-zinc-100">{verifiedReceipt.payerName} ({verifiedReceipt.payerAccount})</p>
                    </div>
                    <div>
                      <p className="text-slate-700 dark:text-zinc-400 font-semibold">{t.verifiedAmount}</p>
                      <p className="font-bold text-emerald-600 dark:text-emerald-400">{t.formatMoney(verifiedReceipt.amount)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Error Banner */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-semibold flex items-center space-x-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer Action Button */}
        <div className={`p-4 border-t flex items-center justify-between ${isDark ? 'border-zinc-800 bg-zinc-950/50' : 'border-slate-200 bg-slate-50'}`}>
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark ? 'border-zinc-800 text-zinc-300 hover:bg-zinc-800' : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {t.cancel}
          </button>

          <button
            type="button"
            onClick={handleFinalizePayment}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-xs shadow-xs flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.finalizePayment}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
