'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft } from 'lucide-react';
import type { MenuItem } from '@/lib/utils';
import Image from 'next/image';
import { ImageMenuItem } from '../Content/ImageMenuItem';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function CategoryCardMenu({ restaurant, groupedMenu }: Props) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const t = useTranslations('restaurant');
  const selectedGroup = selectedIndex !== null ? groupedMenu[selectedIndex] : null;
  const categoryItems = selectedGroup?.items || [];
  const selectedCategory = selectedGroup?.category || null;

  const categoryImages = (restaurant.theme as any)?.categoryImages || {};

  const handleSelectCategory = (index: number) => {
    setSelectedIndex(index);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const nav = document.getElementById('category-nav');
        if (nav) {
          nav.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  const handleBack = () => {
    setSelectedIndex(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const categoryList = document.getElementById('category-list');
        if (categoryList) {
          categoryList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {selectedCategory ? (
        <>
          <div id="category-nav" className="sticky top-0 z-20 bg-white dark:bg-gray-900 shadow-sm">
            <div className="flex items-center gap-3 px-4 py-3">
              <button
                onClick={handleBack}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>
              <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                {selectedCategory}
              </h2>
            </div>
          </div>

          <div className="px-4 pb-12">
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {categoryItems.map((item) => (
                <ImageMenuItem item={item} showImage={true} />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div id="category-list" className="px-4 pb-12">
            <div className="space-y-3">
              {groupedMenu.map((group, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectCategory(index)}
                  className="w-full flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors text-left"
                >
                  {/* Category name and item count */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {group.category}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                    </p>
                  </div>

                  {/* Category image */}
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
                      <span className="text-3xl">{'🍽️'}</span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}