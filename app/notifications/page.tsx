'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { Bell, CircleCheck as CheckCircle, MapPin, Navigation, Star, MessageSquare } from 'lucide-react';

interface Notification {
  id: string;
  type: 'accepted' | 'on-the-way' | 'arrived' | 'completed' | 'bargain';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  {
    id: '1',
    type: 'accepted',
    title: 'Booking Accepted',
    message: 'Rajesh Kumar has accepted your booking for Electrician service.',
    time: '2 min ago',
    read: false,
  },
  {
    id: '2',
    type: 'on-the-way',
    title: 'Worker On the Way',
    message: 'Suresh Yadav is heading to your location. ETA: 8 minutes.',
    time: '15 min ago',
    read: false,
  },
  {
    id: '3',
    type: 'arrived',
    title: 'Worker Arrived',
    message: 'Anita Sharma has arrived at your location.',
    time: '1 hour ago',
    read: true,
  },
  {
    id: '4',
    type: 'completed',
    title: 'Service Completed',
    message: 'Your Car Cleaning service has been completed. Rate your experience!',
    time: '3 hours ago',
    read: true,
  },
  {
    id: '5',
    type: 'bargain',
    title: 'Counter Offer',
    message: 'Vikram Singh offered ₹350 for AC Repair. Respond now!',
    time: '5 hours ago',
    read: true,
  },
];

const typeConfig: Record<string, { icon: React.ReactNode; color: string }> = {
  accepted: { icon: <CheckCircle className="h-5 w-5" />, color: 'text-green-500 bg-green-500/10' },
  'on-the-way': { icon: <Navigation className="h-5 w-5" />, color: 'text-amber-500 bg-amber-500/10' },
  arrived: { icon: <MapPin className="h-5 w-5" />, color: 'text-blue-500 bg-blue-500/10' },
  completed: { icon: <Star className="h-5 w-5" />, color: 'text-amber-500 bg-amber-500/10' },
  bargain: { icon: <MessageSquare className="h-5 w-5" />, color: 'text-blue-500 bg-blue-500/10' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(initialNotifications);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppShell>
      <div className="space-y-6 pb-24 md:pb-8 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Notifications</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread` : 'All caught up!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-primary font-medium hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {notifications.map((notification, i) => {
            const config = typeConfig[notification.type];
            return (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`p-4 rounded-2xl border transition-all ${
                  notification.read
                    ? 'bg-card border-border/50'
                    : 'bg-card border-primary/20 shadow-sm shadow-primary/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${config.color}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-sm">{notification.title}</h3>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full gradient-primary shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {notifications.length === 0 && (
          <div className="text-center py-16">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-semibold">No notifications</p>
            <p className="text-sm text-muted-foreground mt-1">You're all caught up!</p>
          </div>
        )}
      </div>
    </AppShell>
  );
}
