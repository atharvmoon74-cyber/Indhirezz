'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import ServiceCard from '@/components/ServiceCard';
import WorkerCard from '@/components/WorkerCard';
import SmartHireButton from '@/components/SmartHire';
import { SkeletonCard, SkeletonService } from '@/components/SkeletonLoader';
import { getUser } from '@/lib/auth';
import { getRecentBookings } from '@/lib/bookings';
import { services, getHighDemandServices } from '@/lib/data';
import { useDynamicWorkers } from '@/hooks/useDynamicWorkers';
import { getCoins, getStreak } from '@/lib/coins';
import { Search, Mic, TrendingUp, MapPin, Sparkles, Clock, ChevronRight, Flame, Zap, ChartBar as BarChart3, ArrowRight, Star, Users, CalendarCheck, Activity, Coins } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showVoice, setShowVoice] = useState(false);
  const [recentBookings, setRecentBookings] = useState<any[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const workers = useDynamicWorkers();

  useEffect(() => {
    const u = getUser();
    if (u) setUser(u);
    setRecentBookings(getRecentBookings(2));
    try {
      setRecentSearches(JSON.parse(localStorage.getItem('indhirezz_recent_searches') || '[]'));
    } catch {}
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const householdServices = services.filter(s => s.category === 'household');
  const commercialServices = services.filter(s => s.category === 'commercial');

  const nearbyWorkers = useMemo(() =>
    [...workers].filter(w => w.availability === 'available').sort((a, b) => a.distance - b.distance).slice(0, 6),
    [workers]
  );
  const popularWorkers = useMemo(() =>
    [...workers].sort((a, b) => b.completedJobs - a.completedJobs).slice(0, 4),
    [workers]
  );
  const trendingWorkers = useMemo(() =>
    [...workers].filter(w => w.rating >= 4.5 && w.availability === 'available').sort((a, b) => b.rating - a.rating).slice(0, 4),
    [workers]
  );
  const recommendedWorkers = useMemo(() =>
    [...workers].filter(w => w.availability === 'available' && w.rating >= 4.3).sort(() => Math.random() - 0.5).slice(0, 4),
    [workers]
  );
  const highDemand = getHighDemandServices();

  const availableCount = workers.filter(w => w.availability === 'available').length;
  const activeBookings = recentBookings.filter(b => b.status === 'confirmed' || b.status === 'in-progress').length;

  const filteredServices = searchQuery
    ? services.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : null;

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  return (
    <AppShell>
      <div className="space-y-8 pb-24 md:pb-8">
        {/* Greeting */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-1"
        >
          <p className="text-muted-foreground text-sm">{greeting()}</p>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.name || 'Atharv'} 👋
          </h1>
        </motion.div>

        {/* Search bar */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground z-10" />
          <input
            type="text"
            placeholder="Search for services, workers..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setShowSearchDropdown(true); }}
            onFocus={() => setShowSearchDropdown(true)}
            onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
            className="w-full h-14 pl-12 pr-14 rounded-2xl glass-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button
            onClick={() => setShowVoice(!showVoice)}
            className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary hover:bg-primary/20 transition-all"
          >
            <Mic className="h-4 w-4" />
          </button>

          {/* Autocomplete dropdown */}
          {showSearchDropdown && !searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-card p-3 z-20 shadow-xl"
            >
              {recentSearches.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Recent Searches</p>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.slice(0, 5).map((s) => (
                      <button
                        key={s}
                        onClick={() => { setSearchQuery(s); setShowSearchDropdown(false); }}
                        className="px-3 py-1.5 rounded-lg bg-muted text-xs font-medium hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-2">Trending Services</p>
                <div className="flex flex-wrap gap-2">
                  {highDemand.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setSearchQuery(s.name); setShowSearchDropdown(false); }}
                      className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-xs font-medium text-amber-500 hover:bg-amber-500/20 transition-all"
                    >
                      {s.icon} {s.name}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {showSearchDropdown && searchQuery && filteredServices && filteredServices.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full left-0 right-0 mt-2 rounded-2xl glass-card p-3 z-20 shadow-xl max-h-48 overflow-y-auto"
            >
              {filteredServices.map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    setSearchQuery(s.name);
                    setShowSearchDropdown(false);
                    const updated = [s.name, ...recentSearches.filter(r => r !== s.name)].slice(0, 10);
                    setRecentSearches(updated);
                    localStorage.setItem('indhirezz_recent_searches', JSON.stringify(updated));
                  }}
                  className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted transition-all text-left"
                >
                  <span className="text-lg">{s.icon}</span>
                  <span className="text-sm font-medium">{s.name}</span>
                  {s.demand && <span className="text-[10px] text-amber-500 font-semibold ml-auto">{s.demand}</span>}
                </button>
              ))}
            </motion.div>
          )}
        </motion.div>

        {/* Voice search UI (mock) */}
        {showVoice && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-6 rounded-2xl glass-card text-center"
          >
            <div className="w-16 h-16 rounded-full gradient-primary mx-auto flex items-center justify-center animate-pulse-glow mb-4">
              <Mic className="h-8 w-8 text-white" />
            </div>
            <p className="text-sm text-muted-foreground">Listening...</p>
            <p className="text-xs text-muted-foreground mt-1">Try saying &quot;Find a plumber near me&quot;</p>
          </motion.div>
        )}

        {/* Search results */}
        {filteredServices && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-2"
          >
            <h3 className="text-sm font-semibold text-muted-foreground">Search Results</h3>
            <div className="flex flex-wrap gap-3">
              {filteredServices.map((s, i) => (
                <ServiceCard key={s.id} service={s} index={i} />
              ))}
              {filteredServices.length === 0 && (
                <p className="text-sm text-muted-foreground py-4">No services found for &quot;{searchQuery}&quot;</p>
              )}
            </div>
          </motion.div>
        )}

        {!filteredServices && (
          <>
            {/* Stats cards */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="grid grid-cols-2 sm:grid-cols-4 gap-3"
            >
              <div className="p-4 rounded-2xl glass-card">
                <Users className="h-5 w-5 text-blue-500 mb-2" />
                <p className="text-lg font-bold">{availableCount}</p>
                <p className="text-[10px] text-muted-foreground">Nearby Workers</p>
              </div>
              <div className="p-4 rounded-2xl glass-card">
                <CalendarCheck className="h-5 w-5 text-green-500 mb-2" />
                <p className="text-lg font-bold">{activeBookings}</p>
                <p className="text-[10px] text-muted-foreground">Active Bookings</p>
              </div>
              <div className="p-4 rounded-2xl glass-card">
                <BarChart3 className="h-5 w-5 text-amber-500 mb-2" />
                <p className="text-lg font-bold">₹120</p>
                <p className="text-[10px] text-muted-foreground">Saved this week</p>
              </div>
              <div className="p-4 rounded-2xl glass-card">
                <Star className="h-5 w-5 text-cyan-500 mb-2" />
                <p className="text-lg font-bold">4.8</p>
                <p className="text-[10px] text-muted-foreground">Avg rating given</p>
              </div>
            </motion.div>

            {/* Auto-match best worker */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => {
                const best = nearbyWorkers[0];
                if (best) router.push(`/worker/${best.id}`);
              }}
              className="w-full p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-between hover:shadow-lg hover:shadow-amber-500/10 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white">
                  <Zap className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold">Auto-Match Best Worker</p>
                  <p className="text-xs text-muted-foreground">Find the perfect worker instantly</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-amber-500" />
            </motion.button>

            {/* High Demand Near You */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                <div className="flex items-center gap-2 mb-3">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-amber-500">High Demand Near You</h3>
                  <span className="text-[10px] font-semibold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full ml-auto">Only few left</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {highDemand.map((s, i) => (
                    <ServiceCard key={s.id} service={s} index={i} />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Recently booked */}
            {recentBookings.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <h3 className="font-semibold">Recently Booked</h3>
                  </div>
                </div>
                <div className="space-y-2">
                  {recentBookings.map((b) => (
                    <div key={b.id} className="p-3 rounded-xl glass-card flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{b.workerName}</p>
                        <p className="text-xs text-muted-foreground">{b.service}</p>
                      </div>
                      <span className="text-sm font-semibold gradient-text">₹{b.price}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Household Services */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Household Services</h3>
                <button
                  onClick={() => router.push('/workers?category=household')}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {loading ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {Array.from({ length: 5 }).map((_, i) => <SkeletonService key={i} />)}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {householdServices.map((s, i) => (
                    <ServiceCard key={s.id} service={s} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Commercial Services */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">Commercial Services</h3>
                <button
                  onClick={() => router.push('/workers?category=commercial')}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {loading ? (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {Array.from({ length: 5 }).map((_, i) => <SkeletonService key={i} />)}
                </div>
              ) : (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
                  {commercialServices.map((s, i) => (
                    <ServiceCard key={s.id} service={s} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Trending Workers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.33 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold">Trending Workers</h3>
                </div>
                <button
                  onClick={() => router.push('/workers')}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {trendingWorkers.map((w, i) => (
                    <WorkerCard key={w.id} worker={w} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Popular Workers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 text-amber-500" />
                  <h3 className="font-semibold">Popular Workers</h3>
                </div>
                <button
                  onClick={() => router.push('/workers')}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {popularWorkers.map((w, i) => (
                    <WorkerCard key={w.id} worker={w} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Recommended for you */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.38 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold">Recommended for You</h3>
                </div>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {recommendedWorkers.map((w, i) => (
                    <WorkerCard key={w.id} worker={w} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Nearby Workers */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  <h3 className="font-semibold">Nearby Workers</h3>
                </div>
                <button
                  onClick={() => router.push('/workers')}
                  className="text-xs text-primary font-medium flex items-center gap-1 hover:underline"
                >
                  View All <ChevronRight className="h-3 w-3" />
                </button>
              </div>
              {loading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)}
                </div>
              ) : (
                <div className="space-y-3">
                  {nearbyWorkers.map((w, i) => (
                    <WorkerCard key={w.id} worker={w} index={i} />
                  ))}
                </div>
              )}
            </motion.div>

            {/* Smart suggestions */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="p-4 rounded-2xl glass-card"
            >
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-blue-500" />
                <h3 className="font-semibold text-blue-400">Smart Suggestions</h3>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  Best deal nearby: <span className="text-foreground font-medium">{nearbyWorkers[0]?.name || 'Rajesh Kumar'}</span> - {nearbyWorkers[0]?.service || 'Electrician'} at ₹{nearbyWorkers[0]?.price || 299}
                </p>
                <p className="text-sm text-amber-500 font-medium">
                  Only {availableCount} workers available near you!
                </p>
                <p className="text-sm text-muted-foreground">
                  Suggested price range for Plumber: ₹200 - ₹350
                </p>
              </div>
            </motion.div>

            {/* Activity Feed */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 rounded-2xl glass-card"
            >
              <div className="flex items-center gap-2 mb-3">
                <Activity className="h-4 w-4 text-green-500" />
                <h3 className="font-semibold">Live Activity</h3>
              </div>
              <div className="space-y-2">
                {[
                  { text: 'Someone booked an Electrician in your area', time: '2 min ago', color: 'text-blue-500' },
                  { text: 'A new Plumber just became available', time: '5 min ago', color: 'text-green-500' },
                  { text: '3 people are viewing AC Repair right now', time: '8 min ago', color: 'text-amber-500' },
                  { text: 'Rajesh K. rated Suresh Y. 5 stars', time: '12 min ago', color: 'text-amber-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg bg-muted/50">
                    <div className={`w-1.5 h-1.5 rounded-full ${item.color} shrink-0`} />
                    <p className="text-xs text-muted-foreground flex-1">{item.text}</p>
                    <span className="text-[10px] text-muted-foreground shrink-0">{item.time}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Coins + Streak */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="grid grid-cols-2 gap-3"
            >
              <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
                <Coins className="h-8 w-8 text-amber-500" />
                <div>
                  <p className="text-lg font-bold gradient-text">{getCoins()}</p>
                  <p className="text-[10px] text-muted-foreground">Indhirezz Coins</p>
                </div>
              </div>
              <div className="p-4 rounded-2xl glass-card flex items-center gap-3">
                <Flame className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-lg font-bold text-orange-500">{getStreak()} days</p>
                  <p className="text-[10px] text-muted-foreground">Booking Streak</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </div>

      {/* Smart Hire floating button */}
      <SmartHireButton />
    </AppShell>
  );
}
