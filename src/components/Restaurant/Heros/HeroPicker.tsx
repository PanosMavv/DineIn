'use client';

import { RestaurantHero } from './RestaurantHero';
import { OverlayHero } from './OverlayHero';

interface Props {
  restaurant: any;
}

export function HeroPicker({ restaurant }: Props) {
  const heroStyle = restaurant?.theme?.heroStyle ?? 'default';
  return heroStyle === 'overlay'
    ? <OverlayHero restaurant={restaurant} />
    : <RestaurantHero restaurant={restaurant} />;
}