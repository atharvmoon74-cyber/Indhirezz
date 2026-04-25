'use client';

const COINS_KEY = 'indhirezz_coins';
const STREAK_KEY = 'indhirezz_streak';
const WALLET_KEY = 'indhirezz_wallet_balance';
const WALLET_TX_KEY = 'indhirezz_wallet_tx';

export interface WalletTx {
  id: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  date: string;
  status: 'completed' | 'pending';
}

export function getCoins(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(COINS_KEY) || '50', 10);
}

export function addCoins(n: number): number {
  const current = getCoins();
  const updated = current + n;
  localStorage.setItem(COINS_KEY, updated.toString());
  return updated;
}

export function getStreak(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(STREAK_KEY) || '0', 10);
}

export function incrementStreak(): number {
  const current = getStreak();
  const updated = current + 1;
  localStorage.setItem(STREAK_KEY, updated.toString());
  return updated;
}

export function getWalletBalance(): number {
  if (typeof window === 'undefined') return 0;
  return parseInt(localStorage.getItem(WALLET_KEY) || '500', 10);
}

export function getWalletTransactions(): WalletTx[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(WALLET_TX_KEY) || '[]');
  } catch {
    return [];
  }
}

export function addWalletTx(tx: Omit<WalletTx, 'id' | 'date'>): WalletTx {
  const newTx: WalletTx = {
    ...tx,
    id: `wtx-${Date.now()}`,
    date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
  };
  const txs = getWalletTransactions();
  txs.unshift(newTx);
  localStorage.setItem(WALLET_TX_KEY, JSON.stringify(txs.slice(0, 50)));

  if (tx.type === 'credit') {
    const bal = getWalletBalance() + tx.amount;
    localStorage.setItem(WALLET_KEY, bal.toString());
  } else {
    const bal = Math.max(0, getWalletBalance() - tx.amount);
    localStorage.setItem(WALLET_KEY, bal.toString());
  }

  return newTx;
}

export function initWalletIfEmpty() {
  if (typeof window === 'undefined') return;
  const existing = localStorage.getItem(WALLET_TX_KEY);
  if (!existing) {
    const defaultTxs: WalletTx[] = [
      { id: 'wtx-1', type: 'credit', amount: 500, description: 'Welcome Bonus', date: '1 Jan 2024', status: 'completed' },
      { id: 'wtx-2', type: 'credit', amount: 25, description: 'Cashback - Electrician booking', date: '15 Mar 2024', status: 'completed' },
      { id: 'wtx-3', type: 'debit', amount: 314, description: 'Payment - Rajesh Kumar', date: '20 Mar 2024', status: 'completed' },
      { id: 'wtx-4', type: 'credit', amount: 50, description: 'Refund - Cancelled booking', date: '22 Mar 2024', status: 'completed' },
      { id: 'wtx-5', type: 'credit', amount: 15, description: 'Cashback - AC Repair', date: '25 Mar 2024', status: 'pending' },
    ];
    localStorage.setItem(WALLET_TX_KEY, JSON.stringify(defaultTxs));
  }
}
