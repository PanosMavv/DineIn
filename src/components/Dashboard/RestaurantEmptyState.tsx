import Link from 'next/link';
import { Plus, UtensilsCrossed } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export async function RestaurantEmptyState() {
  const t = await getTranslations('dashboard.components.restaurantEmptyState');

  return (
    <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <UtensilsCrossed className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
        {t('title')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6">
        {t('description')}
      </p>
      <Link
        href="/dashboard/restaurants/new"
        className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        {t('cta')}
      </Link>
    </div>
  );
}