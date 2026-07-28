'use client';

import { useState, useMemo } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock, FolderKanban, CheckCircle2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function CalendarPage() {
  const { tasks, user, notificationPermission, requestPermission, signOut } = useTasks();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
  ];

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Group tasks by Date YYYY-MM-DD
  const tasksByDate = useMemo(() => {
    const map: Record<string, typeof tasks> = {};
    tasks.forEach((t) => {
      if (t.dueDate) {
        const dateKey = new Date(t.dueDate).toISOString().split('T')[0];
        if (!map[dateKey]) map[dateKey] = [];
        map[dateKey].push(t);
      }
    });
    return map;
  }, [tasks]);

  const selectedTasks = tasksByDate[selectedDateStr] || [];

  return (
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient Glass Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />

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
            <h1 className="text-foreground text-2xl font-bold tracking-tight">📅 Lịch công việc</h1>
            <p className="text-muted-foreground text-xs">Theo dõi tiến độ và hạn chót theo lịch trình</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* Calendar Widget (8 Cols) */}
          <div className="glass-card rounded-3xl p-5 shadow-2xl backdrop-blur-3xl lg:col-span-7">
            {/* Month Switcher Header */}
            <div className="flex items-center justify-between pb-4">
              <h2 className="text-foreground text-lg font-extrabold">
                {monthNames[month]} {year}
              </h2>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={prevMonth}
                  className="h-8 w-8 rounded-full p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="glass-pill px-2.5 py-1 text-xs font-semibold"
                >
                  Hôm nay
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={nextMonth}
                  className="h-8 w-8 rounded-full p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Weekdays Header */}
            <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-muted-foreground py-2">
              <span>CN</span>
              <span>T2</span>
              <span>T3</span>
              <span>T4</span>
              <span>T5</span>
              <span>T6</span>
              <span>T7</span>
            </div>

            {/* Calendar Days Grid */}
            <div className="grid grid-cols-7 gap-1.5 pt-1">
              {/* Empty padding days before start of month */}
              {Array.from({ length: firstDayIndex }).map((_, i) => (
                <div key={`empty-${i}`} className="h-12 rounded-2xl opacity-20" />
              ))}

              {/* Month days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const d = new Date(year, month, dayNum);
                const dateISO = d.toISOString().split('T')[0];
                const dayTasks = tasksByDate[dateISO] || [];
                const isSelected = selectedDateStr === dateISO;
                const isToday = new Date().toISOString().split('T')[0] === dateISO;

                return (
                  <button
                    key={dateISO}
                    onClick={() => setSelectedDateStr(dateISO)}
                    className={`flex h-12 flex-col items-center justify-between rounded-2xl p-1.5 transition-all active:scale-95 ${
                      isSelected
                        ? 'bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                        : isToday
                          ? 'border-2 border-indigo-500/60 bg-indigo-500/10 font-bold'
                          : 'hover:bg-white/40 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="text-xs font-bold">{dayNum}</span>
                    <div className="flex gap-1">
                      {dayTasks.slice(0, 3).map((t) => (
                        <span
                          key={t.id}
                          className={`h-1.5 w-1.5 rounded-full ${
                            t.priority === 'high'
                              ? 'bg-rose-500'
                              : t.priority === 'medium'
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                          }`}
                        />
                      ))}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected Date Tasks List (5 Cols) */}
          <div className="glass-card rounded-3xl p-5 shadow-2xl backdrop-blur-3xl lg:col-span-5">
            <h3 className="text-foreground flex items-center justify-between text-base font-bold pb-3 border-b border-white/40 dark:border-white/10">
              <span>Công việc ngày {selectedDateStr}</span>
              <Badge className="bg-indigo-500/15 text-indigo-600 border-indigo-500/30">
                {selectedTasks.length} task
              </Badge>
            </h3>

            <div className="mt-4 space-y-3 max-h-[400px] overflow-y-auto pr-1">
              {selectedTasks.length > 0 ? (
                selectedTasks.map((t) => (
                  <div
                    key={t.id}
                    className="rounded-2xl border border-white/50 bg-white/60 p-3.5 shadow-sm backdrop-blur-md dark:border-white/10 dark:bg-slate-800/60"
                  >
                    <div className="flex items-start justify-between">
                      <h4 className="font-bold text-sm text-foreground">{t.title}</h4>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${
                          t.status === 'completed'
                            ? 'bg-emerald-500/15 text-emerald-600'
                            : 'bg-indigo-500/15 text-indigo-600'
                        }`}
                      >
                        {t.status}
                      </Badge>
                    </div>
                    {t.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {t.description}
                      </p>
                    )}
                    {t.project && (
                      <div className="mt-2 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">
                        📁 {t.project}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground text-xs italic">
                  Không có công việc nào trong ngày này.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <MobileBottomNav user={user} />
    </div>
  );
}
