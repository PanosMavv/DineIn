'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

interface Props {
  images: string[];
}

export function ImageCarousel({ images }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const isTransitioning = useRef(false);

  const goToSlide = (index: number) => {
    if (isTransitioning.current) return;
    isTransitioning.current = true;
    setCurrentIndex(index);
    setTimeout(() => { isTransitioning.current = false; }, 500);
  };

  const next = () => goToSlide((currentIndex + 1) % images.length);
  const prev = () => goToSlide((currentIndex - 1 + images.length) % images.length);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, [currentIndex, images.length]);

  const handleTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchMove = (e: React.TouchEvent) => { touchEndX.current = e.touches[0].clientX; };
  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) diff > 0 ? next() : prev();
  };

  if (!images.length) return null;

  return (
    <div
      className="relative w-full bg-gray-100 overflow-hidden"
      style={{ aspectRatio: '2/1', maxHeight: '25vh' }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className="flex h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {images.map((src, i) => (
          <div key={i} className="shrink-0 w-full h-full relative">
            <Image src={src} alt={`Slide ${i + 1}`} fill className="object-cover" priority={i === 0} unoptimized sizes="100vw" />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent pointer-events-none" />

      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`rounded-full transition-all ${i === currentIndex ? 'bg-white w-4 h-1.5' : 'bg-white/60 w-1.5 h-1.5'}`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}