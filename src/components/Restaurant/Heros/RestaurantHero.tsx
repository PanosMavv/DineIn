'use client';

import Image from 'next/image';
import { ImageCarousel } from '@/components/Restaurant/Heros/ImageCarousel';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  heroRef?: React.RefObject<HTMLDivElement | null>;
}

export function RestaurantHero({ restaurant, heroRef }: Props) {
  const images = (restaurant.theme as any)?.carouselImages || [];

  return (
    <>
      {/* ==================== IMAGE CAROUSEL ==================== */}
      {images.length > 0 && <ImageCarousel images={images} />}

      {/* ==================== RESTAURANT INFO (HERO) ==================== */}
      <div ref={heroRef} className="px-4 py-6">
        <div className="flex items-center gap-4">
          {/* Restaurant info */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{restaurant.description}</p>
            )}
          </div>

          {/* Restaurant logo/image */}
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
    </>
  );
}