'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { getUser, logout } from '@/lib/auth';
import { useTheme, ThemeMode } from '@/lib/theme';
import {
  LayoutDashboard, Search, Bell, User, LogOut, X, Menu,
  Wrench, CalendarDays, MessageSquare, CreditCard, Heart,
  Settings, ChevronLeft, ChevronRight, Sun, Moon, Zap, Minimize2, Wallet, Coins
} from 'lucide-react';
import { getCoins } from '@/lib/coins';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Wrench, label: 'Services', path: '/workers' },
  { icon: Search, label: 'Workers', path: '/workers' },
  { icon: CalendarDays, label: 'Bookings', path: '/bookings' },
  { icon: MessageSquare, label: 'Chat', path: '/bargain' },
  { icon: Wallet, label: 'Wallet', path: '/wallet' },
  { icon: CreditCard, label: 'Payments', path: '/payments' },
  { icon: Heart, label: 'Favorites', path: '/favorites' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const themes: { id: ThemeMode; label: string; icon: React.ReactNode; color: string }[] = [
  { id: 'dark', label: 'Dark', icon: <Moon className="h-4 w-4" />, color: 'bg-slate-800' },
  { id: 'light', label: 'Light', icon: <Sun className="h-4 w-4" />, color: 'bg-white border border-gray-200' },
  { id: 'neon', label: 'Neon', icon: <Zap className="h-4 w-4" />, color: 'bg-gradient-to-r from-cyan-500 to-purple-500' },
  { id: 'minimal', label: 'Minimal', icon: <Minimize2 className="h-4 w-4" />, color: 'bg-gray-100' },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [user, setUserState] = useState<{ name: string; phone: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coinCount, setCoinCount] = useState(0);

  useEffect(() => {
    const u = getUser();
    if (!u) {
      router.replace('/login');
      return;
    }
    setUserState(u);
    setCoinCount(getCoins());
  }, [router]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  if (!user) return null;

  return (
    <div className={`min-h-screen flex ${theme === 'neon' ? 'neon-mode' : ''} ${theme === 'minimal' ? 'minimal-mode' : ''}`}>
      {/* Desktop Sidebar */}
      <motion.aside
        animate={{ width: sidebarOpen ? 240 : 72 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden md:flex flex-col border-r border-border/50 bg-card/50 backdrop-blur-xl h-screen sticky top-0 z-40"
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border/50">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-amber-500/20 shrink-0">
              <span className="text-lg">🐝</span>
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="text-xl font-bold gradient-text whitespace-nowrap overflow-hidden"
                >
                  Indhirezz
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.path || (item.path === '/dashboard' && pathname === '/dashboard');
            return (
              <button
                key={item.label}
                onClick={() => router.push(item.path)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <item.icon className={`h-5 w-5 shrink-0 ${isActive ? 'text-primary' : 'group-hover:text-foreground'}`} />
                <AnimatePresence>
                  {sidebarOpen && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {isActive && (
                  <motion.div
                    layoutId="sidebar-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full gradient-primary"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Theme switcher */}
        <div className="px-2 pb-3">
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="mb-2"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-3 mb-2">Theme</p>
                <div className="grid grid-cols-4 gap-1.5 px-1">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                        theme === t.id ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded-full ${t.color}`} />
                      <span className="text-[9px] text-muted-foreground">{t.label}</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* User + collapse */}
        <div className="border-t border-border/50 p-3 space-y-2">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
              {user.name.charAt(0)}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{user.phone}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleLogout}
              className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top bar */}
        <header className="sticky top-0 z-30 border-b border-border/50 bg-background/80 backdrop-blur-xl h-16 flex items-center px-4 sm:px-6 gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="md:hidden h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground"
          >
            <Menu className="h-4 w-4" />
          </button>

          <div className="flex-1" />

          {/* Mobile theme switcher */}
          <div className="flex items-center gap-1 md:hidden">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                  theme === t.id ? 'ring-2 ring-primary/50' : ''
                }`}
              >
                <div className={`w-4 h-4 rounded-full ${t.color}`} />
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={() => router.push('/wallet')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 text-amber-500 text-xs font-semibold hover:bg-amber-500/20 transition-all"
            >
              <Coins className="h-3.5 w-3.5" />
              {coinCount}
            </button>
            <button
              onClick={() => router.push('/notifications')}
              className="relative h-9 w-9 rounded-xl bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
            >
              <Bell className="h-4 w-4" />
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full gradient-primary" />
            </button>
            <button
              onClick={() => router.push('/profile')}
              className="h-9 w-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold text-sm"
            >
              {user.name.charAt(0)}
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 py-6"
          >
            {children}
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="hidden md:block border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
          <p>Crafted with ⚡ by Atharv Moon &mdash; Indhirezz ecosystem</p>
        </footer>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/80 backdrop-blur-xl">
          <div className="flex items-center justify-around h-16">
            {navItems.slice(0, 5).map((item) => {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => router.push(item.path)}
                  className={`flex flex-col items-center gap-1 px-3 py-2 transition-all ${
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-[10px] font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border p-6 md:hidden overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-md shadow-amber-500/20">
                    <span className="text-lg">🐝</span>
                  </div>
                  <span className="text-lg font-bold gradient-text">Indhirezz</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="h-9 w-9 rounded-xl bg-muted flex items-center justify-center">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.path;
                  return (
                    <button
                      key={item.label}
                      onClick={() => { router.push(item.path); setMobileMenuOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isActive ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </button>
                  );
                })}
              </nav>

              {/* Mobile theme switcher */}
              <div className="mt-6 pt-4 border-t border-border/50">
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider px-4 mb-3">Theme</p>
                <div className="grid grid-cols-4 gap-2 px-4">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setTheme(t.id)}
                      className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all ${
                        theme === t.id ? 'bg-primary/10 ring-1 ring-primary/30' : 'hover:bg-muted'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full ${t.color}`} />
                      <span className="text-[10px] text-muted-foreground">{t.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-all"
                >
                  <LogOut className="h-5 w-5" />
                  Sign Out
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Watermark */}
      <div className="fixed bottom-20 md:bottom-4 right-4 text-[9px] text-muted-foreground/15 font-medium tracking-[0.2em]">
        INDHIREZZ
      </div>
    </div>
  );
}
