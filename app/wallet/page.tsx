'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { getWalletBalance, getWalletTransactions, initWalletIfEmpty, WalletTx } from '@/lib/coins';
import { getCoins, getStreak } from '@/lib/coins';
import { Wallet, ArrowUpRight, ArrowDownLeft, Coins, Flame, Gift, Plus } from 'lucide-react';

export default function WalletPage() {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<WalletTx[]>([]);
  const [coins, setCoins] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    initWalletIfEmpty();
    setBalance(getWalletBalance());
    setTransactions(getWalletTransactions());
    setCoins(getCoins());
    setStreak(getStreak());
  }, []);

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-bold">Wallet</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage your balance and rewards</p>
        </div>

        {/* Balance card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">Indhirezz Wallet</span>
            </div>
            <button className="h-8 px-4 rounded-lg gradient-primary text-white text-xs font-semibold flex items-center gap-1 shadow-md shadow-amber-500/20">
              <Plus className="h-3 w-3" />
              Add Money
            </button>
          </div>
          <p className="text-4xl font-bold">₹{balance}</p>
          <p className="text-xs text-muted-foreground mt-1">Available balance</p>
        </motion.div>

        {/* Coins + Streak */}
        <div className="grid grid-cols-2 gap-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-2xl glass-card"
          >
            <div className="flex items-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-xs font-medium text-muted-foreground">Indhirezz Coins</span>
            </div>
            <p className="text-2xl font-bold gradient-text">{coins}</p>
            <p className="text-[10px] text-muted-foreground mt-1">Earn coins on every booking</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="p-4 rounded-2xl glass-card"
          >
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-orange-500" />
              <span className="text-xs font-medium text-muted-foreground">Booking Streak</span>
            </div>
            <p className="text-2xl font-bold text-orange-500">{streak} days</p>
            <p className="text-[10px] text-muted-foreground mt-1">Keep it going!</p>
          </motion.div>
        </div>

        {/* Cashback banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 flex items-center gap-3"
        >
          <Gift className="h-8 w-8 text-green-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-green-500">5% Cashback on Wallet Payments</p>
            <p className="text-xs text-muted-foreground">Use wallet to pay and earn cashback on every booking</p>
          </div>
        </motion.div>

        {/* Transactions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-4 rounded-2xl glass-card"
        >
          <h3 className="font-semibold mb-3">Transaction History</h3>
          <div className="space-y-3">
            {transactions.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-xl bg-muted/50"
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                  tx.type === 'credit' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                }`}>
                  {tx.type === 'credit' ? <ArrowDownLeft className="h-4 w-4" /> : <ArrowUpRight className="h-4 w-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{tx.description}</p>
                  <p className="text-xs text-muted-foreground">{tx.date}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                  </p>
                  <p className={`text-[10px] font-medium ${tx.status === 'completed' ? 'text-green-500' : 'text-amber-500'}`}>
                    {tx.status}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
