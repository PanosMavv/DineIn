import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { LayoutGrid, Eye, UtensilsCrossed } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { RestaurantEmptyState } from '@/components/Dashboard/RestaurantEmptyState';
import { RestaurantListItem } from '@/components/Dashboard/RestaurantListItem';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.overview');

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      themeSettings: true,
      _count: { select: { menuItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  const totalItems = restaurants.reduce((sum, r) => sum + r._count.menuItems, 0);

  const stats = [
    { label: 'Restaurants', value: restaurants.length, icon: UtensilsCrossed },
    { label: 'Menu Items', value: totalItems, icon: LayoutGrid },
    { label: 'Total Views', value: 0, icon: Eye },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('welcome')}{session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('description')}
          </p>
        </div>
      </div>

      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        {t('restaurants')}
      </h2>

      {restaurants.length === 0 ? (
        <RestaurantEmptyState />
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/dashboard/restaurants/${restaurant.id}`}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
            >
              <RestaurantListItem restaurant={restaurant} />
              <span className="text-gray-400">→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}