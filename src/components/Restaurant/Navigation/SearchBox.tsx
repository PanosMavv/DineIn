'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import type { MenuItem } from '@/lib/utils';
import { ImageMenuItem } from '@/components/Restaurant/Content/ImageMenuItem';

interface Props {
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function SearchBox({ groupedMenu }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('restaurant');

  useEffect(() => {
    if (isOpen && inputRef.current) inputRef.current.focus();
  }, [isOpen]);

  const closeSearch = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return groupedMenu
      .flatMap((group) => group.items)
      .filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      .slice(0, 50);
  }, [groupedMenu, searchQuery]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
        aria-label="Search menu"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="absolute min-h-screen inset-0 z-40 bg-white dark:bg-gray-950 flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 shrink-0">
            <button
              onClick={closeSearch}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="shrink-0">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {searchQuery && filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t('searchNotFound')}</p>
              </div>
            ) : searchQuery ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800 px-4">
                {filteredItems.map((item) => (
                  <ImageMenuItem key={item.id} item={item} showImage={true} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-400 dark:text-gray-500">Start typing to search the menu</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}