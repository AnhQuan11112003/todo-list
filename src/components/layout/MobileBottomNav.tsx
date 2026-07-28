'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CheckSquare, Calendar, Flame, BarChart3, Settings, Plus } from 'lucide-react';

import { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileBottomNavProps {
  onOpenCreate?: () => void;
  user?: SupabaseUser | null;
}

export function MobileBottomNav({ onOpenCreate }: MobileBottomNavProps) {
  const pathname = usePathname() || '/';


  const navItems = [
    { href: '/', label: 'Tasks', icon: CheckSquare },
    { href: '/calendar', label: 'Lịch', icon: Calendar },
    { href: '/focus', label: 'Focus', icon: Flame },
    { href: '/analytics', label: 'Thống kê', icon: BarChart3 },
    { href: '/settings', label: 'Cài đặt', icon: Settings },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-2 sm:hidden pointer-events-none">
      <nav className="glass-card pointer-events-auto flex items-center justify-between gap-1 rounded-full border border-white/60 bg-white/85 px-3 py-1.5 shadow-2xl backdrop-blur-2xl dark:border-white/15 dark:bg-slate-900/90">
        {navItems.slice(0, 2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-2xl transition-all active:scale-90 ${
                isActive
                  ? 'text-indigo-600 font-bold dark:text-indigo-400'
                  : 'text-slate-500 hover:text-indigo-500 dark:text-slate-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}

        {/* FAB Center Action Button */}
        {onOpenCreate ? (
          <button
            onClick={onOpenCreate}
            className="mx-1 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/40 transition-all duration-300 active:scale-90"
            aria-label="Create Task"
          >
            <Plus className="h-5 w-5 stroke-[3]" />
          </button>
        ) : (
          <Link
            href="/"
            className="mx-1 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/40 transition-all duration-300 active:scale-90"
            aria-label="Home Tasks"
          >
            <CheckSquare className="h-5 w-5 stroke-[2.5]" />
          </Link>
        )}

        {navItems.slice(2).map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex h-11 w-11 flex-col items-center justify-center rounded-2xl transition-all active:scale-90 ${
                isActive
                  ? 'text-indigo-600 font-bold dark:text-indigo-400'
                  : 'text-slate-500 hover:text-indigo-500 dark:text-slate-400'
              }`}
            >
              <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] mt-0.5">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
