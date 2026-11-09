import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import { RestaurantHeader } from '@/components/Dashboard/shared/RestaurantHeader';
import { NextStepSection } from '@/components/Dashboard/Hub/NextStepSection';
import { NotLiveBanner } from '@/components/Dashboard/Hub/NotLiveBanner';
import { WelcomeBanner } from '@/components/Dashboard/Hub/WelcomeBanner';
import { SetupChecklist, type ChecklistStep } from '@/components/Dashboard/Hub/SetupChecklist';
import type { StepStatus } from '@/components/Dashboard/shared/StatusRow';

export default async function RestaurantDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ welcome?: string }>;
}) {
  const { id } = await params;
  const { welcome } = await searchParams;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.hub');
  const tc = await getTranslations('dashboard.common');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: {
        select: { locale: true, name: true, isActive: true },
      },
      themeSettings: true,
      _count: {
        select: { categories: true, menuItems: true, carouselImages: true },
      },
      menuItems: {
        where: { isAvailable: true },
        select: { id: true },
      },
    },
  });

  if (!restaurant) notFound();

  const english = restaurant.translations.find(
    (translation) => translation.locale === 'en'
  );
  const name = english?.name || restaurant.slug;
  const isLive = Boolean(english?.isActive);
  const activeLanguages = restaurant.translations.filter(
    (translation) => translation.isActive
  ).length;
  const additionalLanguages = Math.max(
    activeLanguages - (english?.isActive ? 1 : 0),
    0
  );

  const categories = restaurant._count.categories;
  const dishes = restaurant._count.menuItems;
  const availableDishes = restaurant.menuItems.length;

  const designDone = Boolean(
    restaurant.themeSettings?.logoImage ||
      restaurant._count.carouselImages > 0 ||
      (restaurant.themeSettings?.template &&
        restaurant.themeSettings.template !== 'simple-list')
  );
  const languagesDone = additionalLanguages > 0;
  const essentialsDone = categories > 0 && dishes > 0;

  let nextId: 'categories' | 'menu' | 'soldout' | 'share';
  if (categories === 0) nextId = 'categories';
  else if (dishes === 0) nextId = 'menu';
  else if (availableDishes === 0) nextId = 'soldout';
  else nextId = 'share';

  const stepStatus = (
    done: boolean,
    current: boolean,
    optional = false
  ): StepStatus => {
    if (done) return 'done';
    if (optional) return 'optional';
    return current ? 'current' : 'pending';
  };

  const steps: ChecklistStep[] = [
    {
      id: 'categories',
      status: stepStatus(categories > 0, nextId === 'categories'),
      title: t('categories'),
      meta:
        categories > 0
          ? tc('categoryCount', { count: categories })
          : t('categoriesEmpty'),
      href: `/dashboard/restaurants/${id}/menu`,
      action: tc('manage'),
    },
    {
      id: 'dishes',
      status: stepStatus(dishes > 0, nextId === 'menu' || nextId === 'soldout'),
      title: t('dishes'),
      meta:
        dishes > 0 ? tc('itemCount', { count: dishes }) : t('dishesEmpty'),
      href: `/dashboard/restaurants/${id}/menu`,
      action: t('addDish'),
    },
    {
      id: 'design',
      status: stepStatus(designDone, false, true),
      title: t('design'),
      meta: designDone ? t('designCustom') : t('designDefault'),
      href: `/dashboard/restaurants/${id}/theme`,
      action: t('customize'),
    },
    {
      id: 'languages',
      status: stepStatus(languagesDone, false, true),
      title: t('languages'),
      meta: languagesDone
        ? tc('languageCount', { count: activeLanguages })
        : t('languagesEnglishOnly'),
      href: `/dashboard/restaurants/${id}/translations`,
      action: t('addLanguage'),
    },
  ];

  const completedSteps = steps.filter((step) => step.status === 'done').length;
  const progressLabel = t('progress', {
    done: completedSteps,
    total: steps.length,
  });

  return (
    <div>
      <RestaurantHeader
        name={name}
        slug={restaurant.slug}
        backHref="/dashboard"
        backLabel={tc('allRestaurants')}
        isLive={isLive}
      />

      {welcome === '1' && (
        <WelcomeBanner name={name} hasCategories={categories > 0} />
      )}

      {!isLive && <NotLiveBanner restaurantId={id} />}

      <div className="max-w-4xl space-y-6">
        <NextStepSection
          nextId={nextId}
          restaurantId={id}
          slug={restaurant.slug}
        />

        <SetupChecklist
          title={t('checklist')}
          progressLabel={progressLabel}
          progressValue={completedSteps}
          progressTotal={steps.length}
          badge={
            essentialsDone ? (
              <span className={`${ui.chip} ${ui.chipSuccess}`}>
                {t('menuReady')}
              </span>
            ) : undefined
          }
          steps={steps}
          optionalLabel={tc('optional')}
        />
      </div>
    </div>
  );
}
