'use client';

import { useState, useEffect, useRef } from 'react';
import type { MenuItem } from '@/lib/utils';
import { CategoryNavBar } from '@/components/Restaurant/Navigation/CategoryNavBar';
import { SearchBox } from '@/components/Restaurant/Navigation/SearchBox';
import { ImageMenuItem } from '@/components/Restaurant/Content/ImageMenuItem';
import { useScrollTarget } from '@/components/Restaurant/useScrollTarget';
import { HeroPicker } from '@/components/Restaurant/Heros/HeroPicker';

interface Props {
  restaurant: { name: string; description?: string | null; category?: string; theme?: any };
  groupedMenu: { category: string; items: MenuItem[] }[];
}

export function SimpleListMenu({ restaurant, groupedMenu }: Props) {
  const [activeCategory, setActiveCategory] = useState(groupedMenu[0]?.category || '');
  const [showNav, setShowNav] = useState(false);

  const activeRef = useRef<HTMLButtonElement>(null);
  const categoryRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const firstCategoryRef = useRef<HTMLDivElement | null>(null);

  const { getScrollTop, scrollTo, onScroll } = useScrollTarget();

  const goTo = (category: string) => {
    setActiveCategory(category);
    const el = categoryRefs.current.get(category);
    if (el) scrollTo(el);
  };

  useEffect(() => {
    const handler = () => {
      const y = getScrollTop();
      const first = firstCategoryRef.current;

      if (first) {
        setShowNav(y > first.offsetTop - 120);
      }

      for (let i = groupedMenu.length - 1; i >= 0; i--) {
        const el = categoryRefs.current.get(groupedMenu[i].category);
        if (!el) continue;
        if (el.offsetTop <= y + 120) {
          setActiveCategory(groupedMenu[i].category);
          break;
        }
      }
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
    <div className="min-h-full bg-surface">
      {/* Zero-height sticky wrapper — pins to scroll viewport top without taking space */}
      <div className="sticky top-0 z-20 h-0">
        {/* Absolute overlay — inherits wrapper width, doesn't push content */}
        <div
          className={`absolute top-0 left-0 right-0 bg-surface shadow-sm ${showNav ? 'visible' : 'invisible'
            }`}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="w-9" />
            <h2 className="text-base font-bold text-ink truncate flex-1 text-center mx-3">
              {restaurant.name}
            </h2>
            <SearchBox groupedMenu={groupedMenu} />
          </div>
          <CategoryNavBar
            categories={groupedMenu}
            activeCategory={activeCategory}
            onSelect={goTo}
            activeRef={activeRef}
          />
        </div>
      </div>

      <HeroPicker restaurant={restaurant} />

      <div className="px-4 pb-12">
        {groupedMenu.map((g, idx) => (
          <div
            key={g.category}
            ref={(el) => {
              if (el) {
                categoryRefs.current.set(g.category, el);
                if (idx === 0) firstCategoryRef.current = el;
              } else {
                categoryRefs.current.delete(g.category);
              }
            }}
            className="scroll-mt-28"
          >
            <div className="bg-surface-2 border-y border-hairline -mx-4 px-4 py-4">
              <h2 className="text-lg font-extrabold text-ink">{g.category}</h2>
            </div>
            <div className="divide-y divide-hairline">
              {g.items.map((item) => (
                <ImageMenuItem key={item.id} item={item} showImage={true} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}