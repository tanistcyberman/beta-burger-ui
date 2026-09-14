'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { MenuItem, CartItem, Transaction, DailyRevenue, BankDetails, CategoryType, ActiveOrder, WaiterUser } from '../types';
import { INITIAL_MENU_ITEMS, INITIAL_TRANSACTIONS, INITIAL_WEEKLY_REVENUE, INITIAL_ACTIVE_ORDERS, DEFAULT_WAITERS } from '../data/mockData';
import { translations, Language, getCategoryTranslation } from '../translations';

interface AppContextType {
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;

  waiterUser: WaiterUser | null;
  isWaiterAuthenticated: boolean;
  waiterLogin: (username: string, pin: string) => boolean;
  waiterLogout: () => void;

  activeOrders: ActiveOrder[];
  submitWaiterOrder: (tableNumber: string, items: CartItem[], waiterName?: string) => void;
  markOrderServed: (orderId: string) => void;
  checkoutOrder: (orderId: string, paymentMethod: 'cash' | 'bank_transfer', bankDetails?: BankDetails) => void;
  removeOrderItem: (orderId: string, itemIndex: number) => void;
  cancelEntireOrder: (orderId: string) => void;

  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['en'];
  
  theme: 'dark' | 'light';
  toggleTheme: () => void;

  menuItems: MenuItem[];
  cart: CartItem[];
  addToCart: (item: MenuItem) => void;
  updateQuantity: (itemId: string, delta: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  
  paymentMethod: 'cash' | 'bank_transfer';
  setPaymentMethod: (method: 'cash' | 'bank_transfer') => void;
  
  bankTxnId: string;
  setBankTxnId: (id: string) => void;
  isVerifying: boolean;
  verificationStep: string;
  verifiedReceipt: BankDetails | null;
  verifyBankTransfer: () => Promise<boolean>;
  resetVerification: () => void;
  
  completeSale: () => void;
  
  transactions: Transaction[];
  addExpense: (expense: { description: string; amount: number; category: string; paymentMethod: 'cash' | 'bank_transfer' }) => void;
  
  weeklyRevenue: DailyRevenue[];
  
  activeCategory: CategoryType;
  setActiveCategory: (category: CategoryType) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  subtotal: number;
  tax: number;
  grandTotal: number;
  
  todayTotalRevenue: number;
  todayItemsSold: number;
  todayCashBalance: number;
  todayDigitalBalance: number;
  todayTotalExpenses: number;
  
  toastMessage: string | null;
  showToast: (msg: string) => void;
  setToastMessage: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TAX_RATE = 0.08;

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('beta_burger_auth');
      if (stored === 'true') {
        setIsAuthenticated(true);
      }
    } catch {
      // ignore SSR or localStorage access issues
    } finally {
      setIsAuthLoading(false);
    }
  }, []);

  const login = (user: string, pass: string): boolean => {
    const cleanUser = user.trim().toLowerCase();
    const cleanPass = pass.trim();
    if (cleanUser === 'biniyam worku aseffa' && cleanPass === 'beta_owner') {
      setIsAuthenticated(true);
      try {
        localStorage.setItem('beta_burger_auth', 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('beta_burger_auth');
    } catch {
      // ignore
    }
  };

  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const t = translations[language];

  const [menuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank_transfer'>('cash');
  
  const [bankTxnId, setBankTxnId] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [verifiedReceipt, setVerifiedReceipt] = useState<BankDetails | null>(null);
  
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [weeklyRevenue, setWeeklyRevenue] = useState<DailyRevenue[]>(INITIAL_WEEKLY_REVENUE);
  
  const [activeCategory, setActiveCategory] = useState<CategoryType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [waiterUser, setWaiterUser] = useState<WaiterUser | null>(null);
  const [isWaiterAuthenticated, setIsWaiterAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    try {
      const storedWaiter = localStorage.getItem('beta_waiter_auth');
      if (storedWaiter) {
        const parsed = JSON.parse(storedWaiter);
        setWaiterUser(parsed);
        setIsWaiterAuthenticated(true);
      }
    } catch {
      // ignore
    }
  }, []);

  const waiterLogin = (username: string, pin: string): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const found = DEFAULT_WAITERS.find(
      (w) => w.username.toLowerCase() === cleanUser || w.name.toLowerCase() === cleanUser
    );

    if (found && found.pin === pin.trim()) {
      setWaiterUser(found);
      setIsWaiterAuthenticated(true);
      try {
        localStorage.setItem('beta_waiter_auth', JSON.stringify(found));
      } catch {
        // ignore
      }
      return true;
    }

    if (cleanUser && pin.trim() === '1234') {
      const customWaiter: WaiterUser = {
        id: `w-${Date.now()}`,
        name: username.trim(),
        username: cleanUser,
        pin: '1234',
      };
      setWaiterUser(customWaiter);
      setIsWaiterAuthenticated(true);
      try {
        localStorage.setItem('beta_waiter_auth', JSON.stringify(customWaiter));
      } catch {
        // ignore
      }
      return true;
    }

    return false;
  };

  const waiterLogout = () => {
    setWaiterUser(null);
    setIsWaiterAuthenticated(false);
    try {
      localStorage.removeItem('beta_waiter_auth');
    } catch {
      // ignore
    }
  };

  const [activeOrders, setActiveOrders] = useState<ActiveOrder[]>(INITIAL_ACTIVE_ORDERS);

  // Submit Order from Waiter Mobile View (Appends if table order exists)
  const submitWaiterOrder = (tableNumber: string, items: CartItem[], waiterName?: string) => {
    if (items.length === 0) return;

    setActiveOrders((prev) => {
      const existingIndex = prev.findIndex(
        (o) => o.tableNumber.toLowerCase() === tableNumber.toLowerCase() && o.status !== 'paid'
      );

      if (existingIndex !== -1) {
        // MERGE / APPEND to existing table running tab
        const existingOrder = prev[existingIndex];
        const mergedCart: CartItem[] = [...existingOrder.items];

        items.forEach((newItem) => {
          const matchIdx = mergedCart.findIndex((c) => c.menuItem.id === newItem.menuItem.id);
          if (matchIdx !== -1) {
            mergedCart[matchIdx] = {
              ...mergedCart[matchIdx],
              quantity: mergedCart[matchIdx].quantity + newItem.quantity,
            };
          } else {
            mergedCart.push(newItem);
          }
        });

        const newSubtotal = mergedCart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
        const newTax = newSubtotal * TAX_RATE;
        const newGrandTotal = newSubtotal + newTax;

        const updatedOrder: ActiveOrder = {
          ...existingOrder,
          items: mergedCart,
          subtotal: parseFloat(newSubtotal.toFixed(2)),
          tax: parseFloat(newTax.toFixed(2)),
          grandTotal: parseFloat(newGrandTotal.toFixed(2)),
          waiterName: waiterName || existingOrder.waiterName || waiterUser?.name,
        };

        const nextOrders = [...prev];
        nextOrders[existingIndex] = updatedOrder;
        return nextOrders;
      } else {
        // CREATE new active order card for table
        const subtotal = items.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
        const tax = subtotal * TAX_RATE;
        const grandTotal = subtotal + tax;
        const orderNum = `#BB-${Math.floor(1054 + Math.random() * 8900)}`;

        const newOrder: ActiveOrder = {
          id: `ord-${Date.now()}`,
          orderNumber: orderNum,
          tableNumber,
          items: [...items],
          subtotal: parseFloat(subtotal.toFixed(2)),
          tax: parseFloat(tax.toFixed(2)),
          grandTotal: parseFloat(grandTotal.toFixed(2)),
          status: 'pending',
          createdAt: new Date().toISOString(),
          waiterName: waiterName || waiterUser?.name,
        };

        return [newOrder, ...prev];
      }
    });

    showToast(
      language === 'am'
        ? `አዲስ ምግቦች ለ${tableNumber} ተጨምረዋል!`
        : `Items added to ${tableNumber} running tab!`
    );
  };

  // Remove single line item from an active order
  const removeOrderItem = (orderId: string, itemIndex: number) => {
    setActiveOrders((prev) => {
      const target = prev.find((o) => o.id === orderId);
      if (!target) return prev;

      const updatedItems = target.items.filter((_, idx) => idx !== itemIndex);

      if (updatedItems.length === 0) {
        showToast(language === 'am' ? `ትዕዛዝ ${target.orderNumber} ተሰርዟል!` : `Order ${target.orderNumber} cancelled!`);
        return prev.filter((o) => o.id !== orderId);
      }

      const newSubtotal = updatedItems.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
      const newTax = newSubtotal * TAX_RATE;
      const newGrandTotal = newSubtotal + newTax;

      showToast(language === 'am' ? `ምግብ ከተዕዛዙ ተሰርዟል` : `Item removed from order`);

      return prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            items: updatedItems,
            subtotal: parseFloat(newSubtotal.toFixed(2)),
            tax: parseFloat(newTax.toFixed(2)),
            grandTotal: parseFloat(newGrandTotal.toFixed(2)),
          };
        }
        return o;
      });
    });
  };

  // Cancel entire order
  const cancelEntireOrder = (orderId: string) => {
    const target = activeOrders.find((o) => o.id === orderId);
    setActiveOrders((prev) => prev.filter((o) => o.id !== orderId));
    showToast(
      language === 'am'
        ? `ትዕዛዝ ${target?.orderNumber || ''} (${target?.tableNumber || ''}) ተሰርዟል!`
        : `Order ${target?.orderNumber || ''} (${target?.tableNumber || ''}) cancelled!`
    );
  };

  // Mark Order as Served (Move Column 1 -> Column 2)
  const markOrderServed = (orderId: string) => {
    setActiveOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          showToast(language === 'am' ? `ትዕዛዝ ${order.orderNumber} ተስተናግዷል!` : `Order ${order.orderNumber} marked as served!`);
          return {
            ...order,
            status: 'served',
            servedAt: new Date().toISOString(),
          };
        }
        return order;
      })
    );
  };

  // Checkout & Finalize Payment (Move Column 2 -> Column 3)
  const checkoutOrder = (
    orderId: string,
    method: 'cash' | 'bank_transfer',
    bankDetails?: BankDetails
  ) => {
    const targetOrder = activeOrders.find((o) => o.id === orderId);
    if (!targetOrder) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const itemsSummary = targetOrder.items
      .map((c) => `${c.quantity}x ${language === 'am' ? c.menuItem.nameAm : c.menuItem.nameEn}`)
      .join(', ');

    // 1. Create Transaction for Accounting Ledger
    const cleanOrderNum = targetOrder.orderNumber.replace('#BB-', '');
    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderNumber: cleanOrderNum,
      date: dateStr,
      time: timeStr,
      descriptionEn: `${targetOrder.tableNumber}: ${itemsSummary}`,
      descriptionAm: `${targetOrder.tableNumber}: ${itemsSummary}`,
      type: 'income',
      categoryEn: 'Sales',
      categoryAm: 'ሽያጭ',
      paymentMethod: method,
      amount: targetOrder.grandTotal,
      status: method === 'bank_transfer' ? 'verified' : 'completed',
      bankDetails,
    };

    setTransactions((prev) => [newTx, ...prev]);

    // 2. Update Weekly Revenue Breakdown
    setWeeklyRevenue((prev) =>
      prev.map((d) => {
        if (d.dayEn === 'Sat' || d.dayEn === 'Sun') {
          const newCash = method === 'cash' ? d.cash + targetOrder.grandTotal : d.cash;
          const newBank = method === 'bank_transfer' ? d.bankTransfer + targetOrder.grandTotal : d.bankTransfer;
          return {
            ...d,
            cash: parseFloat(newCash.toFixed(2)),
            bankTransfer: parseFloat(newBank.toFixed(2)),
            total: parseFloat((newCash + newBank).toFixed(2)),
          };
        }
        return d;
      })
    );

    // 3. Update Active Order Status to 'paid'
    setActiveOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          return {
            ...o,
            status: 'paid',
            paidAt: now.toISOString(),
            paymentMethod: method,
            bankDetails,
          };
        }
        return o;
      })
    );

    showToast(
      language === 'am'
        ? `ትዕዛዝ ${targetOrder.orderNumber} ክፍያ ተጠናቋል! (${t.formatMoney(targetOrder.grandTotal)})`
        : `Order ${targetOrder.orderNumber} payment finalized! (${t.formatMoney(targetOrder.grandTotal)})`
    );
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.menuItem.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.menuItem.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { menuItem: item, quantity: 1 }];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
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

  const removeFromCart = (itemId: string) => {
    setCart((prev) => prev.filter((c) => c.menuItem.id !== itemId));
  };

  const clearCart = () => {
    setCart([]);
    setVerifiedReceipt(null);
    setBankTxnId('');
  };

  // Cart financial totals
  const subtotal = cart.reduce((sum, item) => sum + item.menuItem.price * item.quantity, 0);
  const tax = subtotal * TAX_RATE;
  const grandTotal = subtotal + tax;

  // Verification process simulation
  const verifyBankTransfer = (): Promise<boolean> => {
    return new Promise((resolve) => {
      setIsVerifying(true);
      setVerificationStep(t.verifyingState);

      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStep('');
        
        const mockBanks = ['Commercial Bank of Ethiopia (CBE)', 'Telebirr Mobile Money', 'Dashen Bank', 'Bank of Abyssinia'];
        const mockNames = ['Abebe Bikila', 'Tigist Assefa', 'Kenenisa Bekele', 'Haile Gebrselassie', 'Meron Tesfaye'];
        const randomBank = mockBanks[Math.floor(Math.random() * mockBanks.length)];
        const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
        const cleanRef = bankTxnId.trim() || `TXN-${Math.floor(10000000 + Math.random() * 90000000)}`;

        const receipt: BankDetails = {
          bankName: randomBank,
          referenceId: cleanRef.toUpperCase(),
          payerName: randomName,
          payerAccount: '1000****' + Math.floor(1000 + Math.random() * 9000),
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          amount: parseFloat(grandTotal.toFixed(2)),
          status: 'CONFIRMED',
        };

        setVerifiedReceipt(receipt);
        showToast(t.verifiedSuccess);
        resolve(true);
      }, 2000);
    });
  };

  const resetVerification = () => {
    setVerifiedReceipt(null);
    setBankTxnId('');
  };

  // Complete Order
  const completeSale = () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'bank_transfer' && !verifiedReceipt) {
      showToast(language === 'am' ? 'እባክዎን ከማጠናቀቅዎ በፊት የባንክ ክፍያውን ያረጋግጡ!' : 'Please verify bank transfer transaction before completing order!');
      return;
    }

    const orderNum = `#BB-${Math.floor(1050 + Math.random() * 9000)}`;
    const itemsSummary = cart.map((c) => `${c.quantity}x ${language === 'am' ? c.menuItem.nameAm : c.menuItem.nameEn}`).join(', ');
    const totalAmount = parseFloat(grandTotal.toFixed(2));
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      orderNumber: orderNum,
      date: dateStr,
      time: timeStr,
      descriptionEn: `Order ${orderNum} (${itemsSummary})`,
      descriptionAm: `ትዕዛዝ ${orderNum} (${itemsSummary})`,
      type: 'income',
      categoryEn: 'Sales',
      categoryAm: 'ሽያጭ',
      paymentMethod,
      amount: totalAmount,
      status: paymentMethod === 'bank_transfer' ? 'verified' : 'completed',
      bankDetails: verifiedReceipt || undefined,
    };

    setTransactions((prev) => [newTx, ...prev]);

    setWeeklyRevenue((prev) =>
      prev.map((d) => {
        if (d.dayEn === 'Sat') {
          const newCash = paymentMethod === 'cash' ? d.cash + totalAmount : d.cash;
          const newBank = paymentMethod === 'bank_transfer' ? d.bankTransfer + totalAmount : d.bankTransfer;
          return {
            ...d,
            cash: parseFloat(newCash.toFixed(2)),
            bankTransfer: parseFloat(newBank.toFixed(2)),
            total: parseFloat((newCash + newBank).toFixed(2)),
          };
        }
        return d;
      })
    );

    showToast(`${language === 'am' ? 'ትዕዛዝ' : 'Order'} ${orderNum} ${language === 'am' ? 'ተጠናቅቋል!' : 'completed!'} (${t.formatMoney(totalAmount)})`);
    clearCart();
  };

  // Record Expense
  const addExpense = (expense: { description: string; amount: number; category: string; paymentMethod: 'cash' | 'bank_transfer' }) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toISOString().split('T')[0];

    const newTx: Transaction = {
      id: `exp-${Date.now()}`,
      orderNumber: `EXP-${Math.floor(802 + Math.random() * 100)}`,
      date: dateStr,
      time: timeStr,
      descriptionEn: expense.description,
      descriptionAm: expense.description,
      type: 'expense',
      categoryEn: getCategoryTranslation(expense.category, 'en'),
      categoryAm: getCategoryTranslation(expense.category, 'am'),
      paymentMethod: expense.paymentMethod,
      amount: parseFloat(expense.amount.toFixed(2)),
      status: 'completed',
    };

    setTransactions((prev) => [newTx, ...prev]);
    showToast(`${language === 'am' ? 'ወጪ ተመዝግቧል:' : 'Expense recorded:'} $${expense.amount.toFixed(2)}`);
  };

  // Dashboard Aggregates (Today)
  const todayTransactions = transactions.filter((t) => t.date === '2026-09-12');
  const todayIncomeTxs = todayTransactions.filter((t) => t.type === 'income');
  
  const additionalCash = todayIncomeTxs
    .filter((t) => t.paymentMethod === 'cash')
    .reduce((sum, t) => sum + t.amount, 0);

  const additionalDigital = todayIncomeTxs
    .filter((t) => t.paymentMethod === 'bank_transfer')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayCashBalance = 78000 + additionalCash;
  const todayDigitalBalance = 98000 + additionalDigital;
  const todayTotalRevenue = todayCashBalance + todayDigitalBalance;

  const todayTotalExpenses = todayTransactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const todayItemsSold = 420 + todayIncomeTxs.length * 2;

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        isAuthLoading,
        login,
        logout,
        waiterUser,
        isWaiterAuthenticated,
        waiterLogin,
        waiterLogout,
        activeOrders,
        submitWaiterOrder,
        markOrderServed,
        checkoutOrder,
        removeOrderItem,
        cancelEntireOrder,
        language,
        setLanguage,
        t,
        theme,
        toggleTheme,
        menuItems,
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        paymentMethod,
        setPaymentMethod,
        bankTxnId,
        setBankTxnId,
        isVerifying,
        verificationStep,
        verifiedReceipt,
        verifyBankTransfer,
        resetVerification,
        completeSale,
        transactions,
        addExpense,
        weeklyRevenue,
        activeCategory,
        setActiveCategory,
        searchQuery,
        setSearchQuery,
        subtotal,
        tax,
        grandTotal,
        todayTotalRevenue,
        todayItemsSold,
        todayCashBalance,
        todayDigitalBalance,
        todayTotalExpenses,
        toastMessage,
        showToast,
        setToastMessage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
