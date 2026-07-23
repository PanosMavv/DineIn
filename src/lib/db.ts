import { prisma } from './prisma';

export async function getRestaurantBySlug(slug: string, locale: string = 'en') {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      translations: {
        where: { locale },
      },
      themeSettings: true,
      carouselImages: {
        orderBy: { order: 'asc' },
      },
      categories: {
        orderBy: { id: 'asc' },
        include: {
          translations: {
            where: { locale },
          },
          theme: true,
        },
      },
      menuItems: {
        orderBy: [{ id: 'asc' }],
        include: {
          translations: {
            where: { locale },
          },
        },
      },
      comboDeals: {
        where: { active: true },
        orderBy: { order: 'asc' },
        include: {
          items: {
            include: {
              menuItem: {
                include: {
                  translations: { where: { locale } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!restaurant) return null;

  const t = restaurant.translations[0];

  // Build carousel URLs array
  const carouselImages = restaurant.carouselImages.map(ci => ci.image);

  // Build category map: categoryId → { name, image, emoji }
  const categoryMap: Record<string, { name: string; image: string | null; emoji: string | null }> = {};
  restaurant.categories.forEach(cat => {
    const catT = cat.translations[0];
    categoryMap[cat.id] = {
      name: catT?.name || cat.id,
      image: cat.theme?.image || null,
      emoji: cat.theme?.emoji || null,
    };
  });

  return {
    ...restaurant,
    template: restaurant.themeSettings?.template || 'simple-list',
    name: t?.name || restaurant.slug,
    description: t?.description || null,
    theme: {
      carouselImages,
      logoImage: restaurant.themeSettings?.logoImage || null,
      heroStyle: restaurant.themeSettings?.heroStyle || 'default',
      categoryImages: Object.fromEntries(
        Object.entries(categoryMap).map(([id, data]) => [data.name, data.image])
      ),
      categoryEmojis: Object.fromEntries(
        Object.entries(categoryMap).map(([id, data]) => [data.name, data.emoji])
      ),
    },
    menuItems: restaurant.menuItems.map(item => {
      const itemT = item.translations[0];
      const catData = categoryMap[item.categoryId];
      return {
        id: item.id,
        name: itemT?.name || 'Untitled',
        description: itemT?.description || null,
        price: Number(item.price),
        category: catData?.name || item.categoryId,
        categoryId: item.categoryId,
        isAvailable: item.isAvailable,
        image: item.image,
        originalPrice: item.originalPrice ? Number(item.originalPrice) : null,
        isFeatured: item.isFeatured,
        featuredLabel: item.featuredLabel,
      };
    }),
    comboDeals: restaurant.comboDeals.map(deal => ({
      id: deal.id,
      name: deal.name,
      description: deal.description,
      price: Number(deal.price),
      originalPrice: Number(deal.originalPrice),
      emoji: deal.emoji,
      image: deal.image,
    })),
  };
}

export async function getRestaurantLocales(slug: string): Promise<string[]> {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      translations: {
        select: { locale: true },
      },
    },
  });

  if (!restaurant) return [];

  return restaurant.translations.map(t => t.locale);
}