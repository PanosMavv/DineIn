export interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  isAvailable: boolean;
}

export function groupMenuItemsByCategory(items: MenuItem[]) {
  const grouped = items
    .filter(item => item.isAvailable)
    .reduce((acc, item) => {
      (acc[item.category] ??= []).push(item);
      return acc;
    }, {} as Record<string, MenuItem[]>);

  return Object.keys(grouped)
    .sort()
    .map(category => ({
      category,
      items: grouped[category].sort((a, b) => a.name.localeCompare(b.name)),
    }));
}