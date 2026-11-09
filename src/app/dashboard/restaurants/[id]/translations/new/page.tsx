import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Languages } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { TranslationForm } from '@/components/Dashboard/TranslationForm';
import { availableLocales } from '@/i18n/locales';
import { EmptyState } from '@/components/Dashboard/shared/EmptyState';

export default async function NewTranslationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.translations');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: true,
      categories: {
        include: {
          translations: true,
          theme: true,
          menuItems: {
            include: {
              translations: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) notFound();

  // A locale can exist through any translated row, not only the restaurant row.
  const existingLocaleSet = new Set(restaurant.translations.map(tr => tr.locale));
  restaurant.categories.forEach(cat => {
    cat.translations.forEach(tr => existingLocaleSet.add(tr.locale));
    cat.menuItems.forEach(item => {
      item.translations.forEach(tr => existingLocaleSet.add(tr.locale));
    });
  });
  const existingLocales = Array.from(existingLocaleSet);
  const allAdded = availableLocales.every(locale =>
    existingLocaleSet.has(locale.code)
  );

  if (allAdded) {
    const tLanguages = await getTranslations('dashboard.languages');
    return (
      <div>
        <Link
          href={`/dashboard/restaurants/${id}/translations`}
          className="mb-4 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          {t('add.back')}
        </Link>
        <EmptyState
          icon={Languages}
          title={tLanguages('allAddedTitle')}
          description={tLanguages('allAddedBody')}
          primaryHref={`/dashboard/restaurants/${id}/translations`}
          primaryLabel={t('add.back')}
        />
      </div>
    );
  }

  // Serialize categories
  const serializedCategories = restaurant.categories.map(cat => ({
    id: cat.id,
    theme: cat.theme ? { image: cat.theme.image } : null,
    translations: cat.translations.map(tr => ({
      locale: tr.locale,
      name: tr.name,
    })),
    menuItems: cat.menuItems.map(item => ({
      id: item.id,
      image: item.image,
      translations: item.translations.map(tr => ({
        locale: tr.locale,
        name: tr.name,
        description: tr.description || null,
      })),
    })),
  }));

  // Serialize restaurant translations
  const serializedRestaurantTranslations = restaurant.translations.map(tr => ({
    locale: tr.locale,
    name: tr.name,
    description: tr.description || null,
  }));

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}/translations`}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('add.back')}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-6">
        {t('add.header')}
      </h1>

      <TranslationForm
        restaurantId={id}
        categories={serializedCategories}
        restaurantTranslations={serializedRestaurantTranslations}
        existingLocales={existingLocales}
      />
    </div>
  );
}