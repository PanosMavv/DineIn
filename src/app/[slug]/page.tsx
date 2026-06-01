import { notFound } from 'next/navigation';
import { getRestaurantBySlug } from '@/lib/db';
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
  const locale = cookieStore.get('locale')?.value || 'en';
  
  const restaurant = await getRestaurantBySlug(slug, locale);
  if (!restaurant) notFound();

  const groupedMenu = groupMenuItemsByCategory(restaurant.menuItems);

  return <RestaurantMenu restaurant={restaurant} groupedMenu={groupedMenu} />;
}