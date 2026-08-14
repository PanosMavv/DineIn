'use client';

import { useRef, useEffect } from 'react';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onOpen: () => void;
  onClose: () => void;
  isOpen: boolean;
  items: { id: string; name: string; description?: string | null; price: number; category: string; image?: string | null }[];
}

export function SearchBox({ value, onChange, onOpen, onClose, isOpen, items }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('restaurant');

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={onOpen}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
        aria-label="Search menu"
      >
        <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <button onClick={onClose} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none"
              />
              {value && (
                <button onClick={() => onChange('')}><X className="w-4 h-4 text-gray-400" /></button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto px-4" style={{ maxHeight: 'calc(100vh - 60px)' }}>
            {value && items.length === 0 ? (
              <p className="text-center py-12 text-gray-500">{t('searchNotFound')}</p>
            ) : value ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {items.map(item => (
                  <div key={item.id} className="py-4 flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <span className="font-bold">€{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-gray-400">Start typing to search</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}