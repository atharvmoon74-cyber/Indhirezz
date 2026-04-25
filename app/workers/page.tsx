'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import AppShell from '@/components/AppShell';
import WorkerCard from '@/components/WorkerCard';
import { SkeletonCard } from '@/components/SkeletonLoader';
import { workers, services, getWorkersByService } from '@/lib/data';
import { Search, SlidersHorizontal, X, ArrowDownUp } from 'lucide-react';

type SortBy = 'price' | 'distance' | 'rating';

export default function WorkersPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceId = searchParams.get('service');
  const category = searchParams.get('category');

  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SortBy>('distance');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const currentService = serviceId ? services.find(s => s.id === serviceId) : null;

  const filteredWorkers = useMemo(() => {
    let result = serviceId
      ? getWorkersByService(serviceId)
      : category
        ? workers.filter(w => {
            const svc = services.find(s => s.id === w.service);
            return svc?.category === category;
          })
        : [...workers];

    if (search) {
      result = result.filter(w =>
        w.name.toLowerCase().includes(search.toLowerCase()) ||
        w.service.toLowerCase().includes(search.toLowerCase())
      );
    }

    result = result.filter(w => w.price >= priceRange[0] && w.price <= priceRange[1]);
    result = result.filter(w => w.rating >= minRating);

    result.sort((a, b) => {
      if (sortBy === 'price') return a.price - b.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return a.distance - b.distance;
    });

    return result;
  }, [serviceId, category, search, sortBy, priceRange, minRating]);

  return (
    <AppShell>
      <div className="space-y-6 pb-24 md:pb-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">
            {currentService ? `${currentService.icon} ${currentService.name}` : category ? `${category === 'household' ? '🏠' : '🏢'} ${category.charAt(0).toUpperCase() + category.slice(1)} Services` : 'All Workers'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {filteredWorkers.length} workers available
          </p>
        </div>

        {/* Search + Filter bar */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search workers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-11 pr-4 rounded-xl bg-card border border-border/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`h-12 w-12 rounded-xl flex items-center justify-center border transition-all ${
              showFilters ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-card border-border/50 text-muted-foreground'
            }`}
          >
            <SlidersHorizontal className="h-5 w-5" />
          </button>
        </div>

        {/* Filters panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-4">
                {/* Sort */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Sort By</label>
                  <div className="flex gap-2 mt-2">
                    {(['distance', 'price', 'rating'] as SortBy[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setSortBy(s)}
                        className={`px-4 py-2 rounded-lg text-xs font-semibold capitalize transition-all ${
                          sortBy === s
                            ? 'gradient-primary text-white'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {s === 'distance' ? '📍 Distance' : s === 'price' ? '💰 Price' : '⭐ Rating'}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price range */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Price Range: ₹{priceRange[0]} - ₹{priceRange[1]}
                  </label>
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={50}
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full mt-2 accent-amber-500"
                  />
                </div>

                {/* Min rating */}
                <div>
                  <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Min Rating: {minRating > 0 ? `${minRating}+` : 'Any'}
                  </label>
                  <div className="flex gap-2 mt-2">
                    {[0, 4, 4.5, 4.7].map((r) => (
                      <button
                        key={r}
                        onClick={() => setMinRating(r)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          minRating === r
                            ? 'gradient-primary text-white'
                            : 'bg-muted text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {r === 0 ? 'Any' : `${r}+`}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => { setPriceRange([0, 1000]); setMinRating(0); setSortBy('distance'); setSearch(''); }}
                  className="text-xs text-destructive font-medium hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Worker list */}
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : filteredWorkers.length > 0 ? (
          <div className="space-y-3">
            {filteredWorkers.map((w, i) => (
              <WorkerCard key={w.id} worker={w} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-semibold">No workers found</p>
            <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
