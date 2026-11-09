import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { TranslationForm } from '@/components/Dashboard/TranslationForm';
import { getLocaleLabel } from '@/i18n/locales';

export default async function EditTranslationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.translations');
  const languageLabel = getLocaleLabel(locale);

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

  // Serialize categories - only pass fields the form needs
  const serializedCategories = restaurant.categories.map(cat => ({
    id: cat.id,
    theme: cat.theme ? { image: cat.theme.image } : null,
    translations: cat.translations.map(t => ({
      locale: t.locale,
      name: t.name,
    })),
    menuItems: cat.menuItems.map(item => ({
      id: item.id,
      image: item.image,
      translations: item.translations.map(t => ({
        locale: t.locale,
        name: t.name,
        description: t.description || null,
      })),
    })),
  }));

  // Serialize restaurant translations
  const serializedRestaurantTranslations = restaurant.translations.map(t => ({
    locale: t.locale,
    name: t.name,
    description: t.description || null,
  }));

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}/translations`}
        className="mb-4 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        {t('edit.back')}
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-ink md:text-3xl">
        {t('edit.header', { language: languageLabel })}
      </h1>

      <TranslationForm
        restaurantId={id}
        locale={locale}
        categories={serializedCategories}
        isEditing
        restaurantTranslations={serializedRestaurantTranslations}
      />
    </div>
  );
}