'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { getBookings } from '@/lib/bookings';
import { Booking } from '@/lib/data';
import { CalendarDays, MapPin, Clock, CircleCheck as CheckCircle, Circle as XCircle, Loader as Loader2, ChevronRight } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  confirmed: { color: 'text-blue-500 bg-blue-500/10', icon: <CheckCircle className="h-4 w-4" /> },
  'in-progress': { color: 'text-amber-500 bg-amber-500/10', icon: <Loader2 className="h-4 w-4 animate-spin" /> },
  completed: { color: 'text-green-500 bg-green-500/10', icon: <CheckCircle className="h-4 w-4" /> },
  cancelled: { color: 'text-red-500 bg-red-500/10', icon: <XCircle className="h-4 w-4" /> },
};

export default function BookingsPage() {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filter, setFilter] = useState<'all' | 'confirmed' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    setBookings(getBookings());
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-bold">My Bookings</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage all your service bookings</p>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {(['all', 'confirmed', 'in-progress', 'completed'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize whitespace-nowrap transition-all ${
                filter === f ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'
              }`}
            >
              {f === 'all' ? 'All' : f}
            </button>
          ))}
        </div>

        {/* Booking timeline */}
        {filtered.length > 0 ? (
          <div className="space-y-4">
            {filtered.map((booking, i) => {
              const config = statusConfig[booking.status];
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative pl-8"
                >
                  {/* Timeline line */}
                  {i < filtered.length - 1 && (
                    <div className="absolute left-3 top-12 bottom-0 w-px bg-border" />
                  )}
                  {/* Timeline dot */}
                  <div className={`absolute left-1 top-4 w-5 h-5 rounded-full flex items-center justify-center ${config.color}`}>
                    {config.icon}
                  </div>

                  <div className="p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/20 transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold text-sm">{booking.workerName}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{booking.service}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold gradient-text">₹{booking.price}</p>
                        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.color}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {booking.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {booking.duration} {booking.duration === 1 ? 'service' : 'services'}
                      </span>
                    </div>
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => router.push(`/tracking?workerId=${booking.workerId}`)}
                        className="mt-3 flex items-center gap-1 text-xs text-primary font-medium hover:underline"
                      >
                        <MapPin className="h-3 w-3" />
                        Track Worker
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16">
            <CalendarDays className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">No bookings found</p>
            <p className="text-sm text-muted-foreground mt-1">Book a worker to see them here</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
