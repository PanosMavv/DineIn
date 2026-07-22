import { notFound } from 'next/navigation';
import { getRestaurantBySlug, getRestaurantLocales } from '@/lib/db';
import { groupMenuItemsByCategory } from '@/lib/utils';
import { SimpleListMenu } from '@/components/Restaurant/Themes/SimpleListMenu';
import { CategoryCardMenu } from '@/components/Restaurant/Themes/CategoryCardMenu';
import { RestaurantHero } from '@/components/Restaurant/Heros/RestaurantHero';
import { OverlayHero } from '@/components/Restaurant/Heros/OverlayHero';
import { cookies } from 'next/headers';

export default async function RestaurantPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get('locale')?.value || 'en';
  const availableLocales = await getRestaurantLocales(slug);
  const locale = availableLocales.includes(requestedLocale) ? requestedLocale : availableLocales[0] || 'en';

  const restaurant = await getRestaurantBySlug(slug, locale);
  if (!restaurant) notFound();

  const groupedMenu = groupMenuItemsByCategory(restaurant.menuItems);

  const heroStyle = restaurant.theme?.heroStyle || 'default';

  return (
    <>
      {heroStyle === 'default' ? (
        <OverlayHero restaurant={restaurant} />
      ) : (
        <RestaurantHero restaurant={restaurant} />
      )}

      {/* Spacer */}
      <div className="h-8" />

      {restaurant.template === 'category-cards' ? (
        <CategoryCardMenu restaurant={restaurant} groupedMenu={groupedMenu} />
      ) : (
        <SimpleListMenu restaurant={restaurant} groupedMenu={groupedMenu} />
      )}
    </>
  );
}