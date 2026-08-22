import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Plus, Pencil, Eye, EyeOff } from 'lucide-react';
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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {name}
      </Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            Menu Items
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Manage your menu items for {name}
          </p>
        </div>
        <Link
          href={`/dashboard/restaurants/${id}/menu/new`}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New
        </Link>
      </div>

      {itemsByCategory.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
          <p className="text-gray-500 mb-4">No categories or items yet</p>
          <Link
            href={`/dashboard/restaurants/${id}/categories`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold"
          >
            <Plus className="w-4 h-4" />
            Create Categories First
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {itemsByCategory.map(({ category, categoryName, items }) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden"
            >
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                <h2 className="font-semibold text-gray-900 dark:text-gray-100">
                  {categoryName}
                </h2>
                <span className="text-sm text-gray-500">{items.length} items</span>
              </div>

              {items.length === 0 ? (
                <div className="px-6 py-8 text-center text-gray-500">
                  No items in this category yet
                </div>
              ) : (
                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                  {items.map((item) => {
                    const itemName = item.translations[0]?.name || item.id;
                    return (
                      <div
                        key={item.id}
                        className="px-6 py-4 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0">
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
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {itemName}
                          </h3>
                          <p className="text-sm text-gray-500">
                            €{Number(item.price).toFixed(2)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {item.isAvailable ? (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                              <Eye className="w-3 h-3" />
                              Visible
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full">
                              <EyeOff className="w-3 h-3" />
                              Hidden
                            </span>
                          )}
                          <Link
                            href={`/dashboard/restaurants/${id}/menu/${item.id}/edit`}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Pencil className="w-4 h-4 text-gray-500" />
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