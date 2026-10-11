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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back', { name })}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {t('header')}
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            {t('description')}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/categories/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {t('add.header')}
        </Link>
      </div>

      {restaurant.categories.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500">{t('noCategories')}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {restaurant.categories.map((category) => {
            const categoryName = category.translations[0]?.name || category.id;
            return (
              <div
                key={category.id}
                className="p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
                  {category.theme?.image ? (
                    <img
                      src={category.theme.image}
                      alt={categoryName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {categoryName}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {category._count.menuItems} {tCard('items')}
                  </p>
                </div>
                <Link
                  href={`/dashboard/restaurants/${id}/categories/${category.id}/edit`}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Pencil className="w-4 h-4 text-gray-500" />
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