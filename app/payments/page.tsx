'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { transactions } from '@/lib/data';
import { CreditCard, Wallet, Banknote, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';
import { useState } from 'react';

const methodConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
  upi: { icon: <CreditCard className="h-4 w-4" />, color: 'text-blue-500 bg-blue-500/10', label: 'UPI' },
  wallet: { icon: <Wallet className="h-4 w-4" />, color: 'text-amber-500 bg-amber-500/10', label: 'Wallet' },
  cash: { icon: <Banknote className="h-4 w-4" />, color: 'text-green-500 bg-green-500/10', label: 'Cash' },
};

const statusConfig: Record<string, { color: string; label: string }> = {
  completed: { color: 'text-green-500 bg-green-500/10', label: 'Completed' },
  pending: { color: 'text-amber-500 bg-amber-500/10', label: 'Pending' },
  refunded: { color: 'text-red-500 bg-red-500/10', label: 'Refunded' },
};

export default function PaymentsPage() {
  const [filter, setFilter] = useState<'all' | 'upi' | 'wallet' | 'cash'>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.method === filter);

  const totalSpent = transactions.filter(t => t.status === 'completed').reduce((sum, t) => sum + t.amount, 0);
  const pendingAmount = transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0);

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-bold">Payment History</h1>
          <p className="text-sm text-muted-foreground mt-1">Track all your transactions</p>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-2xl bg-card border border-border/50"
          >
            <p className="text-xs text-muted-foreground">Total Spent</p>
            <p className="text-2xl font-bold gradient-text mt-1">₹{totalSpent}</p>
            <p className="text-xs text-green-500 mt-1">You saved ₹120 this week</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="p-4 rounded-2xl bg-card border border-border/50"
          >
            <p className="text-xs text-muted-foreground">Pending</p>
            <p className="text-2xl font-bold text-amber-500 mt-1">₹{pendingAmount}</p>
            <p className="text-xs text-muted-foreground mt-1">{transactions.filter(t => t.status === 'completed').length} completed</p>
          </motion.div>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(['all', 'upi', 'wallet', 'cash'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all ${
                filter === f ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Transaction list */}
        <div className="space-y-3">
          {filtered.map((tx, i) => {
            const method = methodConfig[tx.method];
            const status = statusConfig[tx.status];
            return (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4 group hover:border-primary/20 transition-all"
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${method.color}`}>
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold truncate">{tx.workerName}</p>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{tx.service} &middot; {tx.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-bold">₹{tx.amount}</p>
                  <p className="text-[10px] text-muted-foreground">{method.label}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}
