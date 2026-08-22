'use client';

import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { useRouter } from 'next/navigation';
import { Save, X, Globe } from 'lucide-react';

const menuItemSchema = v.object({
  name: v.pipe(
    v.string(),
    v.minLength(1, 'Name is required'),
    v.regex(/^[\x00-\x7F]*$/, 'Only Latin characters allowed (English only)')
  ),
  description: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^[\x00-\x7F]*$/, 'Only Latin characters allowed (English only)')
    )
  ),
  price: v.pipe(v.string(), v.minLength(1, 'Price is required')),
  originalPrice: v.optional(v.string()),
  image: v.optional(v.string()),
  categoryId: v.pipe(v.string(), v.minLength(1, 'Category is required')),
  isAvailable: v.boolean(),
  isFeatured: v.boolean(),
  featuredLabel: v.optional(
    v.pipe(
      v.string(),
      v.regex(/^[\x00-\x7F]*$/, 'Only Latin characters allowed (English only)')
    )
  ),
});

type MenuItemFormData = v.InferOutput<typeof menuItemSchema>;

interface Category {
  id: string;
  name: string;
}

interface Props {
  restaurantId: string;
  categories: Category[];
  initialData?: {
    id: string;
    price: number;
    image: string | null;
    isAvailable: boolean;
    originalPrice: number | null;
    isFeatured: boolean;
    featuredLabel: string | null;
    categoryId: string;
    name: string;
    description: string | null;
  };
}

export function MenuItemForm({ restaurantId, categories, initialData }: Props) {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting, isValid },
  } = useForm<MenuItemFormData>({
    resolver: valibotResolver(menuItemSchema),
    mode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      price: initialData?.price?.toString() || '',
      originalPrice: initialData?.originalPrice?.toString() || '',
      image: initialData?.image || '',
      categoryId: initialData?.categoryId || categories[0]?.id || '',
      isAvailable: initialData?.isAvailable ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      featuredLabel: initialData?.featuredLabel || '',
    },
  });

  const isFeatured = watch('isFeatured');
  const imageUrl = watch('image');

  const onSubmit = async (data: MenuItemFormData) => {
    try {
      const url = initialData
        ? `/api/dashboard/restaurants/${restaurantId}/menu/${initialData.id}`
        : `/api/dashboard/restaurants/${restaurantId}/menu`;

      const method = initialData ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          price: parseFloat(data.price),
          originalPrice: data.originalPrice ? parseFloat(data.originalPrice) : null,
        }),
      });

      if (!res.ok) {
        const responseData = await res.json();
        throw new Error(responseData.error || 'Failed to save');
      }

      router.push(`/dashboard/restaurants/${restaurantId}/menu`);
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-2xl space-y-6">
      {/* Language notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Enter all content in <strong>English</strong>. You can add translations for other languages later.
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Item Name <span className="text-xs text-gray-400">(English)</span>
        </label>
        <input
          {...register('name')}
          placeholder="e.g. Margherita Pizza"
          className={`w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border ${errors.name ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } text-gray-900 dark:text-gray-100`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-xs text-gray-400">(English)</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder="Describe the item in English"
          className={`w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border ${errors.description ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
            } text-gray-900 dark:text-gray-100`}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Category + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            {...register('categoryId')}
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && (
            <p className="text-xs text-red-500 mt-1">{errors.categoryId.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Price (€)
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Original Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Original Price <span className="text-xs text-gray-400">(optional - for discounts)</span>
        </label>
        <input
          {...register('originalPrice')}
          type="number"
          step="0.01"
          className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Image URL */}
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

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          {...register('isFeatured')}
          type="checkbox"
          className="w-4 h-4"
        />
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Featured item
        </label>
      </div>

      {isFeatured && (
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Featured Label <span className="text-xs text-gray-400">(English)</span>
          </label>
          <input
            {...register('featuredLabel')}
            placeholder="Popular, New, Chef's Pick"
            className={`w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border ${errors.featuredLabel ? 'border-red-500' : 'border-gray-300 dark:border-gray-700'
              } text-gray-900 dark:text-gray-100`}
          />
          {errors.featuredLabel && (
            <p className="text-xs text-red-500 mt-1">{errors.featuredLabel.message}</p>
          )}
        </div>
      )}

      {/* Available */}
      <div className="flex items-center gap-3">
        <input
          {...register('isAvailable')}
          type="checkbox"
          className="w-4 h-4"
        />
        <label className="text-sm text-gray-700 dark:text-gray-300">
          Available for ordering
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? 'Saving...' : 'Save Item'}
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