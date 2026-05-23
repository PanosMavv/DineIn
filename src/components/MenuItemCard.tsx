import type { MenuItem } from '@/lib/utils';

export function MenuItemCard({ item }: { item: MenuItem }) {
  return (
    <div className="py-4 flex justify-between items-start" style={{ opacity: item.isAvailable ? 1 : 0.5 }}>
      <div className="flex-1 mr-4">
        <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
          {item.name}
          {!item.isAvailable && (
            <span className="text-xs text-red-500 dark:text-red-400 ml-2">(Sold Out)</span>
          )}
        </h3>
        {item.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
        )}
      </div>
      <span className="text-base font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">
        €{item.price.toFixed(2)}
      </span>
    </div>
  );
}