export type CategoryType = 'all' | 'burgers' | 'sides' | 'beverages' | 'combos';

export interface MenuItem {
  id: string;
  nameEn: string;
  nameAm: string;
  category: Exclude<CategoryType, 'all'>;
  price: number; // in ETB
  descriptionEn: string;
  descriptionAm: string;
  image: string;
  popular?: boolean;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface BankDetails {
  bankName: string;
  referenceId: string;
  payerName: string;
  payerAccount: string;
  timestamp: string;
  amount: number;
  status: 'CONFIRMED' | 'PENDING' | 'REJECTED';
}

export interface Transaction {
  id: string;
  orderNumber: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  descriptionEn: string;
  descriptionAm: string;
  type: 'income' | 'expense';
  categoryEn: string;
  categoryAm: string;
  paymentMethod: 'cash' | 'bank_transfer';
  amount: number;
  status: 'completed' | 'verified' | 'pending';
  bankDetails?: BankDetails;
}

export interface DailyRevenue {
  dayEn: string;
  dayAm: string;
  date: string;
  cash: number;
  bankTransfer: number;
  total: number;
}

export type ActiveOrderStatus = 'pending' | 'served' | 'paid';

export interface WaiterUser {
  id: string;
  name: string;
  username: string;
  pin: string;
}

export interface ActiveOrder {
  id: string;
  orderNumber: string;
  tableNumber: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  grandTotal: number;
  status: ActiveOrderStatus;
  createdAt: string; // ISO or formatted time
  servedAt?: string;
  paidAt?: string;
  paymentMethod?: 'cash' | 'bank_transfer';
  bankDetails?: BankDetails;
  waiterName?: string;
}
