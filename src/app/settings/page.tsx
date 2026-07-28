'use client';

import { useState } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { AuthDialog } from '@/components/auth/AuthDialog';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Settings as SettingsIcon, Moon, Sun, Monitor, Bell, UserCheck, LogOut, Download, Upload, Trash2, ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { tasks, user, signOut, notificationPermission, requestPermission, addTask } = useTasks();
  const { theme, setTheme } = useTheme();
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Export JSON Backup
  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('Đã xuất tập tin sao lưu JSON thành công!');
  };

  // Import JSON Backup File
  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const importedTasks = JSON.parse(content);
        if (Array.isArray(importedTasks)) {
          let count = 0;
          for (const item of importedTasks) {
            if (item.title) {
              await addTask({
                title: item.title,
                description: item.description || '',
                status: item.status || 'todo',
                priority: item.priority || 'medium',
                dueDate: item.dueDate,
                project: item.project,
                tags: item.tags,
              });
              count++;
            }
          }
          toast.success(`Khôi phục thành công ${count} task từ tập tin sao lưu!`);
        } else {
          toast.error('Định dạng tập tin JSON không hợp lệ.');
        }
      } catch (err) {
        toast.error('Lỗi đọc tập tin JSON.');
      }
    };
    reader.readAsText(file);
  };

  // Clear Local Cache
  const handleClearCache = () => {
    if (confirm('Bạn có chắc chắn muốn xóa dữ liệu bộ nhớ tạm localStorage?')) {
      localStorage.clear();
      toast.success('Đã dọn dẹp bộ nhớ tạm localStorage!');
      window.location.reload();
    }
  };

  return (
    <div className="bg-aurora text-foreground relative flex min-h-screen flex-col">

      {/* Ambient Glass Orbs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-96 w-96 rounded-full bg-purple-500/20 blur-3xl" />

      <Header
        notificationPermission={notificationPermission}
        requestPermission={requestPermission}
        user={user}
        signOut={signOut}
        onOpenAuth={() => setIsAuthOpen(true)}
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
            <h1 className="text-foreground text-2xl font-bold tracking-tight">⚙️ Cài đặt &amp; Tùy chỉnh</h1>
            <p className="text-muted-foreground text-xs">Quản lý giao diện, tài khoản và sao lưu dữ liệu</p>
          </div>
        </div>

        {/* Account Section */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl backdrop-blur-3xl space-y-4">
          <h2 className="text-foreground text-base font-bold flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-indigo-500" /> Tài khoản Supabase Auth
          </h2>

          {user ? (
            <div className="flex items-center justify-between rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <div className="flex items-center gap-3">
                <UserCheck className="h-6 w-6 text-emerald-500" />
                <div>
                  <div className="font-bold text-sm text-foreground">{user.email}</div>
                  <div className="text-xs text-emerald-600 dark:text-emerald-400">☁️ Đã kết nối Supabase Cloud Database</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-rose-500 hover:bg-rose-500/10 text-xs font-semibold"
              >
                <LogOut className="mr-1 h-3.5 w-3.5" /> Đăng xuất
              </Button>
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-2xl border border-indigo-500/30 bg-indigo-500/10 p-4">
              <div>
                <div className="font-bold text-sm text-foreground">Chưa đăng nhập</div>
                <div className="text-xs text-muted-foreground">Đăng nhập để đồng bộ task trên mọi thiết bị</div>
              </div>
              <Button
                onClick={() => setIsAuthOpen(true)}
                className="rounded-xl bg-indigo-600 text-white text-xs font-semibold"
              >
                Đăng nhập / Đồng bộ
              </Button>
            </div>
          )}
        </div>

        {/* Theme Settings */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl backdrop-blur-3xl space-y-4">
          <h2 className="text-foreground text-base font-bold flex items-center gap-2">
            <Sun className="h-5 w-5 text-amber-500" /> Chế độ Giao diện (Theme)
          </h2>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('light')}
              className={`flex flex-col items-center justify-center rounded-2xl p-4 border transition-all ${
                theme === 'light'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 font-bold'
                  : 'border-white/60 bg-white/40 dark:border-white/10 dark:bg-white/5'
              }`}
            >
              <Sun className="h-6 w-6 mb-2 text-amber-500" />
              <span className="text-xs">Sáng (Light)</span>
            </button>

            <button
              onClick={() => setTheme('dark')}
              className={`flex flex-col items-center justify-center rounded-2xl p-4 border transition-all ${
                theme === 'dark'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 font-bold'
                  : 'border-white/60 bg-white/40 dark:border-white/10 dark:bg-white/5'
              }`}
            >
              <Moon className="h-6 w-6 mb-2 text-indigo-400" />
              <span className="text-xs">Tối (Dark)</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`flex flex-col items-center justify-center rounded-2xl p-4 border transition-all ${
                theme === 'system'
                  ? 'border-indigo-500 bg-indigo-500/15 text-indigo-600 font-bold'
                  : 'border-white/60 bg-white/40 dark:border-white/10 dark:bg-white/5'
              }`}
            >
              <Monitor className="h-6 w-6 mb-2 text-slate-500" />
              <span className="text-xs">Hệ thống</span>
            </button>
          </div>
        </div>

        {/* Data Backup & Export */}
        <div className="glass-card rounded-3xl p-6 shadow-2xl backdrop-blur-3xl space-y-4">
          <h2 className="text-foreground text-base font-bold flex items-center gap-2">
            <Download className="h-5 w-5 text-emerald-500" /> Sao lưu &amp; Phục hồi Dữ liệu
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Button
              onClick={handleExportData}
              className="rounded-2xl bg-emerald-600 text-white font-semibold text-xs py-3"
            >
              <Download className="mr-2 h-4 w-4" /> Xuất tập tin JSON ({tasks.length})
            </Button>

            <label className="flex items-center justify-center cursor-pointer rounded-2xl bg-indigo-600 text-white font-semibold text-xs py-3 px-4 shadow-md hover:bg-indigo-700 transition-all">
              <Upload className="mr-2 h-4 w-4" /> Nhập tập tin JSON
              <input type="file" accept=".json" onChange={handleImportFile} className="hidden" />
            </label>

            <Button
              variant="ghost"
              onClick={handleClearCache}
              className="rounded-2xl border border-rose-500/30 text-rose-500 hover:bg-rose-500/10 font-semibold text-xs py-3"
            >
              <Trash2 className="mr-2 h-4 w-4" /> Dọn dẹp Bộ nhớ Tạm
            </Button>
          </div>
        </div>
      </main>

      <AuthDialog open={isAuthOpen} onOpenChange={setIsAuthOpen} />
      <MobileBottomNav user={user} />
    </div>
  );
}
