import type { MetadataRoute } from 'next';
import { prisma } from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://dinein.panosmavromatis.com';

  // Fetch only the data we need
  const restaurants = await prisma.restaurant.findMany({
    select: {
      slug: true,
      updatedAt: true,
    },
    orderBy: { updatedAt: 'desc' },
  });

  const restaurantUrls: MetadataRoute.Sitemap = restaurants.map((r) => ({
    url: `${baseUrl}/${r.slug}`,
    lastModified: r.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...restaurantUrls,
  ];
}