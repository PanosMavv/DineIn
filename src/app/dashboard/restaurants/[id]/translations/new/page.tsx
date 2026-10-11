import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { TranslationForm } from '@/components/Dashboard/TranslationForm';

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

  // Get existing locales from restaurant translations
  const existingLocales = restaurant.translations.map(tr => tr.locale);

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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('add.back')}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
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