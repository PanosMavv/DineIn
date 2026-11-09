import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';

interface Restaurant {
  id: string;
  slug: string;
  translations: { locale: string; name: string; isActive: boolean }[];
  themeSettings?: { logoImage: string | null } | null;
  _count: { categories: number; menuItems: number };
}

interface Props {
  restaurant: Restaurant;
}

export async function RestaurantCard({ restaurant }: Props) {
  const t = await getTranslations('dashboard.common');
  const th = await getTranslations('dashboard.hub');
  const tp = await getTranslations('dashboard.portfolio');

  const name =
    restaurant.translations.find((translation) => translation.locale === 'en')?.name ??
    restaurant.slug;
  const languageCount = restaurant.translations.filter(
    (translation) => translation.isActive
  ).length;
  const isReady =
    restaurant._count.categories > 0 && restaurant._count.menuItems > 0;

  return (
    <Link
      href={`/dashboard/restaurants/${restaurant.id}`}
      className={`${ui.cardInteractive} group flex items-center gap-4 p-4`}
      aria-label={`${tp('open')}: ${name}`}
    >
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2">
        {restaurant.themeSettings?.logoImage ? (
          <img
            src={restaurant.themeSettings.logoImage}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span className="text-lg font-bold text-ink-subtle">
            {name.charAt(0)}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="truncate text-base font-semibold text-ink">{name}</h2>
          {isReady && (
            <span className={`${ui.chip} ${ui.chipSuccess}`}>{th('menuReady')}</span>
          )}
        </div>
        <p className="truncate text-sm text-ink-muted">/{restaurant.slug}</p>
        <p className="mt-1 text-xs text-ink-muted">
          {t('categoryCount', { count: restaurant._count.categories })}
          <span aria-hidden="true"> · </span>
          {t('itemCount', { count: restaurant._count.menuItems })}
          <span aria-hidden="true"> · </span>
          {t('languageCount', { count: languageCount })}
        </p>
      </div>

      <span className="flex items-center gap-1 text-sm font-medium text-ink-muted group-hover:text-ink">
        <span className="hidden sm:inline">{tp('open')}</span>
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </span>
    </Link>
  );
}
