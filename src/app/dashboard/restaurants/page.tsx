import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Settings, Eye } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { RestaurantEmptyState } from '@/components/Dashboard/RestaurantEmptyState';
import { RestaurantListItem } from '@/components/Dashboard/RestaurantListItem';
import { redirect } from 'next/navigation';

export default async function RestaurantsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.myRestaurants');
  const tCard = await getTranslations('dashboard.restaurantCard');

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      themeSettings: true,
      _count: { select: { menuItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  if (restaurants.length === 0) {
    redirect('/dashboard');
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('header')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('description')}
          </p>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <RestaurantEmptyState />
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
            <div
              key={restaurant.id}
              className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
            >
              <RestaurantListItem restaurant={restaurant} />

              <div className="flex gap-2 mt-4">
                <Link
                  href={`/dashboard/restaurants/${restaurant.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  {tCard('manage')}
                </Link>
                <Link
                  href={`/${restaurant.slug}`}
                  target="_blank"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                >
                  <Eye className="w-4 h-4" />
                  {tCard('preview')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}