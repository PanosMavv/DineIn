import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
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
    <ThemeSettings
      restaurantId={id}
      restaurantName={name}
      currentTemplate={restaurant.themeSettings?.template || 'simple-list'}
      currentLogo={restaurant.themeSettings?.logoImage || null}
      carouselImages={restaurant.carouselImages.map(ci => ({
        id: ci.id,
        image: ci.image,
        order: ci.order,
      }))}
    />
  );
}