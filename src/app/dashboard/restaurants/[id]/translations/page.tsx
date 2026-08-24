import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';
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
  restaurant.translations.forEach(t => allLocales.add(t.locale));
  restaurant.categories.forEach(cat => {
    cat.translations.forEach(t => allLocales.add(t.locale));
    cat.menuItems.forEach(item => {
      item.translations.forEach(t => allLocales.add(t.locale));
    });
  });

  const locales = Array.from(allLocales).sort();

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}`}
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Translations
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage menu languages
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/translations/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Translation
        </Link>
      </div>

      {locales.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 mb-4">No translations yet</p>
          <Link
            href={`/dashboard/restaurants/${id}/translations/new`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add First Translation
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {locales.map(locale => {
            const restaurantTranslation = restaurant.translations.find(t => t.locale === locale);
            const isActive = restaurantTranslation?.isActive ?? true;
            const categoryTranslations = restaurant.categories.filter(cat =>
              cat.translations.some(t => t.locale === locale)
            );
            const itemTranslations = restaurant.categories.flatMap(cat =>
              cat.menuItems.filter(item =>
                item.translations.some(t => t.locale === locale)
              )
            );

            return (
              <div
                key={locale}
                className={`p-4 rounded-2xl border transition-colors ${isActive
                  ? 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800'
                  : 'bg-gray-50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-800'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-lg">
                      {locale === 'en' ? '🇬🇧' : locale === 'el' ? '🇬🇷' : locale === 'de' ? '🇩🇪' : locale === 'fr' ? '🇫🇷' : '🇨🇳'}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                        {locale.toUpperCase()}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {restaurantTranslation ? 'Translated' : 'Not translated'} ·{' '}
                        {categoryTranslations.length + itemTranslations.length} items
                        {!isActive && ' · Disabled'}
                      </p>
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
                      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <Pencil className="w-4 h-4 text-gray-500" />
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