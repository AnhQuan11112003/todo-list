'use client';

import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, CheckCircle2, Clock, Flame, ArrowLeft, TrendingUp, Target, Award, Sparkles, Lightbulb } from 'lucide-react';
import Link from 'next/link';

export default function AnalyticsPage() {
  const { tasks, stats, allProjects, user, notificationPermission, requestPermission, signOut } =
    useTasks();

  const [period, setPeriod] = useState<'all' | 'today' | 'week'>('all');

  const filteredPeriodTasks = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    return tasks.filter((t) => {
      if (period === 'all') return true;
      if (!t.createdAt) return true;
      const createdDateStr = new Date(t.createdAt).toISOString().split('T')[0];
      if (period === 'today') return createdDateStr === todayStr;
      if (period === 'week') {
        const diffMs = now.getTime() - new Date(t.createdAt).getTime();
        return diffMs <= 7 * 24 * 60 * 60 * 1000;
      }
      return true;
    });
  }, [tasks, period]);

  const periodTotal = filteredPeriodTasks.length;
  const periodCompleted = filteredPeriodTasks.filter((t) => t.status === 'completed').length;
  const periodActive = periodTotal - periodCompleted;

  const completionRate = useMemo(() => {
    if (periodTotal === 0) return 0;
    return Math.round((periodCompleted / periodTotal) * 100);
  }, [periodTotal, periodCompleted]);

  // Project Breakdown
  const projectStats = useMemo(() => {
    const map: Record<string, { total: number; completed: number }> = {};
    filteredPeriodTasks.forEach((t) => {
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
  }, [filteredPeriodTasks]);

  // AI Advice based on completion rate
  const aiAdvice = useMemo(() => {
    if (periodTotal === 0) return 'Bắt đầu bằng việc thêm các công việc cần làm hôm nay!';
    if (completionRate >= 80)
      return '🔥 Tuyệt vời! Bạn đang duy trì phong độ làm việc và đạt hiệu suất vượt trội.';
    if (completionRate >= 50)
      return '💪 Tiến độ khá tốt! Hãy dùng tính năng Focus Timer để giải quyết nốt các task dở dang.';
    return '⏰ Đừng nản lòng! Ưu tiên giải quyết các công việc Ưu tiên cao trước.';
  }, [completionRate, periodTotal]);

  return (
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col">

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
        {/* Navigation Breadcrumb & Filter Period */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="glass-pill flex h-9 w-9 items-center justify-center text-slate-600 hover:text-indigo-600 dark:text-slate-300"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <h1 className="text-foreground text-2xl font-bold tracking-tight">📊 Thống kê &amp; Báo cáo Năng suất</h1>
              <p className="text-muted-foreground text-xs">Phân tích hiệu suất hoàn thành công việc</p>
            </div>
          </div>

          <div className="glass-pill flex p-1 self-start sm:self-auto border-white/60 dark:border-white/10">
            <button
              onClick={() => setPeriod('all')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                period === 'all'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Tất cả
            </button>
            <button
              onClick={() => setPeriod('today')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                period === 'today'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              Hôm nay
            </button>
            <button
              onClick={() => setPeriod('week')}
              className={`rounded-full px-3 py-1.5 text-xs font-bold transition-all ${
                period === 'week'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-muted-foreground'
              }`}
            >
              7 ngày qua
            </button>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="glass-card flex items-center gap-3.5 rounded-3xl p-4 sm:p-5 backdrop-blur-3xl shadow-xl border-indigo-500/30 bg-indigo-500/10">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-indigo-500 text-white">
            <Lightbulb className="h-5 w-5" />
          </div>
          <div>
            <div className="text-xs font-extrabold text-indigo-700 dark:text-indigo-300 flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Gợi ý Năng suất
            </div>
            <div className="text-xs sm:text-sm font-bold text-foreground mt-0.5">{aiAdvice}</div>
          </div>
        </div>

        {/* Top Highlight Metric Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{completionRate}%</div>
              <div className="text-xs font-semibold text-muted-foreground">Tỉ lệ hoàn thành</div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600">
              <Clock className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{periodActive}</div>
              <div className="text-xs font-semibold text-muted-foreground">Đang xử lý</div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-5 backdrop-blur-3xl shadow-xl flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-600">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-foreground">{periodCompleted}</div>
              <div className="text-xs font-semibold text-muted-foreground">Đã hoàn thành</div>
            </div>
          </div>

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

        {/* Progress Bar Card */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl backdrop-blur-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-foreground text-lg font-bold flex items-center gap-2">
              <Target className="h-5 w-5 text-indigo-500" /> Tiến độ Tổng quan
            </h2>
            <Badge className="bg-indigo-500/15 text-indigo-600">
              {periodCompleted} / {periodTotal} Task hoàn tất
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
