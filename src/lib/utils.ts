export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isAvailable: boolean;
  image?: string | null;
  originalPrice?: number | null;
  isFeatured?: boolean;
  featuredLabel?: string | null;
}

export function groupMenuItemsByCategory(items: MenuItem[]) {
  // Sold-out items stay visible on the public menu (rendered dimmed by
  // ImageMenuItem). Consumers that need only available items can filter.
  const grouped = items.reduce((acc, item) => {
    (acc[item.category] ??= []).push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  return Object.keys(grouped)
    .map(category => ({
      category,
      items: grouped[category],
    }));
}