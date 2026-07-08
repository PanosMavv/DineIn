'use client';

import { useEffect } from 'react';

// Used to scroll the page to the top when navigating to a restaurant menu
export function ScrollToTop() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return null;
}