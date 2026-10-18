'use client';

import { useState, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { MenuItem } from '@/lib/utils';
import Image from 'next/image';
import { ImageMenuItem } from '../Content/ImageMenuItem';
import { useScrollTarget } from '@/components/Restaurant/useScrollTarget';
import { HeroPicker } from '@/components/Restaurant/Heros/HeroPicker';

interface Props {
  restaurant: { name: string; description?: string | null; category?: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function CategoryCardMenu({ restaurant, groupedMenu }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { scrollTo } = useScrollTarget();

  const selectedGroup = selectedIndex !== null ? groupedMenu[selectedIndex] : null;
  const categoryItems = selectedGroup?.items || [];
  const selectedCategory = selectedGroup?.category || null;
  const categoryImages = (restaurant.theme as any)?.categoryImages || {};

  const categoryNavRef = useRef<HTMLDivElement | null>(null);
  const categoryListRef = useRef<HTMLDivElement | null>(null);

  const handleSelectCategory = (index: number) => {
    setSelectedIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (categoryNavRef.current) scrollTo(categoryNavRef.current);
      });
    });
  };

  const handleBack = () => {
    setSelectedIndex(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (categoryListRef.current) scrollTo(categoryListRef.current);
      });
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <HeroPicker restaurant={restaurant} />

      {selectedCategory ? (
        <>
          <div ref={categoryNavRef} className="sticky top-0 z-20 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={handleBack}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
                aria-label="Back to categories"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">{selectedCategory}</h2>
            </div>
          </div>

          <div className="px-4 pb-12">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {categoryItems.map((item) => (
                <ImageMenuItem key={item.id} item={item} showImage={true} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div ref={categoryListRef} className="pt-4 px-4">
          <div className="space-y-3">
            {groupedMenu.map((group, index) => (
              <button
                key={group.category}
                onClick={() => handleSelectCategory(index)}
                className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors text-left"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{group.category}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                  </p>
                </div>
                <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 overflow-hidden">
                  {categoryImages[group.category] ? (
                    <Image
                      src={categoryImages[group.category]}
                      alt={group.category}
                      width={80}
                      height={80}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <span className="text-3xl">🍽️</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}