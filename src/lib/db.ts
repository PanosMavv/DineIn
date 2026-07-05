import { prisma } from './prisma';

export async function getRestaurantBySlug(slug: string, locale: string = 'en') {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { locale },
      },
      categoryTranslations: {
        where: { locale },
      },
      menuItems: {
        orderBy: [{ category: 'asc' }, { id: 'asc' }],
        include: {
          translations: {
            where: { locale },
          },
        },
      },
    },
  });

  if (!restaurant) return null;

  const t = restaurant.translations[0];

  // Build a map of category key → translated value
  const categoryMap: Record<string, string> = {};
  restaurant.categoryTranslations.forEach(ct => {
    categoryMap[ct.key] = ct.value;
  });
  
  return {
    ...restaurant,
    name: t?.name || restaurant.slug,
    description: t?.description || null,
    menuItems: restaurant.menuItems.map(item => {
      const itemT = item.translations[0];
      return {
        id: item.id,
        name: itemT?.name || 'Untitled',
        description: itemT?.description || null,
        price: Number(item.price),
        category: categoryMap[item.category] || item.category,
        isAvailable: item.isAvailable,
        image: item.image,
      };
    }),
  };
}