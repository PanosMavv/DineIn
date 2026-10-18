'use client';

import { useRef } from 'react';
import { ScrollContext } from '@/components/Restaurant/useScrollTarget';

interface Props {
  device: 'mobile' | 'desktop';
  children: React.ReactNode;
}

export function PreviewFrame({ device, children }: Props) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const inner = (
    <ScrollContext.Provider value={{ containerRef: scrollRef }}>
      <div
        ref={scrollRef}
        className="h-full overflow-y-auto bg-(--color-surface) scrollbar-none"
        style={{ zoom: 0.8 }}
      >
        {children}
      </div>
    </ScrollContext.Provider>
  );

  if (device === 'mobile') {
    return (
      <div className="mx-auto w-85 max-w-full">
        <div className="rounded-[2.5rem] border-10 border-ink/90 bg-ink overflow-hidden shadow-2xl relative">
          <div className="h-6 bg-ink/90 flex items-center justify-center">
            <div className="w-20 h-1.5 bg-white/20 rounded-full" />
          </div>
          <div className="h-150">{inner}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="rounded-xl border border-hairline bg-ink/90 shadow-2xl overflow-hidden">
        <div className="flex items-center gap-1.5 px-3 py-2 bg-ink/90">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
        </div>
        <div className="h-130">{inner}</div>
      </div>
    </div>
  );
}