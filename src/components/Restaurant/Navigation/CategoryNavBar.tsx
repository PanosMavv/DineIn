'use client';

import { useEffect } from 'react';

interface Props {
  categories: { category: string }[];
  activeCategory: string;
  onSelect: (category: string) => void;
  activeRef: React.RefObject<HTMLButtonElement | null>;
}

export function CategoryNavBar({ categories, activeCategory, onSelect, activeRef }: Props) {
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory, activeRef]);

  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none border-hairline">
      {categories.map(g => {
        const isActive = activeCategory === g.category;
        return (
          <button
            key={g.category}
            ref={isActive ? activeRef : null}
            onClick={() => onSelect(g.category)}
            className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${isActive
              ? 'bg-ink text-surface border-ink'
              : 'bg-surface text-ink-muted border-hairline'
              }`}
          >
            {g.category}
          </button>
        );
      })}
    </div>
  );
}