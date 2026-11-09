import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Languages, Plus } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import {
  getLocaleFlag,
  getLocaleLabel,
  getLocaleNativeName,
} from '@/i18n/locales';
import { RestaurantHeader } from '@/components/Dashboard/shared/RestaurantHeader';
import { EmptyState } from '@/components/Dashboard/shared/EmptyState';
import { LanguageRow } from '@/components/Dashboard/Translations/LanguageRow';

export default async function TranslationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.languages');
  const tc = await getTranslations('dashboard.common');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: true,
      categories: {
        include: {
          translations: true,
          menuItems: {
            include: { translations: true },
          },
        },
      },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations.find((entry) => entry.locale === 'en')?.name ||
    restaurant.slug;
  const items = restaurant.categories.flatMap((category) => category.menuItems);
  const totalStrings = 1 + restaurant.categories.length + items.length;

  const localeCodes = new Set<string>(['en']);
  restaurant.translations.forEach((entry) => localeCodes.add(entry.locale));
  restaurant.categories.forEach((category) => {
    category.translations.forEach((entry) => localeCodes.add(entry.locale));
    category.menuItems.forEach((item) => {
      item.translations.forEach((entry) => localeCodes.add(entry.locale));
    });
  });

  const rows = Array.from(localeCodes)
    .map((locale) => {
      const restaurantTranslation = restaurant.translations.find(
        (entry) => entry.locale === locale
      );
      const translated =
        (restaurantTranslation ? 1 : 0) +
        restaurant.categories.filter((category) =>
          category.translations.some((entry) => entry.locale === locale)
        ).length +
        items.filter((item) =>
          item.translations.some((entry) => entry.locale === locale)
        ).length;

      return {
        locale,
        label: getLocaleLabel(locale),
        nativeName: getLocaleNativeName(locale),
        flag: getLocaleFlag(locale),
        translated,
        total: totalStrings,
        isActive: restaurantTranslation?.isActive ?? false,
        hasRestaurantTranslation: Boolean(restaurantTranslation),
        isDefault: locale === 'en',
      };
    })
    .sort((a, b) => {
      if (a.isDefault) return -1;
      if (b.isDefault) return 1;
      return a.label.localeCompare(b.label);
    });

  const additionalLanguages = rows.filter((row) => !row.isDefault);

  return (
    <div>
      <RestaurantHeader
        name={name}
        slug={restaurant.slug}
        backHref={`/dashboard/restaurants/${id}`}
        backLabel={name}
      />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-ink">{t('header')}</h2>
          <p className="mt-1 text-sm text-ink-muted">{t('description')}</p>
          <p className="mt-1 text-xs text-ink-muted">
            {tc('languageCount', { count: rows.length })}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/translations/new`}
          className={`${ui.btnPrimary} shrink-0`}
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          {t('addLanguage')}
        </Link>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <LanguageRow
            key={row.locale}
            restaurantId={id}
            locale={row.locale}
            label={row.label}
            nativeName={row.nativeName}
            flag={row.flag}
            translated={row.translated}
            total={row.total}
            isActive={row.isActive}
            hasRestaurantTranslation={row.hasRestaurantTranslation}
            isDefault={row.isDefault}
          />
        ))}
      </div>

      {additionalLanguages.length === 0 && (
        <div className="mt-4">
          <EmptyState
            icon={Languages}
            title={t('emptyTitle')}
            description={t('emptyBody')}
            primaryHref={`/dashboard/restaurants/${id}/translations/new`}
            primaryLabel={t('emptyCta')}
          />
        </div>
      )}
    </div>
  );
}
