'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  restaurantId: string;
  locale: string;
  isActive: boolean;
}

export function ToggleTranslation({ restaurantId, locale, isActive }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard/restaurants/${restaurantId}/translations/${locale}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (!res.ok) throw new Error('Failed to toggle');
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
      title={isActive ? 'Disable translation' : 'Enable translation'}
    >
      {isActive ? (
        <Eye className="w-4 h-4 text-green-500" />
      ) : (
        <EyeOff className="w-4 h-4 text-gray-400" />
      )}
    </button>
  );
}