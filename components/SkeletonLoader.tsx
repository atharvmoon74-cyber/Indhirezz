'use client';

import { motion } from 'framer-motion';

export function SkeletonCard() {
  return (
    <div className="p-4 rounded-2xl bg-card border border-border/50 overflow-hidden">
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-muted animate-shimmer" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 rounded bg-muted animate-shimmer" />
          <div className="h-3 w-32 rounded bg-muted animate-shimmer" style={{ animationDelay: '0.1s' }} />
          <div className="flex gap-2">
            <div className="h-5 w-16 rounded-full bg-muted animate-shimmer" style={{ animationDelay: '0.2s' }} />
            <div className="h-5 w-12 rounded-full bg-muted animate-shimmer" style={{ animationDelay: '0.3s' }} />
          </div>
        </div>
        <div className="h-6 w-16 rounded bg-muted animate-shimmer" style={{ animationDelay: '0.15s' }} />
      </div>
    </div>
  );
}

export function SkeletonService() {
  return (
    <div className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 min-w-[80px]">
      <div className="w-10 h-10 rounded-xl bg-muted animate-shimmer" />
      <div className="h-3 w-14 rounded bg-muted animate-shimmer" style={{ animationDelay: '0.1s' }} />
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-12 h-12 rounded-2xl gradient-primary flex items-center justify-center"
      >
        <span className="text-2xl">🐝</span>
      </motion.div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-4 p-3">
      <div className="w-10 h-10 rounded-xl bg-muted animate-shimmer" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-32 rounded bg-muted animate-shimmer" />
        <div className="h-3 w-48 rounded bg-muted animate-shimmer" style={{ animationDelay: '0.1s' }} />
      </div>
      <div className="h-5 w-16 rounded bg-muted animate-shimmer" style={{ animationDelay: '0.2s' }} />
    </div>
  );
}
