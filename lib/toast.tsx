'use client';

import { useState, useEffect, createContext, useContext, ReactNode, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, MapPin, CircleCheck as CheckCircle } from 'lucide-react';

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning';
}

interface ToastContextType {
  addToast: (message: string, type?: Toast['type']) => void;
}

const ToastContext = createContext<ToastContextType>({ addToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

const activityMessages = [
  'Someone booked an Electrician nearby',
  'A Plumber just became available',
  '3 people are viewing AC Repair right now',
  'New worker joined in your area',
  'High demand for Car Cleaning today',
];

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  // Auto-generate activity toasts
  useEffect(() => {
    const timer = setInterval(() => {
      const msg = activityMessages[Math.floor(Math.random() * activityMessages.length)];
      addToast(msg, 'info');
    }, 25000);
    return () => clearInterval(timer);
  }, [addToast]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, x: 50, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 50, scale: 0.95 }}
              className="glass-card p-3 rounded-xl flex items-center gap-3 shadow-xl"
            >
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                toast.type === 'success' ? 'bg-green-500/10 text-green-500' :
                toast.type === 'warning' ? 'bg-amber-500/10 text-amber-500' :
                'bg-blue-500/10 text-blue-500'
              }`}>
                {toast.type === 'success' ? <CheckCircle className="h-4 w-4" /> :
                 toast.type === 'warning' ? <MapPin className="h-4 w-4" /> :
                 <Bell className="h-4 w-4" />}
              </div>
              <p className="text-xs font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                className="text-muted-foreground hover:text-foreground shrink-0"
              >
                <X className="h-3 w-3" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
