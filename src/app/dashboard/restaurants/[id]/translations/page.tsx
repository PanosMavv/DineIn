import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ToggleTranslation } from '@/components/Dashboard/ToggleTranslation';
import { DeleteTranslation } from '@/components/Dashboard/DeleteTranslation';

export default async function TranslationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.translations');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: true,
      categories: {
        include: {
          translations: true,
          menuItems: {
            include: {
              translations: true,
            },
          },
        },
      },
    },
  });

  if (!restaurant) notFound();

  const allLocales = new Set<string>();
  restaurant.translations.forEach(tr => allLocales.add(tr.locale));
  restaurant.categories.forEach(cat => {
    cat.translations.forEach(tr => allLocales.add(tr.locale));
    cat.menuItems.forEach(item => {
      item.translations.forEach(tr => allLocales.add(tr.locale));
    });
  });

  const locales = Array.from(allLocales).sort();

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}`}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back')}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">
            {t('header')}
          </h1>
          <p className="text-ink-muted mt-1">
            {t('description')}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/translations/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-[color:var(--color-surface)] rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('add.header')}
        </Link>
      </div>

      {locales.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-hairline">
          <p className="text-ink-muted mb-4">{t('noTranslations')}</p>
          <Link
            href={`/dashboard/restaurants/${id}/translations/new`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-[color:var(--color-surface)] rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t('add.header')}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {locales.map(locale => {
            const restaurantTranslation = restaurant.translations.find(tr => tr.locale === locale);
            const isActive = restaurantTranslation?.isActive ?? true;

            return (
              <div
                key={locale}
                className={`p-4 rounded-2xl border transition-colors ${isActive
                    ? 'bg-surface border-hairline'
                    : 'bg-surface-2 border-hairline'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-2 flex items-center justify-center text-lg">
                      {locale === 'en' ? '🇬🇧' : locale === 'el' ? '🇬🇷' : locale === 'de' ? '🇩🇪' : locale === 'fr' ? '🇫🇷' : '🇨🇳'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-ink">
                        {locale.toUpperCase()}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <ToggleTranslation
                      restaurantId={id}
                      locale={locale}
                      isActive={isActive}
                    />
                    <Link
                      href={`/dashboard/restaurants/${id}/translations/${locale}/edit`}
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2"
                    >
                      <Pencil className="w-4 h-4 text-ink-muted" />
                    </Link>
                    <DeleteTranslation
                      restaurantId={id}
                      locale={locale}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}