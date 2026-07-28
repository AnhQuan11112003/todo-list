'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FolderKanban, Tag as TagIcon, Plus, Trash2, X, Sparkles } from 'lucide-react';

interface ManageCategoriesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  allProjects: string[];
  allTags: string[];
  onAddProject: (name: string) => void;
  onDeleteProject: (name: string) => void;
  onAddTag: (name: string) => void;
  onDeleteTag: (name: string) => void;
}

export function ManageCategoriesDialog({
  open,
  onOpenChange,
  allProjects,
  allTags,
  onAddProject,
  onDeleteProject,
  onAddTag,
  onDeleteTag,
}: ManageCategoriesDialogProps) {
  const [newProject, setNewProject] = useState('');
  const [newTag, setNewTag] = useState('');

  const handleAddProject = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newProject.trim()) {
      onAddProject(newProject.trim());
      setNewProject('');
    }
  };

  const handleAddTag = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTag.trim()) {
      onAddTag(newTag.trim());
      setNewTag('');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-card z-50 max-h-[85vh] w-[94vw] max-w-[500px] overflow-y-auto rounded-3xl border-white/60 bg-white/95 p-6 shadow-2xl backdrop-blur-3xl dark:border-white/20 dark:bg-slate-900/95 sm:p-7">
        <DialogHeader className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400">
              <FolderKanban className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-foreground text-xl font-bold tracking-tight">
                Quản lý Dự án &amp; Tag
              </DialogTitle>
              <DialogDescription className="text-muted-foreground text-xs">
                Tạo mới hoặc xóa các dự án và thẻ gắn nhãn theo nhu cầu
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Projects Management Section */}
          <div className="space-y-3 rounded-2xl border border-white/50 bg-white/40 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <label className="text-foreground flex items-center gap-1.5 text-xs font-bold sm:text-sm">
                <FolderKanban className="h-4 w-4 text-indigo-500" />
                <span>Danh sách Dự án / Chủ đề ({allProjects.length})</span>
              </label>
            </div>

            {/* Quick Add Project */}
            <form onSubmit={handleAddProject} className="flex gap-2">
              <Input
                placeholder="Nhập tên dự án mới..."
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
                className="text-xs sm:text-sm"
              />
              <Button
                type="submit"
                disabled={!newProject.trim()}
                className="shrink-0 gap-1 rounded-xl bg-indigo-600 text-xs font-semibold text-white hover:bg-indigo-700"
              >
                <Plus className="h-4 w-4" /> Thêm
              </Button>
            </form>

            {/* Projects List */}
            <div className="max-h-40 space-y-1.5 overflow-y-auto pr-1">
              {allProjects.length > 0 ? (
                allProjects.map((p) => (
                  <div
                    key={p}
                    className="flex items-center justify-between rounded-xl border border-white/40 bg-white/60 px-3 py-2 text-xs backdrop-blur-md dark:border-white/10 dark:bg-slate-800/60"
                  >
                    <span className="font-semibold text-foreground truncate">📁 {p}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDeleteProject(p)}
                      className="h-7 w-7 rounded-lg p-0 text-rose-500 hover:bg-rose-500/15 hover:text-rose-600"
                      title={`Xóa dự án "${p}"`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-2 text-xs italic">
                  Chưa có dự án nào
                </p>
              )}
            </div>
          </div>

          {/* Tags Management Section */}
          <div className="space-y-3 rounded-2xl border border-white/50 bg-white/40 p-4 backdrop-blur-md dark:border-white/10 dark:bg-white/5">
            <div className="flex items-center justify-between">
              <label className="text-foreground flex items-center gap-1.5 text-xs font-bold sm:text-sm">
                <TagIcon className="h-4 w-4 text-purple-500" />
                <span>Danh sách Tag ({allTags.length})</span>
              </label>
            </div>

            {/* Quick Add Tag */}
            <form onSubmit={handleAddTag} className="flex gap-2">
              <Input
                placeholder="Nhập tên tag mới..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="text-xs sm:text-sm"
              />
              <Button
                type="submit"
                disabled={!newTag.trim()}
                className="shrink-0 gap-1 rounded-xl bg-purple-600 text-xs font-semibold text-white hover:bg-purple-700"
              >
                <Plus className="h-4 w-4" /> Thêm Tag
              </Button>
            </form>

            {/* Tags Chips List */}
            <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto p-1">
              {allTags.length > 0 ? (
                allTags.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="flex items-center gap-1.5 rounded-xl border-purple-500/20 bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-700 dark:text-purple-300"
                  >
                    <span>#{t}</span>
                    <button
                      type="button"
                      onClick={() => onDeleteTag(t)}
                      className="rounded-full hover:bg-rose-500/20 hover:text-rose-500"
                      title={`Xóa tag "#${t}"`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              ) : (
                <p className="text-muted-foreground text-center w-full py-2 text-xs italic">
                  Chưa có tag nào
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
