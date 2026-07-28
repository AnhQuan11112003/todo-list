'use client';

import Link from 'next/link';
import { CheckSquare, Sparkles, Bell, BellOff, BellRing, LogIn, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface HeaderProps {
  notificationPermission?: string;
  requestPermission?: () => void;
  user?: SupabaseUser | null;
  signOut?: () => void;
  onOpenAuth?: () => void;
}

export function Header({
  notificationPermission = 'default',
  requestPermission,
  user = null,
  signOut,
  onOpenAuth,
}: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/40 bg-white/40 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/40">
      <div className="mx-auto flex h-14 sm:h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Balance Spacer / Desktop Auth */}
        <div className="flex w-10 sm:w-28 shrink-0 items-center justify-start">
          {user && signOut ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="glass-pill hidden gap-1 px-2.5 py-1.5 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 sm:flex dark:text-rose-400"
              title="Sign Out"
            >
              <LogOut className="h-3.5 w-3.5 text-rose-500" />
              <span>Sign Out</span>
            </Button>
          ) : onOpenAuth ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenAuth}
              className="glass-pill hidden gap-1 border-indigo-400/40 bg-indigo-500/10 px-2.5 py-1.5 text-xs font-semibold text-indigo-700 hover:bg-indigo-500/20 sm:flex dark:text-indigo-300"
              title="Sign In with Supabase Auth"
            >
              <LogIn className="h-3.5 w-3.5 text-indigo-500" />
              <span>Sign In</span>
            </Button>
          ) : null}
        </div>

        {/* Center Brand Logo */}
        <Link href="/" className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30 transition-transform hover:scale-105 active:scale-95">
            <CheckSquare className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-foreground text-base sm:text-lg font-extrabold tracking-tight">TaskFlow</h1>
            <Sparkles className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-pulse text-amber-500" />
          </div>
        </Link>

        {/* Right Notification Button */}
        <div className="flex w-10 sm:w-28 shrink-0 items-center justify-end">
          {notificationPermission === 'granted' ? (
            <Button
              variant="ghost"
              size="sm"
              className="glass-pill gap-1 px-2 py-1 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 sm:gap-1.5 sm:px-3 sm:py-1.5 dark:text-emerald-400"
              title="OS Push Notifications are Active"
            >
              <Bell className="h-3.5 w-3.5 text-emerald-500" />
              <span className="hidden sm:inline">Push Active</span>
            </Button>
          ) : notificationPermission === 'denied' && requestPermission ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPermission}
              className="glass-pill gap-1 px-2 py-1 text-xs font-semibold text-rose-600 hover:bg-rose-500/10 sm:gap-1.5 sm:px-3 sm:py-1.5 dark:text-rose-400"
              title="Notifications Blocked - Click to retry"
            >
              <BellOff className="h-3.5 w-3.5 text-rose-500" />
              <span className="hidden sm:inline">Blocked</span>
            </Button>
          ) : requestPermission ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={requestPermission}
              className="glass-pill gap-1 border-amber-300/60 bg-amber-500/10 px-2 py-1 text-xs font-semibold text-amber-700 hover:bg-amber-500/20 sm:gap-1.5 sm:px-3 sm:py-1.5 dark:text-amber-300"
            >
              <BellRing className="h-3.5 w-3.5 animate-bounce text-amber-500" />
              <span className="hidden sm:inline">Alerts</span>
            </Button>
          ) : (
            <div className="h-8 w-8" />
          )}
        </div>
      </div>
    </header>
  );
}
