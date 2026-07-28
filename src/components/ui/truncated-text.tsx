'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';

export interface TruncatedTextProps {
  /** The text content to display and truncate */
  text: string;
  /** Maximum number of characters allowed before truncating (default: 100) */
  maxLength?: number;
  /** Label for expanding text (default: 'Show more') */
  showMoreText?: string;
  /** Label for collapsing text (default: 'Show less') */
  showLessText?: string;
  /** Custom ellipsis string (default: '...') */
  ellipsis?: string;
  /** Initial expansion state (default: false) */
  defaultExpanded?: boolean;
  /** Custom CSS classes for the text container */
  className?: string;
  /** Custom CSS classes for the toggle button */
  buttonClassName?: string;
  /** Whether to prevent click event propagation (useful inside cards) */
  stopPropagation?: boolean;
}

export function TruncatedText({
  text,
  maxLength = 100,
  showMoreText = 'Show more',
  showLessText = 'Show less',
  ellipsis = '...',
  defaultExpanded = false,
  className,
  buttonClassName,
  stopPropagation = true,
}: TruncatedTextProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  if (!text) return null;

  const isOverLimit = text.length > maxLength;
  const displayedText =
    isOverLimit && !isExpanded ? `${text.slice(0, maxLength).trimEnd()}${ellipsis}` : text;

  const toggleExpand = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (stopPropagation) {
      e.stopPropagation();
    }
    setIsExpanded((prev) => !prev);
  };

  return (
    <div className="w-full">
      <p className={cn('text-muted-foreground text-xs leading-relaxed break-words sm:text-sm', className)}>
        {displayedText}
      </p>
      {isOverLimit && (
        <button
          type="button"
          onClick={toggleExpand}
          className={cn(
            'mt-1 inline-block cursor-pointer text-xs font-semibold text-indigo-600 select-none hover:underline dark:text-indigo-400',
            buttonClassName
          )}
        >
          {isExpanded ? showLessText : showMoreText}
        </button>
      )}
    </div>
  );
}

// Alias export for alternate component name preferences
export { TruncatedText as ExpandableText };
