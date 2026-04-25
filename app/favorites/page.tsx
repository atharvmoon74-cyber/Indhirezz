'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import WorkerCard from '@/components/WorkerCard';
import { getWorkerById, services } from '@/lib/data';
import { Worker, Service } from '@/lib/data';
import { Heart, Trash2, Wrench } from 'lucide-react';

const FAV_WORKERS_KEY = 'workbee_fav_workers';
const FAV_SERVICES_KEY = 'workbee_fav_services';

export default function FavoritesPage() {
  const [favWorkerIds, setFavWorkerIds] = useState<string[]>([]);
  const [favServiceIds, setFavServiceIds] = useState<string[]>([]);
  const [tab, setTab] = useState<'workers' | 'services'>('workers');

  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem(FAV_WORKERS_KEY) || '[]');
      const s = JSON.parse(localStorage.getItem(FAV_SERVICES_KEY) || '[]');
      setFavWorkerIds(w);
      setFavServiceIds(s);
    } catch {}
  }, []);

  const removeWorker = (id: string) => {
    const updated = favWorkerIds.filter(wid => wid !== id);
    setFavWorkerIds(updated);
    localStorage.setItem(FAV_WORKERS_KEY, JSON.stringify(updated));
  };

  const removeService = (id: string) => {
    const updated = favServiceIds.filter(sid => sid !== id);
    setFavServiceIds(updated);
    localStorage.setItem(FAV_SERVICES_KEY, JSON.stringify(updated));
  };

  const favWorkers = favWorkerIds.map(id => getWorkerById(id)).filter(Boolean) as Worker[];
  const favServices = favServiceIds.map(id => services.find(s => s.id === id)).filter(Boolean) as Service[];

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-bold">Favorites</h1>
          <p className="text-sm text-muted-foreground mt-1">Quick access to your saved workers and services</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setTab('workers')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'workers' ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Heart className="h-4 w-4 inline mr-1" />
            Workers ({favWorkers.length})
          </button>
          <button
            onClick={() => setTab('services')}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === 'services' ? 'gradient-primary text-white' : 'bg-muted text-muted-foreground'
            }`}
          >
            <Wrench className="h-4 w-4 inline mr-1" />
            Services ({favServices.length})
          </button>
        </div>

        <AnimatePresence mode="wait">
          {tab === 'workers' ? (
            <motion.div
              key="workers"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="space-y-3"
            >
              {favWorkers.length > 0 ? favWorkers.map((w, i) => (
                <div key={w.id} className="relative group">
                  <WorkerCard worker={w} index={i} />
                  <button
                    onClick={() => removeWorker(w.id)}
                    className="absolute top-4 right-4 h-8 w-8 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              )) : (
                <div className="text-center py-16">
                  <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold">No favorite workers yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Tap the heart icon on any worker to save them</p>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="services"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="grid grid-cols-2 sm:grid-cols-3 gap-3"
            >
              {favServices.length > 0 ? favServices.map((s, i) => (
                <div key={s.id} className="relative group">
                  <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all">
                    <span className="text-3xl">{s.icon}</span>
                    <span className="text-xs font-medium text-center">{s.name}</span>
                  </div>
                  <button
                    onClick={() => removeService(s.id)}
                    className="absolute top-2 right-2 h-6 w-6 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              )) : (
                <div className="col-span-full text-center py-16">
                  <Wrench className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg font-semibold">No favorite services yet</p>
                  <p className="text-sm text-muted-foreground mt-1">Save services for quick access</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppShell>
  );
}

