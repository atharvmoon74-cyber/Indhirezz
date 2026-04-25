'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { setUser } from '@/lib/auth';
import { Phone, User, ArrowRight, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (!name.trim() || !phone.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setUser({ name: name.trim(), phone: phone.trim() });
      router.replace('/dashboard');
    }, 800);
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />

      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            className="flex items-center gap-3 mb-12"
          >
            <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center shadow-lg shadow-amber-500/25">
              <span className="text-3xl">🐝</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold gradient-text">Indhirezz</h1>
              <p className="text-xs text-muted-foreground tracking-wider uppercase">Hire. Book. Track.</p>
            </div>
          </motion.div>

          {/* Welcome text */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold mb-3">
              Welcome to the<br />
              <span className="gradient-text">future of local services</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Find trusted workers near you, negotiate prices, and book instantly.
            </p>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-4"
          >
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="tel"
                placeholder="Phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={!name.trim() || !phone.trim() || loading}
              className="w-full h-14 rounded-xl gradient-primary text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Get Started
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-12 grid grid-cols-3 gap-4"
          >
            {[
              { icon: '⚡', label: 'Instant Booking' },
              { icon: '💰', label: 'Negotiate Price' },
              { icon: '📍', label: 'Live Tracking' },
            ].map((f, i) => (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + i * 0.1 }}
                className="text-center p-3 rounded-xl bg-card/50 border border-border/50"
              >
                <span className="text-2xl">{f.icon}</span>
                <p className="text-xs text-muted-foreground mt-1">{f.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-center text-xs text-muted-foreground mt-12"
          >
            Crafted with ⚡ by Atharv Moon
          </motion.p>
        </motion.div>
      </div>

      {/* Right side decorative panel */}
      <div className="hidden lg:flex flex-1 items-center justify-center relative">
        <div className="absolute inset-0 bg-gradient-to-l from-amber-500/5 to-transparent" />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative"
        >
          <div className="w-80 h-80 rounded-full gradient-primary opacity-20 blur-3xl absolute -top-20 -left-20" />
          <div className="relative z-10 space-y-6 p-8">
            <div className="flex items-center gap-3 p-4 rounded-2xl glass-card">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <p className="font-semibold">Smart Matching</p>
                <p className="text-sm text-muted-foreground">AI-powered worker recommendations</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl glass-card ml-8">
              <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                <span className="text-xl">✓</span>
              </div>
              <div>
                <p className="font-semibold">Verified Workers</p>
                <p className="text-sm text-muted-foreground">Background checked & rated</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-2xl glass-card">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                <span className="text-xl">📍</span>
              </div>
              <div>
                <p className="font-semibold">Real-time Tracking</p>
                <p className="text-sm text-muted-foreground">Know exactly when they arrive</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Watermark */}
      <div className="absolute bottom-4 right-4 text-[10px] text-muted-foreground/20 font-medium tracking-widest">
        ATHARV MOON
      </div>
    </div>
  );
}
