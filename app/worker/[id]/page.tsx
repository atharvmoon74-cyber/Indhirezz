'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { getWorkerById, services, workers } from '@/lib/data';
import { Worker } from '@/lib/data';
import { Star, MapPin, Clock, Briefcase, Award, Phone, MessageSquare, Navigation, ChevronLeft, CircleCheck as CheckCircle, Heart, ArrowLeftRight, RotateCcw, Flame, Zap, IndianRupee } from 'lucide-react';

const FAV_KEY = 'workbee_fav_workers';

const personalityBadges: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  fast: { icon: <Zap className="h-3.5 w-3.5" />, label: 'Fast Response', color: 'text-blue-500 bg-blue-500/10' },
  premium: { icon: <Award className="h-3.5 w-3.5" />, label: 'Top Rated', color: 'text-amber-500 bg-amber-500/10' },
  negotiator: { icon: <IndianRupee className="h-3.5 w-3.5" />, label: 'Best Price', color: 'text-green-500 bg-green-500/10' },
  friendly: { icon: <Heart className="h-3.5 w-3.5" />, label: 'Friendly', color: 'text-pink-500 bg-pink-500/10' },
};

export default function WorkerProfilePage() {
  const router = useRouter();
  const params = useParams();
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  useEffect(() => {
    const w = getWorkerById(params.id as string);
    if (w) setWorker(w);
    try {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      if (w) setIsFav(favs.includes(w.id));
    } catch {}
    setTimeout(() => setLoading(false), 500);
  }, [params.id]);

  const toggleFav = () => {
    if (!worker) return;
    try {
      const favs = JSON.parse(localStorage.getItem(FAV_KEY) || '[]');
      const updated = isFav ? favs.filter((id: string) => id !== worker.id) : [...favs, worker.id];
      localStorage.setItem(FAV_KEY, JSON.stringify(updated));
      setIsFav(!isFav);
    } catch {}
  };

  if (loading) {
    return (
      <AppShell>
        <div className="animate-pulse space-y-6 max-w-2xl mx-auto">
          <div className="h-8 w-32 rounded bg-muted" />
          <div className="h-48 rounded-2xl bg-muted" />
          <div className="space-y-3">
            <div className="h-6 w-48 rounded bg-muted" />
            <div className="h-4 w-32 rounded bg-muted" />
          </div>
        </div>
      </AppShell>
    );
  }

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

  const currentService = services.find(s => s.id === worker.service);
  const similarWorkers = workers.filter(w => w.service === worker.service && w.id !== worker.id).slice(0, 3);
  const badge = personalityBadges[worker.personality];

  return (
    <AppShell>
      <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        {/* Back + actions */}
        <div className="flex items-center justify-between">
          <motion.button
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </motion.button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowCompare(!showCompare)}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
              title="Compare workers"
            >
              <ArrowLeftRight className="h-4 w-4" />
            </button>
            <button
              onClick={toggleFav}
              className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center transition-all"
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
            </button>
          </div>
        </div>

        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-2xl bg-card border border-border/50"
        >
          <div className="flex items-start gap-4">
            <div className="relative">
              <img
                src={worker.image}
                alt={worker.name}
                className="w-20 h-20 rounded-2xl object-cover"
              />
              {worker.availability === 'available' && (
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-500 border-2 border-card flex items-center justify-center">
                  <CheckCircle className="h-3 w-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">{worker.name}</h1>
                {badge && (
                  <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
                    {badge.icon}
                    {badge.label}
                  </span>
                )}
              </div>
              <p className="text-sm text-primary font-medium mt-0.5">
                {currentService?.icon} {currentService?.name}
              </p>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1 text-sm">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  <span className="font-semibold">{worker.rating}</span>
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5" />
                  {worker.distance} km
                </span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                  worker.availability === 'available' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'
                }`}>
                  {worker.availability === 'available' ? 'Available' : 'Busy'}
                </span>
              </div>
              {/* Trust Score */}
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-white ${
                    worker.trustBadge === 'elite' ? 'bg-amber-500' : worker.trustBadge === 'verified' ? 'bg-blue-500' : 'bg-gray-500'
                  }`}>
                    {worker.trustBadge === 'elite' ? 'E' : worker.trustBadge === 'verified' ? 'V' : 'N'}
                  </div>
                  <span className="text-xs font-medium">{worker.trustScore}/100 Trust</span>
                </div>
                <span className="text-xs text-green-500 font-medium">{worker.onTimeRate}% on-time</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold gradient-text">₹{worker.price}</p>
              <p className="text-xs text-muted-foreground">per service</p>
            </div>
          </div>

          {/* Badges row */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            {worker.rating >= 4.7 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-500">
                <Star className="h-3 w-3" /> Top Rated
              </span>
            )}
            {worker.distance < 1 && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-500">
                <MapPin className="h-3 w-3" /> Nearby
              </span>
            )}
            {worker.personality === 'fast' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-500">
                <Flame className="h-3 w-3" /> Fast Response
              </span>
            )}
            {worker.personality === 'negotiator' && (
              <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-full bg-green-500/10 text-green-500">
                <IndianRupee className="h-3 w-3" /> Best Price
              </span>
            )}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { icon: <Clock className="h-5 w-5 text-blue-500" />, value: `${worker.experience} yrs`, label: 'Experience' },
            { icon: <Briefcase className="h-5 w-5 text-amber-500" />, value: worker.completedJobs.toString(), label: 'Jobs Done' },
            { icon: <Award className="h-5 w-5 text-green-500" />, value: worker.rating.toString(), label: 'Rating' },
          ].map((stat, i) => (
            <div key={i} className="p-4 rounded-xl bg-card border border-border/50 text-center">
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-lg font-bold">{stat.value}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Skills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Skills</h3>
          <div className="flex flex-wrap gap-2">
            {worker.skills.map((skill) => (
              <span key={skill} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                {skill}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Reviews */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Reviews ({worker.reviews.length})</h3>
          <div className="space-y-3">
            {worker.reviews.map((review) => (
              <div key={review.id} className="p-3 rounded-xl bg-muted/50">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">{review.userName}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3 w-3 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{review.comment}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{review.date}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Compare workers */}
        {showCompare && similarWorkers.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-2xl bg-card border border-border/50"
          >
            <h3 className="font-semibold mb-3">Compare with Similar Workers</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border/50">
                    <th className="text-left py-2 font-medium text-muted-foreground">Worker</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Rating</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Price</th>
                    <th className="text-center py-2 font-medium text-muted-foreground">Distance</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-primary/20 bg-primary/5">
                    <td className="py-2 font-semibold text-primary">{worker.name} (You)</td>
                    <td className="text-center py-2">{worker.rating}</td>
                    <td className="text-center py-2 font-bold">₹{worker.price}</td>
                    <td className="text-center py-2">{worker.distance} km</td>
                  </tr>
                  {similarWorkers.map((sw) => (
                    <tr key={sw.id} className="border-b border-border/30 cursor-pointer hover:bg-muted/50" onClick={() => router.push(`/worker/${sw.id}`)}>
                      <td className="py-2">{sw.name}</td>
                      <td className="text-center py-2">{sw.rating}</td>
                      <td className="text-center py-2">₹{sw.price}</td>
                      <td className="text-center py-2">{sw.distance} km</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-2 gap-3"
        >
          <button
            onClick={() => router.push(`/bargain?workerId=${worker.id}`)}
            className="h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted transition-all"
          >
            <MessageSquare className="h-4 w-4 text-blue-500" />
            Chat / Bargain
          </button>
          <button
            onClick={() => router.push(`/booking?workerId=${worker.id}`)}
            className="h-12 rounded-xl gradient-primary text-white flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-amber-500/20"
          >
            <Navigation className="h-4 w-4" />
            Book Now
          </button>
        </motion.div>

        <div className="grid grid-cols-3 gap-3">
          <button className="h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center gap-2 text-xs font-medium hover:bg-muted transition-all">
            <Phone className="h-4 w-4 text-green-500" />
            Call
          </button>
          <button
            onClick={() => router.push(`/tracking?workerId=${worker.id}`)}
            className="h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center gap-2 text-xs font-medium hover:bg-muted transition-all"
          >
            <MapPin className="h-4 w-4 text-amber-500" />
            Track
          </button>
          <button
            onClick={() => router.push(`/booking?workerId=${worker.id}`)}
            className="h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center gap-2 text-xs font-medium hover:bg-muted transition-all"
          >
            <RotateCcw className="h-4 w-4 text-blue-500" />
            Hire Again
          </button>
        </div>
      </div>
    </AppShell>
  );
}
