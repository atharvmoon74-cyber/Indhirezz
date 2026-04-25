'use client';

import { useState, useEffect } from 'react';
import { workers as staticWorkers, Worker } from '@/lib/data';

export function useDynamicWorkers() {
  const [dynamicWorkers, setDynamicWorkers] = useState<Worker[]>(staticWorkers);

  useEffect(() => {
    const interval = setInterval(() => {
      setDynamicWorkers(prev =>
        prev.map(w => {
          const availRoll = Math.random();
          const newAvail: Worker['availability'] =
            availRoll < 0.6 ? 'available' : availRoll < 0.85 ? 'busy' : 'offline';

          const priceDelta = Math.round((Math.random() - 0.5) * 60);
          const newPrice = Math.max(100, w.price + priceDelta);

          const demandLabels = ['High demand', 'Only few left', ''];
          const demandIdx = Math.floor(Math.random() * demandLabels.length);

          return {
            ...w,
            availability: Math.random() > 0.85 ? newAvail : w.availability,
            price: Math.random() > 0.7 ? newPrice : w.price,
          };
        })
      );
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return dynamicWorkers;
}
