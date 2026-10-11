import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { MenuItemForm } from '@/components/Dashboard/MenuItemForm';

export default async function EditMenuItemPage({
  params,
}: {
  params: Promise<{ id: string; itemId: string }>;
}) {
  const { id, itemId } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.items');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      categories: {
        include: {
          translations: { where: { locale: 'en' } },
        },
      },
    },
  });

  if (!restaurant) notFound();

  const item = await prisma.menuItem.findFirst({
    where: { id: itemId, restaurantId: id },
    include: {
      translations: { where: { locale: 'en' } },
    },
  });

  if (!item) notFound();

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}/menu`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('edit.back')}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">
        {t('edit.header')}
      </h1>

      <MenuItemForm
        restaurantId={id}
        categories={restaurant.categories.map((cat) => ({
          id: cat.id,
          name: cat.translations[0]?.name || cat.id,
        }))}
        initialData={{
          id: item.id,
          price: Number(item.price),
          image: item.image,
          isAvailable: item.isAvailable,
          originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
          isFeatured: item.isFeatured,
          featuredLabel: item.featuredLabel,
          categoryId: item.categoryId,
          name: item.translations[0]?.name || '',
          description: item.translations[0]?.description || null,
        }}
      />
    </div>
  );
}