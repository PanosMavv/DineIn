import { MenuItemCard } from './MenuItemCard';
import type { MenuItem } from '@/lib/utils';

export function MenuGrid({ items }: { items: MenuItem[] }) {
  return (
    <div className="divide-y divide-gray-400">
      {items.map(item => <MenuItemCard key={item.id} item={item} />)}
    </div>
  );
}