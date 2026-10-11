import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, UtensilsCrossed, Settings, Eye } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function RestaurantsPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.myRestaurants');
  const tOverview = await getTranslations('dashboard.overview');
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
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            {tOverview('noRestaurants.title')}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {tOverview('noRestaurants.description')}
          </p>
          <Link
            href="/dashboard/restaurants/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            {tOverview('noRestaurants.cta')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => {
            const name = restaurant.translations[0]?.name || restaurant.slug;
            return (
              <div
                key={restaurant.id}
                className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
              >
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                    {restaurant.themeSettings?.logoImage ? (
                      <img
                        src={restaurant.themeSettings.logoImage}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-lg font-bold text-gray-400">{name.charAt(0)}</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {restaurant._count.menuItems} {tCard('items')} · {restaurant.category.replace('_', ' ')}
                    </p>
                  </div>
                </div>

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
            );
          })}
        </div>
      )}
    </div>
  );
}