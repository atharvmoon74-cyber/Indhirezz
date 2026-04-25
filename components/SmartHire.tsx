'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { workers, getNearbyWorkers, services } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Sparkles, X, Zap, IndianRupee, MapPin, Star } from 'lucide-react';

interface Suggestion {
  type: string;
  icon: React.ReactNode;
  label: string;
  sublabel: string;
  workerId: string;
  color: string;
}

export default function SmartHireButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [typingDone, setTypingDone] = useState(false);

  const available = workers.filter(w => w.availability === 'available');
  const bestWorker = [...available].sort((a, b) => b.rating - a.rating)[0];
  const cheapestWorker = [...available].sort((a, b) => a.price - b.price)[0];
  const fastestWorker = [...available].sort((a, b) => a.distance - b.distance)[0];

  const suggestions: Suggestion[] = [
    {
      type: 'best',
      icon: <Star className="h-5 w-5 text-amber-500" />,
      label: 'Best Worker',
      sublabel: bestWorker ? `${bestWorker.name} - ${bestWorker.rating} rating` : 'No workers available',
      workerId: bestWorker?.id || '',
      color: 'from-amber-500/10 to-orange-500/10 border-amber-500/20',
    },
    {
      type: 'cheapest',
      icon: <IndianRupee className="h-5 w-5 text-green-500" />,
      label: 'Cheapest Option',
      sublabel: cheapestWorker ? `${cheapestWorker.name} - ₹${cheapestWorker.price}` : 'No workers available',
      workerId: cheapestWorker?.id || '',
      color: 'from-green-500/10 to-emerald-500/10 border-green-500/20',
    },
    {
      type: 'fastest',
      icon: <Zap className="h-5 w-5 text-blue-500" />,
      label: 'Fastest Arrival',
      sublabel: fastestWorker ? `${fastestWorker.name} - ${fastestWorker.distance} km` : 'No workers available',
      workerId: fastestWorker?.id || '',
      color: 'from-blue-500/10 to-cyan-500/10 border-blue-500/20',
    },
  ];

  const handleOpen = () => {
    setOpen(true);
    setTypingDone(false);
    setTimeout(() => setTypingDone(true), 1200);
  };

  return (
    <>
      {/* Floating button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-24 md:bottom-8 right-6 w-14 h-14 rounded-2xl gradient-primary text-white shadow-xl shadow-amber-500/30 flex items-center justify-center z-30"
      >
        <Sparkles className="h-6 w-6" />
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:max-w-md sm:rounded-2xl rounded-t-2xl bg-card border border-border/50 p-6 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  <h2 className="text-lg font-bold">Smart Hire</h2>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Typing effect */}
              <div className="mb-4 h-6">
                {!typingDone ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Analyzing workers</span>
                    <span className="flex gap-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  </div>
                ) : (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm text-primary font-medium"
                  >
                    Found the best matches for you!
                  </motion.p>
                )}
              </div>

              {/* Suggestions */}
              <div className="space-y-3">
                {suggestions.map((s, i) => (
                  <motion.button
                    key={s.type}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: typingDone ? 1 : 0, x: typingDone ? 0 : -20 }}
                    transition={{ delay: typingDone ? i * 0.1 : 0 }}
                    onClick={() => {
                      if (s.workerId) {
                        setOpen(false);
                        router.push(`/worker/${s.workerId}`);
                      }
                    }}
                    className={`w-full p-4 rounded-xl bg-gradient-to-r ${s.color} border flex items-center gap-3 hover:shadow-md transition-all text-left`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-card/50 flex items-center justify-center shrink-0">
                      {s.icon}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.sublabel}</p>
                    </div>
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  </motion.button>
                ))}
              </div>

              {/* Demand indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: typingDone ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="mt-4 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
              >
                <p className="text-xs text-amber-500 font-medium">
                  High demand: Only {available.length} workers available near you
                </p>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
