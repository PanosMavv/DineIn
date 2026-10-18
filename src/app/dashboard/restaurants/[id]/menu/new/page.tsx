import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { MenuItemForm } from '@/components/Dashboard/MenuItemForm';

export default async function NewMenuItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.items');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      categories: {
        include: {
          translations: { where: { locale: 'en' } },
        },
      },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations[0]?.name || restaurant.slug;

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}/menu`}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('add.back')}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-6">
        {t('add.header')}
      </h1>

      <MenuItemForm
        restaurantId={id}
        categories={restaurant.categories.map((cat) => ({
          id: cat.id,
          name: cat.translations[0]?.name || cat.id,
        }))}
      />
    </div>
  );
}