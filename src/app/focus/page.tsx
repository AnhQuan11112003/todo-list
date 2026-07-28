'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Flame, Play, Pause, RotateCcw, CheckCircle2, ArrowLeft, Coffee, Brain, Volume2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

const STREAK_STORAGE_KEY = 'todo_app_focus_streak_v1';

export default function FocusPage() {
  const { tasks, toggleTaskStatus, user, notificationPermission, requestPermission, signOut } =
    useTasks();

  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [totalSeconds, setTotalSeconds] = useState(25 * 60);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [completedSessions, setCompletedSessions] = useState(0);

  // Load saved streak
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STREAK_STORAGE_KEY);
      if (saved) setCompletedSessions(parseInt(saved, 10) || 0);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const activeTasks = tasks.filter((t) => t.status !== 'completed');

  // Web Audio Chime Sound for Timer completion
  const playCompletionChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.5); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (err) {
      console.error('Audio play failed:', err);
    }
  }, []);

  // Change Timer Mode
  const handleModeChange = (newMode: 'focus' | 'short' | 'long') => {
    setMode(newMode);
    setIsRunning(false);
    let seconds = 25 * 60;
    if (newMode === 'focus') seconds = 25 * 60;
    if (newMode === 'short') seconds = 5 * 60;
    if (newMode === 'long') seconds = 15 * 60;
    setTotalSeconds(seconds);
    setTimeLeft(seconds);
  };

  // Timer countdown effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      playCompletionChime();

      if (mode === 'focus') {
        setCompletedSessions((prev) => {
          const next = prev + 1;
          try {
            localStorage.setItem(STREAK_STORAGE_KEY, next.toString());
          } catch (e) {}
          return next;
        });
        toast.success('🎉 Hoàn thành phiên tập trung 25 phút!');
      } else {
        toast.info('Hết giờ nghỉ giải lao. Sẵn sàng tập trung tiếp!');
      }
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, mode, playCompletionChime]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formatTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const progressPercent = Math.round(((totalSeconds - timeLeft) / totalSeconds) * 100);
  const selectedTask = tasks.find((t) => t.id === selectedTaskId);

  return (
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col overflow-hidden">
      {/* Ambient Glass Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />

      <Header
        notificationPermission={notificationPermission}
        requestPermission={requestPermission}
        user={user}
        signOut={signOut}
      />

      <main className="relative z-10 mx-auto w-full max-w-4xl flex-1 space-y-6 px-4 py-6 pb-24 sm:pb-8 sm:px-6">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="glass-pill flex h-9 w-9 items-center justify-center text-slate-600 hover:text-indigo-600 dark:text-slate-300"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="text-foreground text-2xl font-bold tracking-tight">🏆 Đồng hồ Tập trung (Pomodoro)</h1>
            <p className="text-muted-foreground text-xs">Loại bỏ xao nhãng và theo dõi tiến độ thời gian làm việc</p>
          </div>
        </div>

        {/* Main Focus Card */}
        <div className="glass-card flex flex-col items-center justify-center rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-3xl space-y-6">
          {/* Mode Tabs */}
          <div className="glass-pill flex p-1 border-white/60 dark:border-white/10">
            <button
              onClick={() => handleModeChange('focus')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                mode === 'focus'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-muted-foreground'
              }`}
            >
              <Brain className="h-3.5 w-3.5" /> Tập trung (25m)
            </button>
            <button
              onClick={() => handleModeChange('short')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                mode === 'short'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md'
                  : 'text-muted-foreground'
              }`}
            >
              <Coffee className="h-3.5 w-3.5" /> Nghỉ ngắn (5m)
            </button>
            <button
              onClick={() => handleModeChange('long')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-all ${
                mode === 'long'
                  ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md'
                  : 'text-muted-foreground'
              }`}
            >
              <Coffee className="h-3.5 w-3.5" /> Nghỉ dài (15m)
            </button>
          </div>

          {/* Task Select for Focus */}
          <div className="w-full max-w-sm">
            <label className="text-muted-foreground block text-center text-xs font-medium mb-1.5">
              Chọn công việc bạn muốn thực hiện trong phiên này:
            </label>
            <Select value={selectedTaskId} onValueChange={(val) => setSelectedTaskId(val || '')}>
              <SelectTrigger className="glass-card rounded-2xl border-white/60 bg-white/50 text-xs sm:text-sm">
                <SelectValue placeholder="-- Chọn công việc từ danh sách --" />
              </SelectTrigger>
              <SelectContent className="z-50 rounded-2xl bg-white/95 backdrop-blur-2xl dark:bg-slate-900/95">
                {activeTasks.map((t) => (
                  <SelectItem key={t.id} value={t.id} className="text-xs sm:text-sm">
                    {t.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Big Timer Display Ring with Animated Progress Circle */}
          <div className="relative flex h-64 w-64 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-4 backdrop-blur-2xl border-4 border-white/40 shadow-inner">
            <svg className="absolute inset-0 h-full w-full -rotate-90 p-1" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-slate-200/40 dark:stroke-slate-800/40"
                strokeWidth="4"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                className="stroke-indigo-500 transition-all duration-1000"
                strokeWidth="5"
                strokeDasharray="283"
                strokeDashoffset={283 - (283 * progressPercent) / 100}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="text-center z-10">
              <div className="text-5xl sm:text-6xl font-black tracking-tight text-foreground font-mono">
                {formatTime}
              </div>
              <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mt-2 flex items-center justify-center gap-1">
                <Flame className="h-4 w-4 text-amber-500 animate-bounce" />
                <span>{completedSessions} phiên hoàn thành</span>
              </div>
            </div>
          </div>

          {/* Timer Controls */}
          <div className="flex items-center gap-3">
            <Button
              size="lg"
              onClick={() => setIsRunning(!isRunning)}
              className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-6 text-base font-bold text-white shadow-xl shadow-indigo-500/30 transition-transform active:scale-95"
            >
              {isRunning ? (
                <>
                  <Pause className="mr-2 h-5 w-5" /> Tạm dừng
                </>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" /> Bắt đầu
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => handleModeChange(mode)}
              className="glass-pill h-12 w-12 rounded-full"
              title="Đặt lại"
            >
              <RotateCcw className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={playCompletionChime}
              className="glass-pill h-12 w-12 rounded-full text-indigo-500"
              title="Thử âm thanh"
            >
              <Volume2 className="h-5 w-5" />
            </Button>
          </div>

          {/* Active Selected Task Card */}
          {selectedTask && (
            <div className="w-full max-w-md rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-indigo-600">Đang thực hiện:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    toggleTaskStatus(selectedTask.id);
                    toast.success('Đã hoàn thành công việc!');
                  }}
                  className="text-xs text-emerald-600 hover:bg-emerald-500/10 font-bold"
                >
                  <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> Đánh dấu Hoàn thành
                </Button>
              </div>
              <p className="text-sm font-bold text-foreground mt-1">{selectedTask.title}</p>
            </div>
          )}
        </div>
      </main>

      <MobileBottomNav user={user} />
    </div>
  );
}
