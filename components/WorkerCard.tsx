'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Worker } from '@/lib/data';
import { useRouter } from 'next/navigation';
import { Star, MapPin, BadgeCheck, Zap, IndianRupee, Heart, Flame, Shield } from 'lucide-react';

const FAV_KEY = 'workbee_fav_workers';

const tagConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  'Top Rated': { color: 'text-amber-500 bg-amber-500/10', icon: <BadgeCheck className="h-3 w-3" /> },
  'Fast': { color: 'text-blue-500 bg-blue-500/10', icon: <Zap className="h-3 w-3" /> },
  'Cheap': { color: 'text-green-500 bg-green-500/10', icon: <IndianRupee className="h-3 w-3" /> },
  'Nearby': { color: 'text-cyan-500 bg-cyan-500/10', icon: <MapPin className="h-3 w-3" /> },
  'Premium': { color: 'text-amber-500 bg-amber-500/10', icon: <BadgeCheck className="h-3 w-3" /> },
  'Best Price': { color: 'text-green-500 bg-green-500/10', icon: <IndianRupee className="h-3 w-3" /> },
  'Negotiator': { color: 'text-orange-500 bg-orange-500/10', icon: <Zap className="h-3 w-3" /> },
  'Friendly': { color: 'text-pink-500 bg-pink-500/10', icon: <Heart className="h-3 w-3" /> },
  'Trusted': { color: 'text-blue-500 bg-blue-500/10', icon: <BadgeCheck className="h-3 w-3" /> },
  'Quick Response': { color: 'text-cyan-500 bg-cyan-500/10', icon: <Zap className="h-3 w-3" /> },
  'Available': { color: 'text-green-500 bg-green-500/10', icon: <Zap className="h-3 w-3" /> },
};

export default function WorkerCard({ worker, index = 0 }: { worker: Worker; index?: number }) {
  const router = useRouter();
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      setIsFav(favs.includes(worker.id));
    } catch {}
  }, [worker.id]);

  const toggleFav = (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      const updated = isFav ? favs.filter((id: string) => id !== worker.id) : [...favs, worker.id];
      localStorage.setItem(FAV_KEY, JSON.stringify(updated));
      setIsFav(!isFav);
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={() => router.push(`/worker/${worker.id}`)}
      className="group cursor-pointer p-4 rounded-2xl glass-card hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all"
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <img
            src={worker.image}
            alt={worker.name}
            className="w-14 h-14 rounded-xl object-cover"
          />
          {worker.availability === 'available' && (
            <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-green-500 border-2 border-card" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm truncate">{worker.name}</h3>
            {worker.trustBadge === 'elite' && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 shrink-0">ELITE</span>
            )}
            {worker.trustBadge === 'verified' && (
              <BadgeCheck className="h-4 w-4 text-blue-500 shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-1">
            <span className="flex items-center gap-1 text-xs">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              <span className="font-medium">{worker.rating}</span>
            </span>
            <span className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {worker.distance} km
            </span>
            <span className="text-xs text-muted-foreground">
              {worker.completedJobs} jobs
            </span>
            <span className="flex items-center gap-1 text-xs text-green-500">
              <Shield className="h-3 w-3" />
              {worker.onTimeRate}%
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            {worker.availability === 'available' && worker.distance < 1 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full text-red-500 bg-red-500/10">
                <Flame className="h-3 w-3" /> High demand
              </span>
            )}
            {worker.tags.slice(0, 3).map((tag) => {
              const config = tagConfig[tag];
              if (!config) return null;
              return (
                <span
                  key={tag}
                  className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${config.color}`}
                >
                  {config.icon}
                  {tag}
                </span>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <button
            onClick={toggleFav}
            className="h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:scale-110"
          >
            <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
          </button>
          <div className="text-right">
            <p className="text-lg font-bold gradient-text">₹{worker.price}</p>
            <p className="text-[10px] text-muted-foreground">per service</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
