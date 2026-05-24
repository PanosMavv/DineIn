import { notFound } from 'next/navigation';
import { getRestaurantBySlug } from '@/lib/db';
import { groupMenuItemsByCategory } from '@/lib/utils';
import { RestaurantMenu } from '@/components/RestaurantMenu';

export default async function RestaurantPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) notFound();

  const groupedMenu = groupMenuItemsByCategory(restaurant.menuItems);

  return <RestaurantMenu restaurant={restaurant} groupedMenu={groupedMenu} />;
}