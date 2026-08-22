'use client';

import { useState, useEffect, useRef } from 'react';
import type { MenuItem } from '@/lib/utils';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function FastFoodMenu({ restaurant, groupedMenu }: Props) {
  const [activeCategory, setActiveCategory] = useState('deals');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  const t = useTranslations('restaurant');

  const allItems = groupedMenu.flatMap(g => g.items.map(item => ({ ...item, categoryName: g.category })));

  const allCategories = [...groupedMenu];

  const scrollTo = (category: string) => {
    setActiveCategory(category);
    document.getElementById(category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isSearchOpen]);

  const filteredItems = searchQuery.trim()
    ? allItems.filter(item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  // Detect which category is in view
  useEffect(() => {
    const handleScroll = () => {
      const offsets = allCategories.map(cat => {
        const el = document.getElementById(cat.category);
        return { category: cat.category, top: el ? el.offsetTop : Infinity };
      });

      const scrollY = window.scrollY + 120;
      let current = allCategories[0]?.category || 'deals';

      for (let i = offsets.length - 1; i >= 0; i--) {
        if (offsets[i].top <= scrollY) {
          current = offsets[i].category;
          break;
        }
      }
      setActiveCategory(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [allCategories]);

  // Auto-scroll active pill into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-orange-50 dark:bg-gray-950">
      {/* ==================== TOP BAR ==================== */}
      <div className="sticky top-0 z-30 bg-white dark:bg-gray-900 shadow-sm max-w-2xl mx-auto">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">{restaurant.name}</h2>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ==================== CATEGORY PILLS ==================== */}
      <div className="sticky top-12 z-20 bg-white dark:bg-gray-950 px-4 py-3 max-w-2xl mx-auto">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {allCategories.map(cat => (
            <button
              key={cat.category}
              ref={activeCategory === cat.category ? activeRef : null}
              onClick={() => scrollTo(cat.category)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat.category
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      {/* ==================== CONTENT ==================== */}
      <div className="px-4 pb-12">

        {/* Menu Categories */}
        {groupedMenu.map(g => (
          <div key={g.category} id={g.category} className="scroll-mt-22.5 mb-6">
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-3">{g.category}</h3>
            <div className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
              {g.items.map(item => (
                <div key={item.id} className="py-4 px-4 flex gap-3">
                  {/* Text content on left */}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-gray-900 dark:text-gray-100">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{item.description}</p>
                    )}
                    {/* Price under description */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-bold text-orange-500">€{item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-xs line-through text-gray-400">€{item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  {/* Image */}
                  <div className="w-24 h-24 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xl overflow-hidden">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} width={88} height={88} className="object-cover w-full h-full rounded-xl" unoptimized />
                    ) : (
                      '🍽️'
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ==================== SEARCH OVERLAY ==================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white dark:bg-gray-950">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <button onClick={() => setIsSearchOpen(false)} className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 dark:text-gray-100 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')}><X className="w-4 h-4 text-gray-400" /></button>
              )}
            </div>
          </div>
          <div className="overflow-y-auto px-4" style={{ maxHeight: 'calc(100vh - 60px)' }}>
            {searchQuery && filteredItems.length === 0 ? (
              <p className="text-center py-12 text-gray-500">{t('searchNotFound')}</p>
            ) : searchQuery ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredItems.map(item => (
                  <div key={item.id} className="py-4 flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xl">
                      {item.image ? <Image src={item.image} alt="" width={48} height={48} className="object-cover w-full h-full rounded-lg" unoptimized /> : '🍽️'}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm">{item.name}</h3>
                      <p className="text-xs text-gray-400">{item.category}</p>
                    </div>
                    <span className="font-bold text-orange-500">€{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-gray-400">Start typing to search</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}