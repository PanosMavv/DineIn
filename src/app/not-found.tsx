import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('restaurant');

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-ink-subtle mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-ink mb-2">
          {t('notFound')}
        </h2>
        <p className="text-ink-muted mb-8">
          {t('notFoundMessage')}
        </p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-accent-brand text-white rounded-lg hover:bg-accent-brand/90 transition-colors"
        >
          {t('backToRestaurants')}
        </a>
      </div>
    </div>
  );
}