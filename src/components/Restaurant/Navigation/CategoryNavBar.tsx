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
    <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none border-gray-200 dark:border-gray-700">
      {categories.map(g => (
        <button
          key={g.category}
          ref={activeCategory === g.category ? activeRef : null}
          onClick={() => onSelect(g.category)}
          className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${activeCategory === g.category
              ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
              : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
            }`}
        >
          {g.category}
        </button>
      ))}
    </div>
  );
}