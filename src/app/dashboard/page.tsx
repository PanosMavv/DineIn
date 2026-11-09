import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import { OnboardingScreen } from '@/components/Dashboard/Onboarding/OnboardingScreen';
import { RestaurantCard } from '@/components/Dashboard/Restaurants/RestaurantCard';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const { new: isNew } = await searchParams;
  const t = await getTranslations('dashboard.portfolio');

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: {
      translations: {
        select: { locale: true, name: true, isActive: true },
      },
      themeSettings: { select: { logoImage: true } },
      _count: { select: { categories: true, menuItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // First-time users, and people explicitly creating another restaurant,
  // both use the same onboarding screen.
  if (restaurants.length === 0) {
    return <OnboardingScreen />;
  }

  if (isNew === '1') {
    return <OnboardingScreen cancelHref="/dashboard" />;
  }

  return (
    <div>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-ink md:text-3xl">
            {t('header')}
          </h1>
          <p className="mt-1 text-ink-muted">{t('description')}</p>
        </div>
        <Link href="/dashboard?new=1" className={`${ui.btnPrimary} shrink-0`}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('newRestaurant')}
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {restaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>
    </div>
  );
}
