import { prisma } from './prisma';

export async function getRestaurantBySlug(slug: string) {
  const restaurant = await prisma.restaurant.findUnique({
    where: { slug },
    include: {
      menuItems: {
        orderBy: [{ category: 'asc' }, { name: 'asc' }]
      }
    }
  });

  if (!restaurant) return null;

  return {
    ...restaurant,
    menuItems: restaurant.menuItems.map(item => ({
      ...item,
      price: Number(item.price),
    })),
  };
}