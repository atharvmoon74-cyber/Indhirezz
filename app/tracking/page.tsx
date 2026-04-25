'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import TrackingMap from '@/components/TrackingMap';
import { getWorkerById } from '@/lib/data';
import { Worker } from '@/lib/data';
import { ChevronLeft } from 'lucide-react';

export default function TrackingPage() {
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
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
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
          <h1 className="text-xl font-bold">Track {worker.name}</h1>
          <p className="text-sm text-muted-foreground">Live location updates</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TrackingMap workerName={worker.name} />
        </motion.div>
      </div>
    </AppShell>
  );
}
