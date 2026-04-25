'use client';

import { motion } from 'framer-motion';
import { Service } from '@/lib/data';
import { useRouter } from 'next/navigation';

export default function ServiceCard({ service, index = 0 }: { service: Service; index?: number }) {
  const router = useRouter();

  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.05, y: -2 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => router.push(`/workers?service=${service.id}`)}
      className="flex flex-col items-center gap-2 p-4 rounded-2xl glass-card hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all min-w-[80px]"
    >
      <span className="text-3xl">{service.icon}</span>
      <span className="text-xs font-medium text-center leading-tight">{service.name}</span>
      {service.demand && (
        <span className="text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full">
          {service.demand}
        </span>
      )}
    </motion.button>
  );
}
