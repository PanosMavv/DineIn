'use client';

import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { useRouter } from 'next/navigation';
import { Save, X, Globe } from 'lucide-react';

const categorySchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, 'Name is required'),
    v.regex(/^[\x00-\x7F]*$/, 'Only Latin characters allowed (English only)')
  ),
  image: v.optional(v.string()),
  emoji: v.optional(v.string()),
});

type CategoryFormData = v.InferOutput<typeof categorySchema>;

interface Props {
  restaurantId: string;
  initialData?: {
    id: string;
    name: string;
    image: string | null;
    emoji: string | null;
  };
}

export function CategoryForm({ restaurantId, initialData }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CategoryFormData>({
    resolver: valibotResolver(categorySchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      image: initialData?.image || '',
      emoji: initialData?.emoji || '',
    },
  });

  const imageUrl = watch('image');

  const onSubmit = async (data: CategoryFormData) => {
    try {
      const url = initialData
        ? `/api/dashboard/restaurants/${restaurantId}/categories/${initialData.id}`
        : `/api/dashboard/restaurants/${restaurantId}/categories`;

      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error || 'Failed to save');
      }

      router.push(`/dashboard/restaurants/${restaurantId}/categories`);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      {/* Language notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Enter the category name in <strong>English</strong>. You can add translations later.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Category Name <span className="text-xs text-gray-400">(English)</span>
        </label>
        <input
          {...register('name')}
          placeholder="e.g. Appetizers"
          className={`w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } text-gray-900 dark:text-gray-100`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Image */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Image URL
        </label>
        <input
          {...register('image')}
          placeholder="https://..."
          className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
        {imageUrl && (
          <img src={imageUrl} alt="Preview" className="mt-2 w-24 h-24 rounded-xl object-cover" />
        )}
      </div>

      {/* Emoji */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Emoji <span className="text-xs text-gray-400">(optional fallback)</span>
        </label>
        <input
          {...register('emoji')}
          placeholder="🍕"
          className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Category'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}