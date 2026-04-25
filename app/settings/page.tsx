'use client';

import { motion } from 'framer-motion';
import AppShell from '@/components/AppShell';
import { useTheme, ThemeMode } from '@/lib/theme';
import { Sun, Moon, Zap, Minimize2, Bell, Shield, Globe, Volume2 } from 'lucide-react';
import { useState } from 'react';

const themes: { id: ThemeMode; label: string; icon: React.ReactNode; desc: string }[] = [
  { id: 'dark', label: 'Dark', icon: <Moon className="h-5 w-5" />, desc: 'Easy on the eyes' },
  { id: 'light', label: 'Light', icon: <Sun className="h-5 w-5" />, desc: 'Clean and bright' },
  { id: 'neon', label: 'Neon', icon: <Zap className="h-5 w-5" />, desc: 'Cyber futuristic' },
  { id: 'minimal', label: 'Minimal', icon: <Minimize2 className="h-5 w-5" />, desc: 'Clean UI' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [location, setLocation] = useState(true);

  return (
    <AppShell>
      <div className="space-y-6 max-w-2xl mx-auto pb-24 md:pb-8">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Customize your experience</p>
        </div>

        {/* Theme */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <h3 className="font-semibold mb-3">Theme</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-4 rounded-xl border transition-all ${
                  theme === t.id
                    ? 'border-primary/50 bg-primary/5 shadow-md'
                    : 'border-border/50 hover:border-primary/20'
                }`}
              >
                <div className={`text-${theme === t.id ? 'primary' : 'muted-foreground'} mb-2`}>
                  {t.icon}
                </div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-[10px] text-muted-foreground">{t.desc}</p>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Toggles */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-2"
        >
          {[
            { icon: <Bell className="h-5 w-5 text-amber-500" />, label: 'Push Notifications', desc: 'Get notified about bookings and workers', value: notifications, setter: setNotifications },
            { icon: <Volume2 className="h-5 w-5 text-blue-500" />, label: 'Sound Effects', desc: 'Play sounds for messages and updates', value: sounds, setter: setSounds },
            { icon: <Globe className="h-5 w-5 text-green-500" />, label: 'Location Services', desc: 'Allow location for nearby workers', value: location, setter: setLocation },
          ].map((toggle, i) => (
            <motion.div
              key={toggle.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.05 }}
              className="p-4 rounded-2xl bg-card border border-border/50 flex items-center gap-4"
            >
              <div className="shrink-0">{toggle.icon}</div>
              <div className="flex-1">
                <p className="text-sm font-medium">{toggle.label}</p>
                <p className="text-xs text-muted-foreground">{toggle.desc}</p>
              </div>
              <button
                onClick={() => toggle.setter(!toggle.value)}
                className={`w-11 h-6 rounded-full transition-all relative ${
                  toggle.value ? 'bg-primary' : 'bg-muted'
                }`}
              >
                <motion.div
                  animate={{ x: toggle.value ? 20 : 2 }}
                  className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
                />
              </button>
            </motion.div>
          ))}
        </motion.div>

        {/* Privacy */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-4 rounded-2xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-5 w-5 text-green-500" />
            <h3 className="font-semibold">Privacy & Security</h3>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Your data is stored locally and encrypted.</p>
            <p>Location is only shared with workers you book.</p>
            <p>Payment info is never stored on our servers.</p>
          </div>
        </motion.div>
      </div>
    </AppShell>
  );
}
