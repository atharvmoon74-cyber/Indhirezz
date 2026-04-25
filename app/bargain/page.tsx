'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import ChatBox from '@/components/ChatBox';
import { getWorkerById } from '@/lib/data';
import { Worker } from '@/lib/data';
import { ChevronLeft, Info } from 'lucide-react';

export default function BargainPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const workerId = searchParams.get('workerId');
  const [worker, setWorker] = useState<Worker | null>(null);

  useEffect(() => {
    if (workerId) {
      const w = getWorkerById(workerId);
      if (w) setWorker(w);
    }
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

  return (
    <AppShell>
      <div className="space-y-4 max-w-lg mx-auto">
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-xl font-bold mb-1">Negotiate with {worker.name}</h1>
          <p className="text-sm text-muted-foreground">Current rate: ₹{worker.price} per service</p>
        </motion.div>

        {/* Suggested price range */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-2"
        >
          <Info className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs font-medium text-amber-500">Suggested Price Range</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              ₹{Math.round(worker.price * 0.7)} - ₹{worker.price} based on market rates
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <ChatBox workerName={worker.name} workerPrice={worker.price} />
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={() => router.push(`/booking?workerId=${worker.id}`)}
          className="w-full h-12 rounded-xl gradient-primary text-white font-semibold shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
        >
          Book at ₹{worker.price}
        </motion.button>
      </div>
    </AppShell>
  );
}
