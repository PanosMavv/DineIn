import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import { RestaurantHeader } from '@/components/Dashboard/shared/RestaurantHeader';
import { MenuBuilder } from '@/components/Dashboard/Menu/MenuBuilder';
import type { MenuCategoryData } from '@/components/Dashboard/Menu/types';

export default async function MenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.menu');
  const tc = await getTranslations('dashboard.common');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      categories: {
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: {
          translations: { where: { locale: 'en' } },
          theme: true,
          menuItems: {
            orderBy: [{ order: 'asc' }, { id: 'asc' }],
            include: {
              translations: { where: { locale: 'en' } },
            },
          },
        },
      },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations[0]?.name || restaurant.slug;

  const categories: MenuCategoryData[] = restaurant.categories.map((category) => ({
    id: category.id,
    name: category.translations[0]?.name ?? null,
    image: category.theme?.image ?? null,
    emoji: category.theme?.emoji ?? null,
    items: category.menuItems.map((item) => ({
      id: item.id,
      name: item.translations[0]?.name ?? null,
      description: item.translations[0]?.description ?? null,
      price: Number(item.price),
      image: item.image,
      isAvailable: item.isAvailable,
    })),
  }));

  const totalItems = categories.reduce(
    (total, category) => total + category.items.length,
    0
  );

  return (
    <div>
      <RestaurantHeader
        name={name}
        slug={restaurant.slug}
        backHref={`/dashboard/restaurants/${id}`}
        backLabel={name}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">{t('header')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('description')}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {tc('categoryCount', { count: categories.length })}
            <span aria-hidden="true"> · </span>
            {tc('itemCount', { count: totalItems })}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/categories/new`}
          className={`${ui.btnPrimary} shrink-0`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('addCategory')}
        </Link>
      </div>

      <MenuBuilder
        restaurantId={id}
        slug={restaurant.slug}
        categories={categories}
      />
    </div>
  );
}
