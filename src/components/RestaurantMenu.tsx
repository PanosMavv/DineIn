'use client';

import { useState, useEffect, useRef } from 'react';
import { MenuGrid } from './MenuGrid';
import { ImageCarousel } from './ImageCarousel';
import type { MenuItem } from '@/lib/utils';
import Image from 'next/image';
import { Search, X, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function RestaurantMenu({ restaurant, groupedMenu }: Props) {
  const [activeCategory, setActiveCategory] = useState(groupedMenu[0]?.category || '');
  const [showNav, setShowNav] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const clickedCategory = useRef<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const images = (restaurant.theme as any)?.carouselImages || [];

  const t = useTranslations('restaurant');

  const scrollTo = (category: string) => {
    clickedCategory.current = category;
    setActiveCategory(category);
    document.getElementById(category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    const handleScroll = () => {
      const hero = heroRef.current;
      if (!hero) return;
      const heroBottom = hero.offsetTop + hero.offsetHeight;
      const shouldShow = window.scrollY > heroBottom - 60;
      setShowNav(shouldShow);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (clickedCategory.current) {
        const el = document.getElementById(clickedCategory.current);
        if (el) {
          const rect = el.getBoundingClientRect();
          const isLastCategory = groupedMenu[groupedMenu.length - 1].category === clickedCategory.current;

          if (rect.top <= 56 || (isLastCategory && window.innerHeight + window.scrollY >= document.body.offsetHeight - 10)) {
            clickedCategory.current = null;
          } else {
            setActiveCategory(clickedCategory.current);
            return;
          }
        }
      }

      const y = window.scrollY + 120;
      for (let i = groupedMenu.length - 1; i >= 0; i--) {
        const el = document.getElementById(groupedMenu[i].category);
        if (el && el.offsetTop <= y) {
          setActiveCategory(groupedMenu[i].category);
          break;
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [groupedMenu]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchOpen]);

  // Lock body scroll when search is open
  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isSearchOpen]);

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
  };

  const filteredItems = searchQuery.trim()
    ? groupedMenu
      .flatMap(group => group.items)
      .filter(
        item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {images.length > 0 && <ImageCarousel images={images} />}

      {/* ==================== RESTAURANT INFO (HERO) ==================== */}
      <div ref={heroRef} className="px-4 py-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{restaurant.description}</p>
            )}
            <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              {restaurant.category.replace('_', ' ')}
            </span>
          </div>

          <div className="w-20 h-20 rounded-full overflow-hidden shrink-0 border-2 border-gray-200 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
            {(restaurant.theme as any)?.logoImage ? (
              <Image
                src={(restaurant.theme as any).logoImage}
                alt={restaurant.name}
                width={64}
                height={64}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">
                {restaurant.name.charAt(0)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ==================== TOP BAR + CATEGORY NAV ==================== */}
      <div className={`fixed top-0 left-0 right-0 z-20 bg-white dark:bg-gray-900 shadow-sm transition-transform duration-300 ${showNav ? 'translate-y-0' : '-translate-y-full'
        }`}>
        {/* Restaurant name + search icon */}
        <div className="flex items-center justify-between px-4 py-1.5">
          <div className="w-9" /> {/* Spacer to balance the search button */}
          <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate flex-1 text-center mx-3">
            {restaurant.name}
          </h2>
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            aria-label="Search menu"
          >
            <Search className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
        </div>

        {/* Category nav */}
        <div className="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-none border-t border-gray-200 dark:border-gray-700">
          {groupedMenu.map(g => (
            <a
              key={g.category}
              ref={activeCategory === g.category ? activeRef : null}
              href={`#${g.category}`}
              onClick={e => {
                e.preventDefault();
                scrollTo(g.category);
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border no-underline transition-colors ${activeCategory === g.category
                ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
                }`}
            >
              {g.category}
            </a>
          ))}
        </div>
      </div>

      {/* ==================== SEARCH OVERLAY ==================== */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-30 bg-white dark:bg-gray-950">
          {/* Search header */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800">
            <button
              onClick={closeSearch}
              className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
            >
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
                className="flex-1 min-w-0 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="shrink-0">
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
            </div>
          </div>

          {/* Search results */}
          <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 60px)' }}>
            {searchQuery && filteredItems.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400">{t('searchNotFound')}</p>
              </div>
            ) : searchQuery ? (
              <div className="divide-y divide-gray-100 dark:divide-gray-800 px-4">
                {filteredItems.map(item => (
                  <div key={item.id} className="py-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1 mr-4">
                        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">{item.name}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
                        )}
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{item.category}</p>
                      </div>
                      <span className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
                        €{item.price.toFixed(2)}
                      </span>
                    </div>
                  </div>
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

      {/* ==================== MENU ITEMS BY CATEGORY ==================== */}
      <div className="px-4 pb-12 pt-16">
        {groupedMenu.map(g => (
          <div key={g.category} id={g.category} className="scroll-mt-22.5">
            <div className="bg-[#fafafa] dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 -mx-4 px-4 py-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{g.category}</h2>
            </div>
            <div className="py-2">
              <MenuGrid items={g.items} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}