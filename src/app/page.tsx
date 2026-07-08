import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import Image from 'next/image';

export default async function HomePage() {
  const t = await getTranslations('home');
  
  const restaurants = await prisma.restaurant.findMany({
    include: {
      translations: {
        where: { locale: 'en' },
      },
      _count: {
        select: { menuItems: true },
      },
    },
    orderBy: { slug: 'asc' },
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Hero */}
      <div className="px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
          {t('heading')}
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Preview Card */}
      <div className="px-4 pb-12">
        <div className="max-w-md mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-md border border-gray-200 dark:border-gray-800 overflow-hidden">
          {/* Hero image */}
          <div className="relative aspect-[2/1] bg-gray-100 dark:bg-gray-800">
            <Image
              src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&h=400&fit=crop"
              alt="Restaurant interior"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          </div>
          {/* Restaurant info */}
          <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center shrink-0">
                <span className="text-xl font-bold text-gray-400">B</span>
              </div>
              <div>
                <div className="w-28 h-5 bg-gray-200 dark:bg-gray-700 rounded mb-1" />
                <div className="w-40 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            </div>
            <div className="mt-3">
              <div className="w-20 h-5 bg-blue-100 dark:bg-blue-900 rounded-full" />
            </div>
          </div>
          {/* Fake menu items */}
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex justify-between items-center px-4 py-3">
                <div>
                  <div className="w-32 h-4 bg-gray-100 dark:bg-gray-800 rounded mb-2" />
                  <div className="w-48 h-3 bg-gray-50 dark:bg-gray-800/50 rounded" />
                </div>
                <div className="w-12 h-4 bg-gray-100 dark:bg-gray-800 rounded" />
              </div>
            ))}
          </div>
          {/* Fake search bar */}
          <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-gray-200 dark:bg-gray-700" />
              <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-800 rounded" />
            </div>
          </div>
        </div>
        <p className="text-center text-sm text-gray-400 dark:text-gray-500 mt-3">
          Clean, simple menus your customers will love
        </p>
      </div>

      {/* Restaurants */}
      <div className="px-4 pb-16">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Our Restaurants
        </h2>
        <div className="grid gap-3 max-w-md mx-auto">
          {restaurants.map((restaurant) => {
            const name = restaurant.translations[0]?.name || restaurant.slug;
            return (
              <Link
                key={restaurant.id}
                href={`/${restaurant.slug}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  <span className="text-lg font-bold text-gray-400 dark:text-gray-500">
                    {name.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                    {name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {restaurant._count.menuItems} items · {restaurant.category.replace('_', ' ')}
                  </p>
                </div>
                <span className="text-gray-400 dark:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}