'use client';

import { useState, useEffect, useRef } from 'react';
import type { MenuItem } from '@/lib/utils';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useScrollTarget } from '@/components/Restaurant/useScrollTarget';
import { HeroPicker } from '@/components/Restaurant/Heros/HeroPicker';

interface Props {
  restaurant: { name: string; description?: string | null; category?: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function FastFoodMenu({ restaurant, groupedMenu }: Props) {
  const [activeCategory, setActiveCategory] = useState(groupedMenu[0]?.category || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  const t = useTranslations('restaurant');
  const { getScrollTop, scrollTo, onScroll } = useScrollTarget();

  const allItems = groupedMenu.flatMap((g) =>
    g.items.map((item) => ({ ...item, categoryName: g.category }))
  );

  const goTo = (category: string) => {
    setActiveCategory(category);
    const el = categoryRefs.current.get(category);
    if (el) scrollTo(el);
  };

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  const filteredItems = searchQuery.trim()
    ? allItems.filter(
      (item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    : [];

  useEffect(() => {
    const handler = () => {
      const scrollY = getScrollTop() + 120;
      let current = groupedMenu[0]?.category || '';
      for (let i = groupedMenu.length - 1; i >= 0; i--) {
        const el = categoryRefs.current.get(groupedMenu[i].category);
        if (el && el.offsetTop <= scrollY) {
          current = groupedMenu[i].category;
          break;
        }
      }
      setActiveCategory(current);
    };

    const sub = onScroll(handler);
    sub.add();
    handler();
    return () => sub.remove();
  }, [groupedMenu, getScrollTop, onScroll]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  return (
    <div className="min-h-full bg-surface relative">
      <HeroPicker restaurant={restaurant} />

      <div className="sticky top-0 z-30 bg-surface shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <h2 className="text-sm font-bold text-ink truncate">{restaurant.name}</h2>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-8 h-8 flex items-center justify-center rounded-full bg-accent-brand text-white"
            aria-label="Search menu"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="sticky top-12 z-20 bg-surface px-4 py-3">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {groupedMenu.map((cat) => (
            <button
              key={cat.category}
              ref={activeCategory === cat.category ? activeRef : null}
              onClick={() => goTo(cat.category)}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold transition-all ${activeCategory === cat.category
                  ? 'bg-accent-brand text-white shadow-lg shadow-accent-brand/30'
                  : 'bg-surface-2 text-ink-muted'
                }`}
            >
              {cat.category}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 pb-12">
        {groupedMenu.map((g) => (
          <div
            key={g.category}
            ref={(el) => {
              if (el) categoryRefs.current.set(g.category, el);
              else categoryRefs.current.delete(g.category);
            }}
            className="scroll-mt-24 mb-6"
          >
            <h3 className="font-bold text-lg text-ink mb-3">{g.category}</h3>
            <div className="divide-y divide-hairline bg-surface rounded-2xl border border-hairline overflow-hidden">
              {g.items.map((item) => (
                <div key={item.id} className="py-4 px-4 flex gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-base font-bold text-ink">{item.name}</h4>
                    {item.description && (
                      <p className="text-sm text-ink-muted mt-0.5">{item.description}</p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-base font-bold text-accent-brand">€{item.price.toFixed(2)}</span>
                      {item.originalPrice && (
                        <span className="text-xs line-through text-ink-subtle">€{item.originalPrice.toFixed(2)}</span>
                      )}
                    </div>
                  </div>
                  <div className="w-24 h-24 rounded-xl bg-surface-2 flex items-center justify-center shrink-0 text-xl overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={88}
                        height={88}
                        className="object-cover w-full h-full rounded-xl"
                        unoptimized
                      />
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

      {isSearchOpen && (
        <div className="absolute inset-0 z-40 bg-surface flex flex-col">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-hairline">
            <button
              onClick={() => setIsSearchOpen(false)}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-surface-2"
              aria-label="Close search"
            >
              <ArrowLeft className="w-5 h-5 text-ink-muted" />
            </button>
            <div className="flex-1 flex items-center gap-2 bg-surface-2 rounded-full px-4 py-2">
              <Search className="w-4 h-4 text-ink-subtle shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('searchPlaceholder')}
                className="flex-1 min-w-0 bg-transparent text-sm text-ink outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} aria-label="Clear search">
                  <X className="w-4 h-4 text-ink-subtle" />
                </button>
              )}
            </div>
          </div>
          <div className="flex-1 overflow-y-auto px-4">
            {searchQuery && filteredItems.length === 0 ? (
              <p className="text-center py-12 text-ink-muted">{t('searchNotFound')}</p>
            ) : searchQuery ? (
              <div className="divide-y divide-hairline">
                {filteredItems.map((item) => (
                  <div key={item.id} className="py-4 flex gap-3">
                    <div className="w-12 h-12 rounded-lg bg-surface-2 flex items-center justify-center shrink-0 text-xl">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt=""
                          width={48}
                          height={48}
                          className="object-cover w-full h-full rounded-lg"
                          unoptimized
                        />
                      ) : (
                        '🍽️'
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-ink">{item.name}</h3>
                      <p className="text-xs text-ink-subtle">{item.categoryName}</p>
                    </div>
                    <span className="font-bold text-accent-brand">€{item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-12 text-ink-subtle">Start typing to search</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}