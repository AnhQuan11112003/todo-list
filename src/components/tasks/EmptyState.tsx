'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ClipboardList, PlusCircle, SearchX } from 'lucide-react';

interface EmptyStateProps {
  hasFilters: boolean;
  onCreateTask: () => void;
  onResetFilters: () => void;
}

export function EmptyState({ hasFilters, onCreateTask, onResetFilters }: EmptyStateProps) {
  return (
    <Card className="border-border/80 bg-muted/20 my-6 border-2 border-dashed">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center sm:p-12">
        <div className="bg-primary/10 text-primary mb-4 flex h-16 w-16 items-center justify-center rounded-full">
          {hasFilters ? (
            <SearchX className="text-muted-foreground h-8 w-8" />
          ) : (
            <ClipboardList className="text-primary h-8 w-8" />
          )}
        </div>

        <h3 className="text-foreground text-lg font-semibold sm:text-xl">
          {hasFilters ? 'No matching tasks found' : 'No tasks created yet'}
        </h3>

        <p className="text-muted-foreground mt-1 max-w-sm text-sm">
          {hasFilters
            ? 'No tasks match your current search query or filter selections. Try adjusting your search term or clearing filters.'
            : 'Get started by creating your first task to keep track of your work, goals, and to-do items.'}
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {hasFilters ? (
            <Button variant="outline" onClick={onResetFilters}>
              Clear All Filters
            </Button>
          ) : (
            <Button onClick={onCreateTask} className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              Create First Task
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
