'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { LogIn, UserPlus, Loader2, Sparkles, Lock, Mail } from 'lucide-react';

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error('Vui lòng nhập Email và Mật khẩu.');
      return;
    }

    const isPlaceholderUrl =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('xyzcompany.supabase.co') ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('your-project-id');

    if (isPlaceholderUrl) {
      toast.error('Chưa cấu hình Supabase!', {
        description:
          'Vui lòng dán URL và Anon Key dự án Supabase thực tế vào file .env.local trong thư mục nguồn.',
      });
      setLoading(false);
      return;
    }

    setLoading(true);


    try {
      if (tab === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          toast.error(`Đăng nhập thất bại: ${error.message}`);
        } else {
          toast.success('Đăng nhập thành công!');
          onOpenChange(false);
          onSuccess?.();
        }
      } else {
        const { error, data } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });

        if (error) {
          toast.error(`Đăng ký thất bại: ${error.message}`);
        } else {
          if (data.session) {
            toast.success('Tạo tài khoản & Đăng nhập thành công!');
          } else {
            toast.success('Đã gửi email xác nhận. Vui lòng kiểm tra hộp thư của bạn!');
          }
          onOpenChange(false);
          onSuccess?.();
        }
      }
    } catch (err: any) {
      toast.error(`Lỗi hệ thống: ${err.message || err}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card z-50 max-w-md rounded-3xl border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95 sm:p-7">
        <DialogHeader className="space-y-2 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-6 w-6" />
          </div>
          <DialogTitle className="text-foreground text-xl font-bold tracking-tight">
            Xác thực Supabase Auth
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-xs">
            Đăng nhập để đồng bộ task trực tiếp lên Supabase Cloud
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={(v) => setTab(v as 'signin' | 'signup')}
          className="mt-2 w-full"
        >
          <TabsList className="glass-card grid w-full grid-cols-2 rounded-2xl p-1">
            <TabsTrigger
              value="signin"
              className="rounded-xl py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
            >
              <LogIn className="mr-1.5 h-3.5 w-3.5" />
              Đăng nhập
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="rounded-xl py-2 text-xs font-semibold data-[state=active]:bg-white data-[state=active]:shadow-md dark:data-[state=active]:bg-slate-800"
            >
              <UserPlus className="mr-1.5 h-3.5 w-3.5" />
              Đăng ký
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <form onSubmit={handleAuth} className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
              <Mail className="h-3.5 w-3.5 text-indigo-500" /> Email
            </label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-foreground flex items-center gap-1.5 text-xs font-semibold">
              <Lock className="h-3.5 w-3.5 text-purple-500" /> Mật khẩu
            </label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="rounded-xl text-sm"
            />
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-2.5 font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-95"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Đang xử lý...
              </span>
            ) : tab === 'signin' ? (
              'Đăng nhập Supabase'
            ) : (
              'Tạo tài khoản mới'
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
