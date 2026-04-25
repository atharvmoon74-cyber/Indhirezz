'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { getUser, logout } from '@/lib/auth';
import { getBookings } from '@/lib/bookings';
import { Booking } from '@/lib/data';
import { User, Phone, CalendarDays, LogOut, ChevronRight, Shield, Star } from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    setBookings(getBookings());
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  const completedBookings = bookings.filter(b => b.status === 'completed');
  const totalSpent = completedBookings.reduce((sum, b) => sum + b.price, 0);

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
        {/* Profile card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border/50 text-center"
        >
          <div className="w-20 h-20 rounded-full gradient-primary mx-auto flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-amber-500/20 mb-4">
            {user?.name?.charAt(0) || 'A'}
          </div>
          <h1 className="text-xl font-bold">{user?.name || 'Atharv Moon'}</h1>
          <p className="text-sm text-muted-foreground mt-1 flex items-center justify-center gap-1">
            <Phone className="h-3.5 w-3.5" />
            {user?.phone || '+91 98765 43210'}
          </p>
          <div className="flex items-center justify-center gap-1 mt-2">
            <Shield className="h-3.5 w-3.5 text-green-500" />
            <span className="text-xs text-green-500 font-medium">Verified Account</span>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { value: completedBookings.length.toString(), label: 'Services Done', icon: <CalendarDays className="h-5 w-5 text-blue-500" /> },
            { value: `₹${totalSpent}`, label: 'Total Spent', icon: <Star className="h-5 w-5 text-amber-500" /> },
            { value: '4.8', label: 'Avg Rating', icon: <Star className="h-5 w-5 text-green-500" /> },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Booking history */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Booking History</h3>
          {bookings.length > 0 ? (
            <div className="space-y-2">
              {bookings.map((b) => (
                <div key={b.id} className="p-3 rounded-xl bg-muted/50 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{b.workerName}</p>
                    <p className="text-xs text-muted-foreground">{b.service} &middot; {b.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold gradient-text">₹{b.price}</p>
                    <p className={`text-[10px] font-medium ${
                      b.status === 'completed' ? 'text-green-500' : b.status === 'confirmed' ? 'text-blue-500' : 'text-muted-foreground'
                    }`}>
                      {b.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No bookings yet</p>
          )}
        </motion.div>

        {/* Quick links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-2"
        >
          {[
            { label: 'Payment History', path: '/payments', icon: <CalendarDays className="h-5 w-5 text-blue-500" /> },
            { label: 'Favorites', path: '/favorites', icon: <Star className="h-5 w-5 text-amber-500" /> },
            { label: 'Settings', path: '/settings', icon: <Shield className="h-5 w-5 text-green-500" /> },
          ].map((link) => (
            <button
              key={link.label}
              onClick={() => router.push(link.path)}
              className="w-full flex items-center gap-3 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all"
            >
              {link.icon}
              <span className="text-sm font-medium flex-1 text-left">{link.label}</span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ))}
        </motion.div>

        {/* Logout */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 p-4 rounded-2xl bg-destructive/10 text-destructive text-sm font-semibold hover:bg-destructive/20 transition-all"
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </motion.button>

        {/* About */}
        <div className="text-center text-xs text-muted-foreground pt-4">
          <p>Designed by Atharv Moon &mdash; Indhirezz ecosystem</p>
        </div>
      </div>
    </AppShell>
  );
}
