import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, FolderPlus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { MenuItemForm } from '@/components/Dashboard/MenuItemForm';
import { EmptyState } from '@/components/Dashboard/shared/EmptyState';

export default async function NewMenuItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { id } = await params;
  const { category } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.items');
  const tMenu = await getTranslations('dashboard.menu');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      categories: {
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        include: {
          translations: { where: { locale: 'en' } },
        },
      },
    },
  });

  if (!restaurant) notFound();

  const backLink = (
    <Link
      href={`/dashboard/restaurants/${id}/menu`}
      className="mb-4 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink"
    >
      <ArrowLeft className="h-4 w-4" aria-hidden="true" />
      {t('add.back')}
    </Link>
  );

  if (restaurant.categories.length === 0) {
    return (
      <div>
        {backLink}
        <EmptyState
          icon={FolderPlus}
          title={tMenu('emptyTitle')}
          description={tMenu('emptyBody')}
          primaryHref={`/dashboard/restaurants/${id}/categories/new`}
          primaryLabel={tMenu('emptyCta')}
        />
      </div>
    );
  }

  return (
    <div>
      {backLink}

      <h1 className="mb-6 text-2xl font-bold text-ink md:text-3xl">
        {t('add.header')}
      </h1>

      <MenuItemForm
        restaurantId={id}
        categories={restaurant.categories.map((cat) => ({
          id: cat.id,
          name: cat.translations[0]?.name || cat.id,
        }))}
        defaultCategoryId={category}
      />
    </div>
  );
}
