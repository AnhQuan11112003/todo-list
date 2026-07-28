'use client';

import { CheckSquare, FolderKanban, Plus, User, Bell, Filter } from 'lucide-react';
import { User as SupabaseUser } from '@supabase/supabase-js';

interface MobileBottomNavProps {
  onOpenCreate: () => void;
  onOpenManageCategories: () => void;
  onOpenAuth: () => void;
  user: SupabaseUser | null;
  activeTab?: string;
}

export function MobileBottomNav({
  onOpenCreate,
  onOpenManageCategories,
  onOpenAuth,
  user,
}: MobileBottomNavProps) {
  return (
    <div className="fixed bottom-3 inset-x-0 z-40 flex justify-center px-4 sm:hidden pointer-events-none">
      <nav className="glass-card pointer-events-auto flex items-center justify-between gap-1 rounded-full border border-white/60 bg-white/80 px-3 py-2 shadow-2xl backdrop-blur-2xl dark:border-white/15 dark:bg-slate-900/85">
        {/* All Tasks Nav */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-11 w-12 flex-col items-center justify-center rounded-2xl text-indigo-600 transition-all active:scale-95 dark:text-indigo-400"
          aria-label="Scroll to Top"
        >
          <CheckSquare className="h-5 w-5" />
          <span className="text-[10px] font-bold mt-0.5">Tasks</span>
        </button>

        {/* Categories Nav */}
        <button
          onClick={onOpenManageCategories}
          className="flex h-11 w-12 flex-col items-center justify-center rounded-2xl text-slate-600 hover:text-indigo-600 transition-all active:scale-95 dark:text-slate-400 dark:hover:text-indigo-400"
          aria-label="Manage Categories"
        >
          <FolderKanban className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-0.5">Projects</span>
        </button>

        {/* Center Floating Action Button (FAB) */}
        <button
          onClick={onOpenCreate}
          className="mx-1 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/40 transition-all duration-300 active:scale-90"
          aria-label="Create New Task"
        >
          <Plus className="h-6 w-6 stroke-[3]" />
        </button>

        {/* Filters Quick Scroll */}
        <button
          onClick={() => {
            const el = document.getElementById('tasks-heading');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="flex h-11 w-12 flex-col items-center justify-center rounded-2xl text-slate-600 hover:text-indigo-600 transition-all active:scale-95 dark:text-slate-400 dark:hover:text-indigo-400"
          aria-label="Filter Tasks"
        >
          <Filter className="h-5 w-5" />
          <span className="text-[10px] font-medium mt-0.5">Filter</span>
        </button>

        {/* Account Auth Nav */}
        <button
          onClick={onOpenAuth}
          className="flex h-11 w-12 flex-col items-center justify-center rounded-2xl text-slate-600 hover:text-indigo-600 transition-all active:scale-95 dark:text-slate-400 dark:hover:text-indigo-400"
          aria-label="Account Settings"
        >
          <User className={`h-5 w-5 ${user ? 'text-emerald-500' : ''}`} />
          <span className="text-[10px] font-medium mt-0.5">{user ? 'Account' : 'Login'}</span>
        </button>
      </nav>
    </div>
  );
}
