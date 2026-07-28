'use client';

import { useState } from 'react';
import { SnoozeDuration, Task } from '@/types/task';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Clock, AlarmClock, Sparkles, Sun, Moon, CalendarDays, Sunset } from 'lucide-react';

interface SnoozeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onSnooze: (taskId: string, duration: SnoozeDuration | number) => void;
}

const QUICK_PRESETS: { label: string; value: SnoozeDuration; icon: string }[] = [
  { label: '10 Minutes', value: '10m', icon: '⚡' },
  { label: '30 Minutes', value: '30m', icon: '☕' },
  { label: '1 Hour', value: '1h', icon: '⌛' },
  { label: '2 Hours', value: '2h', icon: '⏱️' },
  { label: '4 Hours', value: '4h', icon: '⏳' },
];

const SMART_PRESETS: { label: string; detail: string; value: SnoozeDuration; icon: React.ReactNode }[] = [
  { label: 'Tonight', detail: '8:00 PM', value: 'tonight', icon: <Moon className="h-4 w-4 text-purple-400" /> },
  { label: 'Tomorrow Morning', detail: '9:00 AM', value: 'tomorrow-morning', icon: <Sun className="h-4 w-4 text-amber-500" /> },
  { label: 'Tomorrow Afternoon', detail: '2:00 PM', value: 'tomorrow-afternoon', icon: <Sunset className="h-4 w-4 text-orange-400" /> },
  { label: 'Next Week', detail: 'Mon 9:00 AM', value: 'next-week', icon: <CalendarDays className="h-4 w-4 text-indigo-400" /> },
];

export function SnoozeDialog({ open, onOpenChange, task, onSnooze }: SnoozeDialogProps) {
  const [selectedPreset, setSelectedPreset] = useState<SnoozeDuration | 'custom'>('30m');
  const [customMinutes, setCustomMinutes] = useState<string>('45');

  if (!task) return null;

  const handleConfirm = () => {
    if (selectedPreset === 'custom') {
      const minutes = parseInt(customMinutes, 10);
      if (!isNaN(minutes) && minutes > 0) {
        onSnooze(task.id, minutes);
      } else {
        onSnooze(task.id, 30);
      }
    } else {
      onSnooze(task.id, selectedPreset);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="z-50 max-w-lg rounded-3xl border border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95 sm:p-7">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400">
              <AlarmClock className="h-6 w-6 animate-pulse" />
            </div>
            <div>
              <DialogTitle className="text-foreground text-xl font-bold tracking-tight">
                Hoãn thông báo (Snooze)
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Chọn mốc thời gian hoãn nhắc nhở phù hợp với bạn
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Task Title Banner */}
        <div className="my-1 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 backdrop-blur-md">
          <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider">
            Công việc hoãn
          </p>
          <p className="text-foreground line-clamp-1 text-sm font-bold tracking-tight">
            {task.title}
          </p>
        </div>

        <div className="space-y-4 py-1">
          {/* Quick Duration Presets */}
          <div>
            <label className="text-muted-foreground mb-2 block flex items-center gap-1.5 text-xs font-semibold">
              <Clock className="h-3.5 w-3.5 text-indigo-500" />
              <span>Các mốc thời gian ngắn</span>
            </label>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5">
              {QUICK_PRESETS.map((option) => {
                const isSelected = selectedPreset === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedPreset(option.value)}
                    className={`flex flex-col items-center justify-center rounded-2xl border p-2.5 text-center transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 shadow-md dark:bg-indigo-500/25 dark:text-indigo-300 font-bold scale-[1.03]'
                        : 'border-white/50 bg-white/40 text-foreground hover:bg-white/70 dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10'
                    }`}
                  >
                    <span className="text-base">{option.icon}</span>
                    <span className="mt-1 text-[11px] font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Smart Target Time Presets */}
          <div>
            <label className="text-muted-foreground mb-2 block flex items-center gap-1.5 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Mốc thời điểm cố định</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SMART_PRESETS.map((option) => {
                const isSelected = selectedPreset === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedPreset(option.value)}
                    className={`flex items-center justify-between rounded-2xl border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 shadow-md dark:bg-indigo-500/25 dark:text-indigo-300 font-bold'
                        : 'border-white/50 bg-white/40 text-foreground hover:bg-white/70 dark:border-white/10 dark:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/50 dark:bg-slate-800/50">
                        {option.icon}
                      </div>
                      <div>
                        <p className="text-xs font-semibold">{option.label}</p>
                        <p className="text-muted-foreground text-[10px]">{option.detail}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Custom Duration Option */}
          <div>
            <button
              type="button"
              onClick={() => setSelectedPreset('custom')}
              className={`flex w-full items-center justify-between rounded-2xl border p-3 text-xs transition-all ${
                selectedPreset === 'custom'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/25 dark:text-indigo-300 font-bold'
                  : 'border-white/50 bg-white/40 text-foreground hover:bg-white/70 dark:border-white/10 dark:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-indigo-500" />
                <span>Số phút tùy chỉnh</span>
              </div>
              <span className="font-semibold">{selectedPreset === 'custom' ? 'Đã chọn' : 'Tùy chỉnh'}</span>
            </button>

            {selectedPreset === 'custom' && (
              <div className="mt-2.5 flex items-center gap-2">
                <Input
                  type="number"
                  min="1"
                  max="10080"
                  value={customMinutes}
                  onChange={(e) => setCustomMinutes(e.target.value)}
                  placeholder="Nhập số phút (ví dụ: 45)"
                  className="rounded-xl border-indigo-500/40 bg-white/60 text-sm backdrop-blur-md dark:bg-slate-900/60"
                />
                <span className="text-muted-foreground text-xs whitespace-nowrap font-medium">phút</span>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Hủy
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            className="rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-white shadow-lg shadow-amber-500/20 hover:scale-105"
          >
            <AlarmClock className="mr-1.5 h-4 w-4" />
            Xác nhận hoãn
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
