import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Eye, EyeOff } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DeleteMenuItem } from '@/components/Dashboard/DeleteMenuItem';

export default async function MenuPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.items');
  const tCard = await getTranslations('dashboard.restaurantCard');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      menuItems: {
        include: {
          translations: { where: { locale: 'en' } },
          category: {
            include: {
              translations: { where: { locale: 'en' } },
            },
          },
        },
        orderBy: { categoryId: 'asc' },
      },
      categories: {
        include: {
          translations: { where: { locale: 'en' } },
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations[0]?.name || restaurant.slug;

  // Group items by category
  const itemsByCategory = restaurant.categories.map((category) => {
    const categoryName = category.translations[0]?.name || category.id;
    const items = restaurant.menuItems.filter(
      (item) => item.categoryId === category.id
    );
    return { category, categoryName, items };
  });

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${id}`}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back', { name })}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-ink">
            {t('header')}
          </h1>
          <p className="text-ink-muted mt-1">
            {t('description', { name })}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/menu/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-[color:var(--color-surface)] rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('add.header')}
        </Link>
      </div>

      {itemsByCategory.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-hairline">
          <p className="text-ink-muted mb-4">{t('noCategoriesOrItems')}</p>
          <Link
            href={`/dashboard/restaurants/${id}/categories`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-[color:var(--color-surface)] rounded-full font-semibold hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            {t('createCategoriesFirst')}
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {itemsByCategory.map(({ category, categoryName, items }) => (
            <div
              key={category.id}
              className="bg-surface rounded-2xl border border-hairline overflow-hidden"
            >
              <div className="px-6 py-4 bg-surface-2 border-b border-hairline flex items-center justify-between">
                <h2 className="font-semibold text-ink">
                  {categoryName}
                </h2>
                <span className="text-sm text-ink-muted">
                  {items.length} {tCard('items')}
                </span>
              </div>

              {items.length === 0 ? (
                <div className="px-6 py-8 text-center text-ink-muted">
                  {t('noItemsInCategory')}
                </div>
              ) : (
                <div className="divide-y divide-hairline">
                  {items.map((item) => {
                    const itemName = item.translations[0]?.name || item.id;
                    return (
                      <div
                        key={item.id}
                        className="px-6 py-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-2 flex items-center justify-center shrink-0">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={itemName}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-lg">🍽️</span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-semibold text-ink truncate">
                            {itemName}
                          </h3>
                          <p className="text-sm text-ink-muted">
                            €{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.isAvailable ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-success/10 text-success text-xs rounded-full">
                              <Eye className="w-3 h-3" />
                              {t('visible')}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-surface-2 text-ink-muted text-xs rounded-full">
                              <EyeOff className="w-3 h-3" />
                              {t('hidden')}
                            </span>
                          )}
                          <Link
                            href={`/dashboard/restaurants/${id}/menu/${item.id}/edit`}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2"
                          >
                            <Pencil className="w-4 h-4 text-ink-muted" />
                          </Link>
                          <DeleteMenuItem restaurantId={id} itemId={item.id} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}