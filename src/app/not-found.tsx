import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('restaurant');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {t('notFound')}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {t('notFoundMessage')}
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t('backToRestaurants')}
        </a>
      </div>
    </div>
  );
}