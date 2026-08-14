'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';

interface Props {
  item: {
    id: string;
    name: string;
    description: string | null;
    price: number;
    image?: string | null;
    isAvailable: boolean;
  };
  showImage?: boolean;
}

export function ImageMenuItem({ item, showImage = false }: Props) {
  const t = useTranslations('restaurant');

  // With image layout
  if (showImage) {
    return (
      <div className="py-4 flex gap-3" style={{ opacity: item.isAvailable ? 1 : 0.5 }}>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
            {item.name}
            {!item.isAvailable && (
              <span className="text-xs text-red-500 dark:text-red-400 ml-2">({t('soldOut')})</span>
            )}
          </h3>
          {item.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{item.description}</p>
          )}
          <span className="inline-block mt-2 text-base font-bold text-gray-900 dark:text-gray-100">
            €{item.price.toFixed(2)}
          </span>
        </div>
        <div className="w-24 h-24 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center shrink-0 text-xl">
          {item.image ? (
            <Image src={item.image} alt={item.name} width={80} height={80} className="object-cover w-full h-full" unoptimized />
          ) : (
            '🍽️'
          )}
        </div>
      </div>
    );
  }

  // Simple row layout (no image)
  return (
    <div className="py-4 flex justify-between items-start" style={{ opacity: item.isAvailable ? 1 : 0.5 }}>
      <div className="flex-1 mr-4">
        <h3 className="text-base font-bold text-gray-900 dark:text-gray-100">
          {item.name}
          {!item.isAvailable && (
            <span className="text-xs text-red-500 dark:text-red-400 ml-2">({t('soldOut')})</span>
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