import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { TranslationForm } from '@/components/Dashboard/TranslationForm';

export default async function EditTranslationPage({
  params,
}: {
  params: Promise<{ id: string; locale: string }>;
}) {
  const { id, locale } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Translations
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        Edit {locale.toUpperCase()} Translation
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