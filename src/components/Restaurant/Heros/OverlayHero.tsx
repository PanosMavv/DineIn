'use client';

import Image from 'next/image';
import { ImageCarousel } from '@/components/Restaurant/Heros/ImageCarousel';

interface Props {
  restaurant: { name: string; description?: string | null; category: string; theme?: any };
  heroRef?: React.RefObject<HTMLDivElement | null>;
}

export function OverlayHero({ restaurant, heroRef }: Props) {
  const images = (restaurant.theme as any)?.carouselImages || [];
  const logoImage = (restaurant.theme as any)?.logoImage;

  return (
    <div ref={heroRef} className="relative">
      {/* Carousel background */}
      {images.length > 0 ? (
        <ImageCarousel images={images} />
      ) : (
        <div className="aspect-2/1 max-h-[25vh] bg-gray-200 dark:bg-gray-800" />
      )}

      {/* Overlay content */}
      <div className="absolute inset-0 bg-linear-to-r from-black/60 via-black/40 to-transparent">
        <div className="flex items-center h-full px-4 py-6">
          {/* Logo */}
          <div className="w-26 h-26 rounded-full overflow-hidden shrink-0 border-2 border-white/80 bg-white/20 flex items-center justify-center">
            {logoImage ? (
              <Image
                src={logoImage}
                alt={restaurant.name}
                width={80}
                height={80}
                className="object-cover w-full h-full"
                unoptimized
              />
            ) : (
              <span className="text-2xl font-bold text-white">
                {restaurant.name.charAt(0)}
              </span>
            )}
          </div>

          {/* Name + description */}
          <div className="ml-4 text-white">
            <h1 className="text-2xl font-bold drop-shadow-lg">{restaurant.name}</h1>
            {restaurant.description && (
              <p className="text-sm text-white/80 mt-1 drop-shadow-md">{restaurant.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}