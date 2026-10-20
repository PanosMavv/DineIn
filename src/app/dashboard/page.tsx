import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { UtensilsCrossed } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { OnboardingScreen } from '@/components/Dashboard/Onboarding/OnboardingScreen';
import { RestaurantListItem } from '@/components/Dashboard/RestaurantListItem';

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.overview');

  const restaurants = await prisma.restaurant.findMany({
    where: { ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      themeSettings: true,
      _count: { select: { menuItems: true } },
    },
    orderBy: { createdAt: 'desc' },
  });

  // First-time user: onboarding
  if (restaurants.length === 0) {
    return <OnboardingScreen />;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-ink">
          {t('welcome')}{session.user.name?.split(' ')[0]}
        </h1>
        <p className="text-ink-muted mt-1">{t('description')}</p>
      </div>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-ink">{t('restaurants')}</h2>
        <Link
          href="/dashboard?new=1"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ink text-surface text-sm font-semibold"
        >
          <UtensilsCrossed className="w-4 h-4" />
          New
        </Link>
      </div>

      <div className="grid gap-4">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant.id}
            href={`/dashboard/restaurants/${restaurant.id}`}
            className="flex items-center gap-4 p-4 bg-surface rounded-(--dashboard-radius) border border-hairline hover:border-ink-subtle transition-colors"
          >
            <RestaurantListItem restaurant={restaurant} />
            <span className="text-ink-subtle">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}