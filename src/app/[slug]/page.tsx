import { notFound } from 'next/navigation';
import { getRestaurantBySlug, getRestaurantLocales } from '@/lib/db';
import { groupMenuItemsByCategory } from '@/lib/utils';
import { RestaurantMenu } from '@/components/RestaurantMenu';
import { cookies } from 'next/headers';

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const requestedLocale = cookieStore.get('locale')?.value || 'en';
  
  // Get available locales for this restaurant
  const availableLocales = await getRestaurantLocales(slug);
  
  // If the user's locale isn't available, fall back to the first available one
  const locale = availableLocales.includes(requestedLocale) 
    ? requestedLocale 
    : availableLocales[0] || 'en';
  
  const restaurant = await getRestaurantBySlug(slug, locale);
  if (!restaurant) notFound();

  const groupedMenu = groupMenuItemsByCategory(restaurant.menuItems);

  return (
    <RestaurantMenu
      restaurant={restaurant}
      groupedMenu={groupedMenu}
    />
  );
}