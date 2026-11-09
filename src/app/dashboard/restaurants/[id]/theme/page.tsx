import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { RestaurantHeader } from '@/components/Dashboard/shared/RestaurantHeader';
import { ThemeSettings } from '@/components/Dashboard/ThemeSettings';

export default async function ThemePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.theme');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      themeSettings: true,
      carouselImages: { orderBy: { order: 'asc' } },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations[0]?.name || restaurant.slug;

  return (
    <div>
      <RestaurantHeader
        name={name}
        slug={restaurant.slug}
        backHref={`/dashboard/restaurants/${id}`}
        backLabel={name}
      />

      <div className="mb-6">
        <h2 className="text-xl font-bold text-ink">{t('header')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('description')}</p>
      </div>

      <ThemeSettings
        restaurantId={id}
        currentTemplate={restaurant.themeSettings?.template || 'simple-list'}
        currentLogo={restaurant.themeSettings?.logoImage || null}
        carouselImages={restaurant.carouselImages.map((image) => ({
          id: image.id,
          image: image.image,
          order: image.order,
        }))}
      />
    </div>
  );
}
