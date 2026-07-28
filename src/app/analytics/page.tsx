'use client';

import { useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Badge } from '@/components/ui/badge';
import { BarChart3, CheckCircle2, Clock, CircleAlert, Flame, ArrowLeft, TrendingUp, Target, Award } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { tasks, stats, allProjects, user, notificationPermission, requestPermission, signOut } =
    useTasks();

  const completionRate = useMemo(() => {
    if (stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  }, [stats]);

  // Project Breakdown
  const projectStats = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    tasks.forEach((t) => {
      const proj = t.project || 'Chưa phân loại';
      if (!map[proj]) map[proj] = { total: 0, completed: 0 };
      map[proj].total += 1;
      if (t.status === 'completed') map[proj].completed += 1;
    });
    return Object.entries(map).map(([name, data]) => ({
      name,
      ...data,
      rate: Math.round((data.completed / data.total) * 100),
    }));
  }, [tasks]);

  return (
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient Glass Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <Header
        notificationPermission={notificationPermission}
        requestPermission={requestPermission}
        user={user}
        signOut={signOut}
      />

      <main className="relative z-10 mx-auto w-full max-w-7xl flex-1 space-y-6 px-4 py-6 pb-24 sm:pb-8 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="glass-pill flex h-9 w-9 items-center justify-center text-slate-600 hover:text-indigo-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">📊 Thống kê &amp; Báo cáo Năng suất</h1>
            <p className="text-muted-foreground text-xs">Theo dõi hiệu suất và tỉ lệ hoàn thành công việc</p>
          </div>
        </div>

        {/* Top Highlight Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Rate */}
          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{completionRate}%</div>
              <div className="text-xs font-semibold text-muted-foreground">Tỉ lệ hoàn thành</div>
            </div>
          </div>

          {/* Active */}
          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{stats.active}</div>
              <div className="text-xs font-semibold text-muted-foreground">Công việc đang thực hiện</div>
            </div>
          </div>

          {/* Completed */}
          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{stats.completed}</div>
              <div className="text-xs font-semibold text-muted-foreground">Đã hoàn thành</div>
            </div>
          </div>

          {/* High Priority */}
          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600">
              <Flame className="h-6 w-6 text-rose-500" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{stats.highPriority}</div>
              <div className="text-xs font-semibold text-muted-foreground">Task Ưu tiên cao</div>
            </div>
          </div>
        </div>

        {/* Big Progress Bar Card */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl backdrop-blur-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-lg font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" /> Tiền độ Tổng quan
            </h2>
            <Badge className="bg-indigo-500/15 text-indigo-600">
              {stats.completed} / {stats.total} Task hoàn tất
            </Badge>
          </div>

          <div className="h-4 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>

        {/* Project Breakdown Cards */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl backdrop-blur-3xl space-y-4">
          <h2 className="text-foreground text-lg font-bold flex items-center gap-2">
            <Award className="h-5 w-5 text-purple-500" /> Phân tích theo Dự án / Chủ đề
          </h2>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {projectStats.map((p) => (
              <div
                key={p.name}
                className="rounded-2xl border border-white/50 bg-white/40 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-foreground">📁 {p.name}</span>
                  <span className="text-xs font-bold text-indigo-600">{p.rate}%</span>
                </div>
                <div className="text-xs text-muted-foreground">
                  {p.completed} / {p.total} task hoàn thành
                </div>
                <div className="h-2 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${p.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <MobileBottomNav user={user} />
    </div>
  );
}
