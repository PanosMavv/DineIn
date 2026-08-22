import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus, UtensilsCrossed, LayoutGrid, Eye } from 'lucide-react';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: {
      translations: {
        where: { locale: 'en' },
      },
      themeSettings: true,
      _count: {
        select: { menuItems: true },
      },
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Welcome back, {session.user.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your restaurants and menus
          </p>
        </div>
      </div>

      {/* Stats */}
      {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-6 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <stat.icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div> */}

      {/* Restaurants */}
      <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
        Your Restaurants
      </h2>

      {restaurants.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <UtensilsCrossed className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
            No restaurants yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Create your first restaurant to get started
          </p>
          <Link
            href="/dashboard/restaurants/new"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Restaurant
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurants.map((restaurant) => {
            const name = restaurant.translations[0]?.name || restaurant.slug;
            return (
              <Link
                key={restaurant.id}
                href={`/dashboard/restaurants/${restaurant.id}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
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
                    {restaurant._count.menuItems} items · {restaurant.category.replace('_', ' ')}
                  </p>
                </div>
                <span className="text-gray-400">→</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}