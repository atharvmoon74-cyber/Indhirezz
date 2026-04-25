'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { getWorkerById, services } from '@/lib/data';
import { Worker } from '@/lib/data';
import { addBooking } from '@/lib/bookings';
import { addCoins, incrementStreak } from '@/lib/coins';
import { ChevronLeft, Minus, Plus, Calendar, Clock, CircleCheck as CheckCircle, Shield, CreditCard, Wallet, Banknote, Zap, CalendarClock, Coins } from 'lucide-react';

const paymentMethods = [
  { id: 'cash' as const, label: 'Cash', icon: <Banknote className="h-5 w-5" />, desc: 'Pay after service' },
  { id: 'upi' as const, label: 'UPI', icon: <CreditCard className="h-5 w-5" />, desc: 'Google Pay, PhonePe' },
  { id: 'wallet' as const, label: 'Wallet', icon: <Wallet className="h-5 w-5" />, desc: 'Balance: ₹500' },
];

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get('workerId');
  const [worker, setWorker] = useState<Worker | null>(null);
  const [duration, setDuration] = useState(1);
  const [confirmed, setConfirmed] = useState(false);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'upi' | 'wallet'>('upi');
  const [bookingType, setBookingType] = useState<'instant' | 'schedule'>('instant');
  const [extraServices, setExtraServices] = useState<string[]>([]);

  useEffect(() => {
    if (workerId) {
      const w = getWorkerById(workerId);
      if (w) setWorker(w);
    }
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setTime(`${now.getHours().toString().padStart(2, '0')}:${(Math.ceil(now.getMinutes() / 15) * 15 % 60).toString().padStart(2, '0')}`);
  }, [workerId]);

  if (!worker) {
    return (
      <AppShell>
        <div className="text-center py-12">
          <p className="text-lg font-semibold">Worker not found</p>
          <button onClick={() => router.back()} className="text-primary text-sm mt-2 hover:underline">Go back</button>
        </div>
      </AppShell>
    );
  }

  const currentService = services.find(s => s.id === worker.service);
  const relatedServices = services.filter(s => s.category === currentService?.category && s.id !== worker.service).slice(0, 4);

  const extraCost = extraServices.length * 50;
  const totalPrice = (worker.price * duration) + extraCost;
  const serviceFee = Math.round(totalPrice * 0.05);
  const grandTotal = totalPrice + serviceFee;

  const toggleExtraService = (id: string) => {
    setExtraServices(prev =>
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const booking = {
      id: `bk-${Date.now()}`,
      workerId: worker.id,
      workerName: worker.name,
      service: currentService?.name || worker.service,
      date: bookingType === 'instant' ? 'Now' : `${date} ${time}`,
      duration,
      price: grandTotal,
      status: 'confirmed' as const,
      paymentMethod,
    };
    addBooking(booking);
    addCoins(10);
    incrementStreak();
    setConfirmed(true);
  };

  if (confirmed) {
    return (
      <AppShell>
        <div className="max-w-md mx-auto text-center py-16 space-y-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"
          >
            <CheckCircle className="h-10 w-10 text-green-500" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
            <p className="text-muted-foreground mt-2">
              {worker.name} will {bookingType === 'instant' ? 'arrive shortly' : `be at your location on ${date} at ${time}`}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              Payment: {paymentMethods.find(p => p.id === paymentMethod)?.label}
            </p>
            <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <Coins className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-semibold text-amber-500">+10 Coins Earned!</span>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-3"
          >
            <button
              onClick={() => router.push(`/tracking?workerId=${worker.id}`)}
              className="w-full h-12 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-amber-500/20"
            >
              Track Worker
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full h-12 rounded-xl bg-card border border-border/50 text-sm font-medium hover:bg-muted transition-all"
            >
              Back to Home
            </button>
          </motion.div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="space-y-6 max-w-lg mx-auto pb-24 md:pb-8">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </motion.button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-xl font-bold">Book {worker.name}</h1>
          <p className="text-sm text-muted-foreground">{currentService?.icon} {currentService?.name}</p>
        </motion.div>

        {/* Booking type */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="flex gap-3"
        >
          <button
            onClick={() => setBookingType('instant')}
            className={`flex-1 p-4 rounded-2xl border text-center transition-all ${
              bookingType === 'instant'
                ? 'border-primary/50 bg-primary/5 shadow-md'
                : 'border-border/50 bg-card hover:border-primary/20'
            }`}
          >
            <Zap className={`h-6 w-6 mx-auto mb-1 ${bookingType === 'instant' ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-semibold">Instant</p>
            <p className="text-[10px] text-muted-foreground">Book now</p>
          </button>
          <button
            onClick={() => setBookingType('schedule')}
            className={`flex-1 p-4 rounded-2xl border text-center transition-all ${
              bookingType === 'schedule'
                ? 'border-primary/50 bg-primary/5 shadow-md'
                : 'border-border/50 bg-card hover:border-primary/20'
            }`}
          >
            <CalendarClock className={`h-6 w-6 mx-auto mb-1 ${bookingType === 'schedule' ? 'text-primary' : 'text-muted-foreground'}`} />
            <p className="text-sm font-semibold">Schedule</p>
            <p className="text-[10px] text-muted-foreground">Pick date & time</p>
          </button>
        </motion.div>

        {/* Date & Time (only for schedule) */}
        <AnimatePresence>
          {bookingType === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                <h3 className="font-semibold">Schedule</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Date</label>
                    <div className="relative mt-1">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground font-medium">Time</label>
                    <div className="relative mt-1">
                      <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full h-10 pl-10 pr-3 rounded-xl bg-muted border-0 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Duration */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Duration</h3>
          <div className="flex items-center justify-between">
            <button
              onClick={() => setDuration(Math.max(1, duration - 1))}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 transition-all"
            >
              <Minus className="h-4 w-4" />
            </button>
            <div className="text-center">
              <p className="text-3xl font-bold gradient-text">{duration}</p>
              <p className="text-xs text-muted-foreground">{duration === 1 ? 'service' : 'services'}</p>
            </div>
            <button
              onClick={() => setDuration(Math.min(10, duration + 1))}
              className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 transition-all"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </motion.div>

        {/* Add extra services */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Add More Services</h3>
          <div className="flex flex-wrap gap-2">
            {relatedServices.map((s) => (
              <button
                key={s.id}
                onClick={() => toggleExtraService(s.id)}
                className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  extraServices.includes(s.id)
                    ? 'gradient-primary text-white'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                <span>{s.icon}</span>
                {s.name}
                <span className="text-[10px] opacity-70">+₹50</span>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Payment method */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Payment Method</h3>
          <div className="space-y-2">
            {paymentMethods.map((pm) => (
              <button
                key={pm.id}
                onClick={() => setPaymentMethod(pm.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                  paymentMethod === pm.id
                    ? 'border-primary/50 bg-primary/5'
                    : 'border-border/50 hover:border-primary/20'
                }`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  paymentMethod === pm.id ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                }`}>
                  {pm.icon}
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium">{pm.label}</p>
                  <p className="text-xs text-muted-foreground">{pm.desc}</p>
                </div>
                {paymentMethod === pm.id && (
                  <CheckCircle className="h-5 w-5 text-primary" />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Price breakdown */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Price Breakdown</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service fee (₹{worker.price} x {duration})</span>
              <span>₹{worker.price * duration}</span>
            </div>
            {extraCost > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Extra services ({extraServices.length})</span>
                <span>₹{extraCost}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Platform fee</span>
              <span>₹{serviceFee}</span>
            </div>
            <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="gradient-text text-lg">₹{grandTotal}</span>
            </div>
          </div>
        </motion.div>

        {/* Safety note */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-2"
        >
          <Shield className="h-4 w-4 text-green-500 shrink-0" />
          <p className="text-xs text-green-500">Your payment is protected. Full refund if worker doesn't show up.</p>
        </motion.div>

        {/* Confirm button */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleConfirm}
          className="w-full h-14 rounded-xl gradient-primary text-white font-semibold text-lg shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2"
        >
          {bookingType === 'instant' ? <Zap className="h-5 w-5" /> : <CalendarClock className="h-5 w-5" />}
          {bookingType === 'instant' ? 'Book Instantly' : 'Schedule Booking'} - ₹{grandTotal}
        </motion.button>
      </div>
    </AppShell>
  );
}
