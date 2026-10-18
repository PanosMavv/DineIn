import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Settings, UtensilsCrossed, Palette, Eye, ArrowLeft, Languages } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function RestaurantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.restaurantCard');
  const tTheme = await getTranslations('dashboard.management.theme');
  const tCategories = await getTranslations('dashboard.management.categories');
  const tItems = await getTranslations('dashboard.management.items');
  const tTranslations = await getTranslations('dashboard.management.translations');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      themeSettings: true,
      _count: { select: { menuItems: true, categories: true } },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations[0]?.name || restaurant.slug;

  const sections = [
    {
      href: `/dashboard/restaurants/${id}/theme`,
      label: tTheme('header'),
      description: tTheme('description'),
      icon: Palette,
    },
    {
      href: `/dashboard/restaurants/${id}/categories`,
      label: tCategories('header'),
      description: `Manage ${restaurant._count.categories} categories`,
      icon: Settings,
    },
    {
      href: `/dashboard/restaurants/${id}/menu`,
      label: tItems('header'),
      description: `Manage ${restaurant._count.menuItems} items`,
      icon: UtensilsCrossed,
    },
    {
      href: `/dashboard/restaurants/${id}/translations`,
      label: tTranslations('header'),
      description: tTranslations('description'),
      icon: Languages,
    }
  ];

  return (
    <div>
      <Link
        href="/dashboard/restaurants"
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back')}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-ink">
          {name}
        </h1>
        <Link
          href={`/${restaurant.slug}`}
          target="_blank"
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent-brand/10 rounded-full text-sm font-medium text-accent-brand hover:bg-accent-brand/20 transition-colors"
        >
          <Eye className="w-4 h-4" />
          {t('preview')}
        </Link>
      </div>

      <div className="grid gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="flex items-center gap-4 p-6 bg-surface rounded-2xl border border-hairline hover:border-ink-subtle transition-colors"
          >
            <div className="w-12 h-12 rounded-xl bg-accent-brand/10 flex items-center justify-center">
              <section.icon className="w-6 h-6 text-accent-brand" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-ink">
                {section.label}
              </h3>
              <p className="text-sm text-ink-muted">{section.description}</p>
            </div>
            <span className="text-ink-subtle">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}