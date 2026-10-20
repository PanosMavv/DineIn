import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Trash2, Image as ImageIcon } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { DeleteCategory } from '@/components/Dashboard/DeleteCategory';

export default async function CategoriesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id;

  if (!userId) return null;

  const t = await getTranslations('dashboard.management.categories');
  const tCard = await getTranslations('dashboard.restaurantCard');

  const restaurant = await prisma.restaurant.findFirst({
    where: { id, ownerId: userId },
    include: {
      translations: { where: { locale: 'en' } },
      categories: {
        include: {
          translations: { where: { locale: 'en' } },
          theme: true,
          _count: { select: { menuItems: true } },
        },
        orderBy: { id: 'asc' },
      },
    },
  });

  if (!restaurant) notFound();

  const name = restaurant.translations[0]?.name || restaurant.slug;

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
            {t('description')}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/categories/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-surface rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          {t('add.header')}
        </Link>
      </div>

      {restaurant.categories.length === 0 ? (
        <div className="text-center py-16 bg-surface rounded-2xl border border-hairline">
          <p className="text-ink-muted">{t('noCategories')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurant.categories.map((category) => {
            const categoryName = category.translations[0]?.name || category.id;
            return (
              <div
                key={category.id}
                className="p-4 bg-surface rounded-2xl border border-hairline flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-surface-2 flex items-center justify-center shrink-0">
                  {category.theme?.image ? (
                    <img
                      src={category.theme.image}
                      alt={categoryName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-ink-subtle" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-ink">
                    {categoryName}
                  </h3>
                  <p className="text-sm text-ink-muted">
                    {category._count.menuItems} {tCard('items')}
                  </p>
                </div>
                <Link
                  href={`/dashboard/restaurants/${id}/categories/${category.id}/edit`}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-surface-2"
                >
                  <Pencil className="w-4 h-4 text-ink-muted" />
                </Link>
                <DeleteCategory restaurantId={id} categoryId={category.id} />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}