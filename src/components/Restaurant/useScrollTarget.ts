'use client';

import { createContext, useContext, RefObject } from 'react';

interface ScrollContextValue {
  containerRef: RefObject<HTMLElement | null> | null;
}

export const ScrollContext = createContext<ScrollContextValue>({ containerRef: null });

/**
 * Returns helpers that operate on either the nearest scrollable preview
 * container (when the template is rendered inside <ScrollContext.Provider>)
 * or the window/viewport (when rendered as a normal page).
 */
export function useScrollTarget() {
  const { containerRef } = useContext(ScrollContext);

  const getContainer = () => containerRef?.current ?? null;

  const getScrollTop = () => {
    const c = getContainer();
    return c ? c.scrollTop : window.scrollY;
  };

  const scrollTo = (el: HTMLElement, behavior: ScrollBehavior = 'smooth') => {
    const c = getContainer();
    if (c) {
      const containerRect = c.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const top = c.scrollTop + elRect.top - containerRect.top;
      c.scrollTo({ top, behavior });
    } else {
      el.scrollIntoView({ behavior, block: 'start' });
    }
  };

  const scrollToTop = (behavior: ScrollBehavior = 'smooth') => {
    const c = getContainer();
    if (c) c.scrollTo({ top: 0, behavior });
    else window.scrollTo({ top: 0, behavior });
  };

  const onScroll = (handler: () => void) => {
    const c = getContainer();
    const target: HTMLElement | Window = c ?? window;
    const add = () => target.addEventListener('scroll', handler, { passive: true });
    const remove = () => target.removeEventListener('scroll', handler);
    return { add, remove };
  };

  return { getScrollTop, scrollTo, scrollToTop, onScroll };
}