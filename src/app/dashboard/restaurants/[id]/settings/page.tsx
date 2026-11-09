import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { RestaurantHeader } from '@/components/Dashboard/shared/RestaurantHeader';
import { RestaurantSettingsForm } from '@/components/Dashboard/Settings/RestaurantSettingsForm';

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.settings');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
    },
  });

  if (!restaurant) notFound();

  const english = restaurant.translations[0];

  return (
    <div>
      <RestaurantHeader
        name={english?.name || restaurant.slug}
        slug={restaurant.slug}
        backHref={`/dashboard/restaurants/${id}`}
        backLabel={english?.name || restaurant.slug}
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-ink">{t('header')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('description')}</p>
      </div>

      <RestaurantSettingsForm
        restaurantId={id}
        initialName={english?.name || ''}
        initialDescription={english?.description || ''}
        slug={restaurant.slug}
      />
    </div>
  );
}
