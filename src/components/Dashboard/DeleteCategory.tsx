'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, X } from 'lucide-react';

interface Props {
  restaurantId: string;
  categoryId: string;
}

export function DeleteCategory({ restaurantId, categoryId }: Props) {
  const router = useRouter();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/dashboard/restaurants/${restaurantId}/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to delete');
      }

      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsConfirming(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsConfirming(true)}
        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-50 dark:hover:bg-red-900/20"
        title="Delete category"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>

      {isConfirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setIsConfirming(false)}
          />
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xl max-w-sm w-full p-6">
            <button
              onClick={() => setIsConfirming(false)}
              className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>

            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                Delete Category?
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                All menu items in this category will also be deleted. This cannot be undone.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleDelete}
                  disabled={isLoading}
                  className="px-5 py-2.5 bg-red-600 text-white rounded-full text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={() => setIsConfirming(false)}
                  className="px-5 py-2.5 border border-gray-300 dark:border-gray-700 rounded-full text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}