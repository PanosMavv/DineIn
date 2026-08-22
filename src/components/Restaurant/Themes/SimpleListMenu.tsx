'use client';

import { useState, useEffect, useRef } from 'react';
import type { MenuItem } from '@/lib/utils';
import { CategoryNavBar } from '@/components/Restaurant/Navigation/CategoryNavBar';
import { SearchBox } from '@/components/Restaurant/Navigation/SearchBox';
import { ImageMenuItem } from '@/components/Restaurant/Content/ImageMenuItem';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function SimpleListMenu({ restaurant, groupedMenu }: Props) {
  const [activeCategory, setActiveCategory] = useState(groupedMenu[0]?.category || '');
  const [showNav, setShowNav] = useState(false);
  const activeRef = useRef<HTMLButtonElement>(null);
  const clickedCategory = useRef<string | null>(null);

  const scrollTo = (category: string) => {
    clickedCategory.current = category;
    setActiveCategory(category);
    document.getElementById(category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Show or hide the category navbar based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const firstCategory = document.getElementById(groupedMenu[0]?.category);
      if (!firstCategory) return;

      const categoryTop = firstCategory.offsetTop;
      setShowNav(window.scrollY > categoryTop - 115);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [groupedMenu]);

  // Scrollspy effect to highlight the active category in the navbar
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

  // Scroll to the active category when it changes 
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ==================== Category Navbar ==================== */}
      <div className={`fixed left-0 right-0 z-20 bg-white dark:bg-gray-900 shadow-sm max-w-2xl mx-auto transition-all duration-300 ${showNav ? 'top-0' : '-top-full'}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div className="w-9" />
          <h2 className="text-base font-bold text-gray-900 dark:text-gray-100 truncate flex-1 text-center mx-3">
            {restaurant.name}
          </h2>
          <SearchBox groupedMenu={groupedMenu} />
        </div>
        <CategoryNavBar categories={groupedMenu} activeCategory={activeCategory} onSelect={scrollTo} activeRef={activeRef} />
      </div>

      {/* ==================== Menu Items By Category ==================== */}
      <div className="px-4 pb-12">
        {groupedMenu.map(g => (
          <div key={g.category} id={g.category} className="scroll-mt-22.5">
            <div className="bg-[#fafafa] dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 -mx-4 px-4 py-4">
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-gray-100">{g.category}</h2>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-800">
              {g.items.map(item => (
                <ImageMenuItem key={item.id} item={item} showImage={true} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}