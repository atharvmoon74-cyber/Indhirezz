'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Phone } from 'lucide-react';

type TrackingStatus = 'assigned' | 'on-the-way' | 'arriving' | 'arrived';

const statusConfig: Record<TrackingStatus, { label: string; color: string; icon: string }> = {
  assigned: { label: 'Assigned', color: 'text-blue-500', icon: '✓' },
  'on-the-way': { label: 'On the way', color: 'text-amber-500', icon: '🚗' },
  arriving: { label: 'Arriving', color: 'text-orange-500', icon: '📍' },
  arrived: { label: 'Arrived', color: 'text-green-500', icon: '🏠' },
};

export default function TrackingMap({ workerName }: { workerName: string }) {
  const [status, setStatus] = useState<TrackingStatus>('assigned');
  const [eta, setEta] = useState(12);
  const [distance, setDistance] = useState(2.4);
  const [workerPos, setWorkerPos] = useState({ x: 15, y: 85 });
  const [routePoints, setRoutePoints] = useState<{ x: number; y: number }[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Route waypoints for the worker to follow
  const routePath = [
    { x: 15, y: 85 },
    { x: 25, y: 75 },
    { x: 35, y: 65 },
    { x: 45, y: 55 },
    { x: 55, y: 45 },
    { x: 65, y: 35 },
    { x: 75, y: 25 },
    { x: 85, y: 15 },
  ];

  useEffect(() => {
    const timers: NodeJS.Timeout[] = [];
    timers.push(setTimeout(() => setStatus('on-the-way'), 3000));
    timers.push(setTimeout(() => setStatus('arriving'), 8000));
    timers.push(setTimeout(() => setStatus('arrived'), 13000));
    return () => timers.forEach(clearTimeout);
  }, []);

  useEffect(() => {
    if (status === 'assigned') {
      setEta(12); setDistance(2.4);
      setWorkerPos({ x: 15, y: 85 });
      setRoutePoints([routePath[0]]);
    } else if (status === 'on-the-way') {
      setEta(8); setDistance(1.6);
      setWorkerPos({ x: 45, y: 55 });
      setRoutePoints(routePath.slice(0, 4));
    } else if (status === 'arriving') {
      setEta(3); setDistance(0.5);
      setWorkerPos({ x: 70, y: 30 });
      setRoutePoints(routePath.slice(0, 6));
    } else {
      setEta(0); setDistance(0);
      setWorkerPos({ x: 85, y: 15 });
      setRoutePoints(routePath);
    }
  }, [status]);

  // ETA countdown - real-time
  useEffect(() => {
    if (eta > 0 && (status === 'on-the-way' || status === 'arriving')) {
      intervalRef.current = setInterval(() => {
        setEta(prev => Math.max(0, prev - 1));
      }, 5000);
      return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
    }
  }, [eta, status]);

  // Worker movement animation
  useEffect(() => {
    if (status === 'on-the-way' || status === 'arriving') {
      const moveInterval = setInterval(() => {
        setWorkerPos(prev => {
          const targetIdx = status === 'on-the-way' ? 4 : 6;
          const target = routePath[targetIdx];
          const dx = (target.x - prev.x) * 0.05 + (Math.random() - 0.5) * 2;
          const dy = (target.y - prev.y) * 0.05 + (Math.random() - 0.5) * 2;
          return {
            x: Math.max(5, Math.min(95, prev.x + dx)),
            y: Math.max(5, Math.min(95, prev.y + dy)),
          };
        });
      }, 300);
      return () => clearInterval(moveInterval);
    }
  }, [status]);

  const statuses: TrackingStatus[] = ['assigned', 'on-the-way', 'arriving', 'arrived'];
  const currentIdx = statuses.indexOf(status);

  return (
    <div className="space-y-6">
      {/* Map visualization */}
      <div className="relative h-72 sm:h-80 rounded-2xl bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 overflow-hidden border border-border/50">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`h${i}`} className="absolute left-0 right-0 border-t border-white/20" style={{ top: `${(i + 1) * 12.5}%` }} />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={`v${i}`} className="absolute top-0 bottom-0 border-l border-white/20" style={{ left: `${(i + 1) * 12.5}%` }} />
          ))}
        </div>

        {/* Roads */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-amber-500/20" />
        <div className="absolute top-0 bottom-0 left-1/3 w-0.5 bg-amber-500/20" />
        <div className="absolute top-0 bottom-0 right-1/4 w-0.5 bg-amber-500/15" />
        <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-amber-500/15" />

        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 1 }}>
          {routePoints.length > 1 && (
            <motion.polyline
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: 'easeInOut' }}
              points={routePoints.map(p => `${p.x}%,${p.y}%`).join(' ')}
              fill="none"
              stroke="rgba(245, 158, 11, 0.4)"
              strokeWidth="2"
              strokeDasharray="8 4"
            />
          )}
        </svg>

        {/* Destination marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute right-8 top-5 flex flex-col items-center"
          style={{ zIndex: 2 }}
        >
          <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
            <MapPin className="h-5 w-5 text-green-500" />
          </div>
          <span className="text-[10px] text-green-400 mt-1 font-medium">You</span>
        </motion.div>

        {/* Worker marker */}
        <motion.div
          animate={{ left: `${workerPos.x}%`, top: `${workerPos.y}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
          style={{ left: 0, top: 0, zIndex: 3 }}
        >
          <div className="relative">
            <div className="w-10 h-10 rounded-full gradient-primary flex items-center justify-center shadow-lg shadow-amber-500/30">
              <span className="text-lg">🚗</span>
            </div>
            {/* Live pulse effect */}
            <div className="absolute -inset-3 rounded-full bg-amber-500/20 animate-ping" />
            <div className="absolute -inset-5 rounded-full bg-amber-500/10 animate-pulse" />
          </div>
          <span className="text-[10px] text-amber-400 mt-1 font-medium">{workerName}</span>
        </motion.div>

        {/* ETA overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between" style={{ zIndex: 4 }}>
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-foreground">
              {eta > 0 ? `${eta} min away` : 'Arrived!'}
            </span>
          </div>
          <div className="glass-card px-4 py-2 rounded-xl flex items-center gap-2">
            <Navigation className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-semibold text-foreground">
              {distance > 0 ? `${distance} km` : 'Here'}
            </span>
          </div>
        </div>
      </div>

      {/* Status timeline */}
      <div className="p-4 rounded-2xl bg-card border border-border/50">
        <h3 className="font-semibold mb-4">Live Status</h3>
        <div className="flex items-center justify-between relative">
          <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
            <motion.div
              initial={{ width: '0%' }}
              animate={{ width: `${(currentIdx / 3) * 100}%` }}
              transition={{ duration: 0.5 }}
              className="h-full gradient-primary rounded-full"
            />
          </div>
          {statuses.map((s, i) => {
            const config = statusConfig[s];
            const isCompleted = i <= currentIdx;
            const isCurrent = i === currentIdx;
            return (
              <div key={s} className="flex flex-col items-center gap-2 relative z-10">
                <motion.div
                  animate={{
                    scale: isCurrent ? 1.2 : 1,
                    backgroundColor: isCompleted ? 'rgb(245, 158, 11)' : 'rgb(64, 64, 64)',
                  }}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    isCurrent ? 'animate-pulse-glow' : ''
                  }`}
                >
                  {config.icon}
                </motion.div>
                <span className={`text-xs font-medium ${isCompleted ? config.color : 'text-muted-foreground'}`}>
                  {config.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-3">
        <button className="flex-1 h-12 rounded-xl bg-card border border-border/50 flex items-center justify-center gap-2 text-sm font-medium hover:bg-muted transition-all">
          <Phone className="h-4 w-4 text-green-500" />
          Call Worker
        </button>
        <button className="flex-1 h-12 rounded-xl gradient-primary text-white flex items-center justify-center gap-2 text-sm font-semibold shadow-lg shadow-amber-500/20">
          <MapPin className="h-4 w-4" />
          Share Location
        </button>
      </div>
    </div>
  );
}
