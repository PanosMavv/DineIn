'use client';

import { useState, useEffect, useRef } from 'react';
import { MenuGrid } from './MenuGrid';
import { ImageCarousel } from './ImageCarousel';
import type { MenuItem } from '@/lib/utils';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function RestaurantMenu({ restaurant, groupedMenu }: Props) {
  const [activeCategory, setActiveCategory] = useState(groupedMenu[0]?.category || '');
  const [showNav, setShowNav] = useState(false);
  const activeRef = useRef<HTMLAnchorElement>(null);
  const clickedCategory = useRef<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  
  const images = (restaurant.theme as any)?.carouselImages || [];

  // Smooth scroll to a category and lock its active state
  const scrollTo = (category: string) => {
    clickedCategory.current = category;
    setActiveCategory(category);
    document.getElementById(category)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  // Show nav when hero scrolls out of view, hide when it returns
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowNav(!entry.isIntersecting);
      },
      { threshold: 0 }
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  // Update active category based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Keep the clicked category active while smooth scrolling
      if (clickedCategory.current) {
        const el = document.getElementById(clickedCategory.current);
        if (el) {
          const rect = el.getBoundingClientRect();
          const isLastCategory = groupedMenu[groupedMenu.length - 1].category === clickedCategory.current;
          
          // Release lock when header reaches nav or we hit the bottom of the page
          if (rect.top <= 56 || (isLastCategory && window.innerHeight + window.scrollY >= document.body.offsetHeight - 10)) {
            clickedCategory.current = null;
          } else {
            setActiveCategory(clickedCategory.current);
            return;
          }
        }
      }
      
      // Find which category is currently in view
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

  // Auto-scroll the active category button into the visible area of the nav
  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [activeCategory]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* ==================== IMAGE CAROUSEL ==================== */}
      {images.length > 0 && <ImageCarousel images={images} />}

      {/* ==================== RESTAURANT INFO (HERO) ==================== */}
      <div ref={heroRef} className="px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{restaurant.name}</h1>
        {restaurant.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{restaurant.description}</p>
        )}
        <span className="inline-block mt-3 px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
          {restaurant.category.replace('_', ' ')}
        </span>
      </div>

      {/* ==================== FLOATING CATEGORY NAV ==================== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 shadow-sm transition-transform duration-300 ${
          showNav ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex gap-2 overflow-x-auto px-4 py-2.5 scrollbar-none">
          {groupedMenu.map(g => (
            <a
              key={g.category}
              ref={activeCategory === g.category ? activeRef : null}
              href={`#${g.category}`}
              onClick={e => {
                e.preventDefault();
                scrollTo(g.category);
              }}
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium border no-underline transition-colors ${
                activeCategory === g.category
                  ? 'bg-black dark:bg-white text-white dark:text-black border-black dark:border-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-700'
              }`}
            >
              {g.category}
            </a>
          ))}
        </div>
      </nav>

      {/* ==================== MENU ITEMS BY CATEGORY ==================== */}
      <div className="px-4 pb-12">
        {groupedMenu.map(g => (
          <div key={g.category} id={g.category} className="scroll-mt-14">
            {/* Category header */}
            <div className="bg-[#fafafa] dark:bg-gray-900 border-y border-gray-200 dark:border-gray-800 -mx-4 px-4 py-4">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{g.category}</h2>
            </div>
            {/* Category items */}
            <div className="py-2">
              <MenuGrid items={g.items} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}