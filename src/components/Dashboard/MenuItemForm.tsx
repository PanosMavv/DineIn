'use client';

import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { useRouter } from 'next/navigation';
import { Save, X, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
  const isEdit = !!initialData;
  const t = useTranslations(`dashboard.management.items.${isEdit ? 'edit' : 'add'}`);

  const menuItemSchema = v.object({
    name: v.pipe(
      v.string(),
      v.minLength(1, t('nameRequired')),
      v.regex(/^[\x00-\x7F]*$/, t('latinOnly'))
    ),
    description: v.optional(
      v.pipe(
        v.string(),
        v.regex(/^[\x00-\x7F]*$/, t('latinOnly'))
      )
    ),
    price: v.pipe(v.string(), v.minLength(1, t('priceRequired'))),
    originalPrice: v.optional(v.string()),
    image: v.optional(v.string()),
    categoryId: v.pipe(v.string(), v.minLength(1, t('categoryRequired'))),
    isAvailable: v.boolean(),
    isFeatured: v.boolean(),
    featuredLabel: v.optional(
      v.pipe(
        v.string(),
        v.regex(/^[\x00-\x7F]*$/, t('latinOnly'))
      )
    ),
  });

  type MenuItemFormData = v.InferOutput<typeof menuItemSchema>;

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
      <div className="p-4 bg-accent-brand/10 rounded-xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-accent-brand shrink-0 mt-0.5" />
        <p className="text-sm text-accent-brand">
          {t.rich('description', {
            strong: (chunks) => <strong>{chunks}</strong>,
          })}
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('itemName')} <span className="text-xs text-ink-subtle">{t('englishReminder')}</span>
        </label>
        <input
          {...register('name')}
          placeholder={t('namePlaceholder')}
          className={`w-full px-4 py-2 bg-surface rounded-xl border ${errors.name ? 'border-red-500' : 'border-hairline'
            } text-ink`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('itemDescription')} <span className="text-xs text-ink-subtle">{t('englishReminder')}</span>
        </label>
        <textarea
          {...register('description')}
          rows={3}
          placeholder={t('descriptionPlaceholder')}
          className={`w-full px-4 py-2 bg-surface rounded-xl border ${errors.description ? 'border-red-500' : 'border-hairline'
            } text-ink`}
        />
        {errors.description && (
          <p className="text-xs text-red-500 mt-1">{errors.description.message}</p>
        )}
      </div>

      {/* Category + Price */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            {t('itemCategory')}
          </label>
          <select
            {...register('categoryId')}
            className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
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
          <label className="block text-sm font-medium text-ink mb-1">
            {t('itemPrice')}
          </label>
          <input
            {...register('price')}
            type="number"
            step="0.01"
            className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
          />
          {errors.price && (
            <p className="text-xs text-red-500 mt-1">{errors.price.message}</p>
          )}
        </div>
      </div>

      {/* Original Price */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('originalPrice')} <span className="text-xs text-ink-subtle">{t('originalPriceOptional')}</span>
        </label>
        <input
          {...register('originalPrice')}
          type="number"
          step="0.01"
          className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
        />
      </div>

      {/* Image URL */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('imageUrl')}
        </label>
        <input
          {...register('image')}
          placeholder="https://..."
          className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
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
        <label className="text-sm text-ink">
          {t('featuredItem')}
        </label>
      </div>

      {isFeatured && (
        <div>
          <label className="block text-sm font-medium text-ink mb-1">
            {t('featuredLabel')} <span className="text-xs text-ink-subtle">{t('englishReminder')}</span>
          </label>
          <input
            {...register('featuredLabel')}
            placeholder={t('featuredLabelPlaceholder')}
            className={`w-full px-4 py-2 bg-surface rounded-xl border ${errors.featuredLabel ? 'border-red-500' : 'border-hairline'
              } text-ink`}
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
        <label className="text-sm text-ink">
          {t('availableForOrdering')}
        </label>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-[color:var(--color-surface)] rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? t('saving') : t('saveItem')}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-hairline rounded-full font-semibold text-ink hover:bg-surface-2 transition-colors"
        >
          <X className="w-4 h-4" />
          {t('cancel')}
        </button>
      </div>
    </form>
  );
}