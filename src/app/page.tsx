import { getTranslations } from 'next-intl/server';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('home');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">
          {t('heading')}
        </h1>
        <p className="text-lg opacity-60">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}