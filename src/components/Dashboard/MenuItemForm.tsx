'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Save, X, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';

interface Category {
  id: string;
  name: string;
}

interface Props {
  restaurantId: string;
  categories: Category[];
  defaultCategoryId?: string;
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

export function MenuItemForm({
  restaurantId,
  categories,
  defaultCategoryId,
  initialData,
}: Props) {
  const router = useRouter();
  const isEdit = !!initialData;
  const t = useTranslations(`dashboard.management.items.${isEdit ? 'edit' : 'add'}`);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const initialCategoryId =
    defaultCategoryId && categories.some((category) => category.id === defaultCategoryId)
      ? defaultCategoryId
      : categories[0]?.id || '';

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
      categoryId: initialData?.categoryId || initialCategoryId,
      isAvailable: initialData?.isAvailable ?? true,
      isFeatured: initialData?.isFeatured ?? false,
      featuredLabel: initialData?.featuredLabel || '',
    },
  });

  const isFeatured = watch('isFeatured');
  const imageUrl = watch('image');
  const nameValue = watch('name');

  const onSubmit = async (data: MenuItemFormData) => {
    setSubmitError(null);
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
    } catch {
      setSubmitError(t('saveFailed'));
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

      {submitError && (
        <div
          role="alert"
          className="rounded-[var(--dashboard-radius-sm)] bg-red-500/10 p-3 text-sm text-red-600"
        >
          {submitError}
        </div>
      )}

      {/* Name */}
      <div>
        <label htmlFor="item-name" className={ui.label}>
          {t('itemName')}{' '}
          <span className="text-xs font-normal text-ink-subtle">
            {t('englishReminder')}
          </span>
        </label>
        <input
          id="item-name"
          {...register('name')}
          placeholder={t('namePlaceholder')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'item-name-error' : undefined}
          className={ui.input}
        />
        {errors.name && (
          <p id="item-name-error" className={ui.error}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="item-description" className={ui.label}>
          {t('itemDescription')}{' '}
          <span className="text-xs font-normal text-ink-subtle">
            {t('englishReminder')}
          </span>
        </label>
        <textarea
          id="item-description"
          {...register('description')}
          rows={3}
          placeholder={t('descriptionPlaceholder')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? 'item-description-error' : undefined
          }
          className={ui.textarea}
        />
        {errors.description && (
          <p id="item-description-error" className={ui.error}>
            {errors.description.message}
          </p>
        )}
      </div>

      {/* Category + Price */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="item-category" className={ui.label}>
            {t('itemCategory')}
          </label>
          <select
            id="item-category"
            {...register('categoryId')}
            aria-invalid={Boolean(errors.categoryId)}
            aria-describedby={
              errors.categoryId ? 'item-category-error' : undefined
            }
            className={ui.select}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
          {errors.categoryId && (
            <p id="item-category-error" className={ui.error}>
              {errors.categoryId.message}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="item-price" className={ui.label}>
            {t('itemPrice')}
          </label>
          <input
            id="item-price"
            {...register('price')}
            type="number"
            step="0.01"
            aria-invalid={Boolean(errors.price)}
            aria-describedby={errors.price ? 'item-price-error' : undefined}
            className={ui.input}
          />
          {errors.price && (
            <p id="item-price-error" className={ui.error}>
              {errors.price.message}
            </p>
          )}
        </div>
      </div>

      {/* Original Price */}
      <div>
        <label htmlFor="item-original-price" className={ui.label}>
          {t('originalPrice')}{' '}
          <span className="text-xs font-normal text-ink-subtle">
            {t('originalPriceOptional')}
          </span>
        </label>
        <input
          id="item-original-price"
          {...register('originalPrice')}
          type="number"
          step="0.01"
          className={ui.input}
        />
      </div>

      {/* Image URL */}
      <div>
        <label htmlFor="item-image" className={ui.label}>
          {t('imageUrl')}
        </label>
        <input
          id="item-image"
          {...register('image')}
          placeholder="https://..."
          className={ui.input}
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt={nameValue || t('itemName')}
            className="mt-2 h-24 w-24 rounded-[var(--dashboard-radius-sm)] object-cover"
          />
        )}
      </div>

      {/* Featured */}
      <div className="flex items-center gap-3">
        <input
          id="item-featured"
          {...register('isFeatured')}
          type="checkbox"
          className="h-4 w-4"
        />
        <label htmlFor="item-featured" className="text-sm text-ink">
          {t('featuredItem')}
        </label>
      </div>

      {isFeatured && (
        <div>
          <label htmlFor="item-featured-label" className={ui.label}>
            {t('featuredLabel')}{' '}
            <span className="text-xs font-normal text-ink-subtle">
              {t('englishReminder')}
            </span>
          </label>
          <input
            id="item-featured-label"
            {...register('featuredLabel')}
            placeholder={t('featuredLabelPlaceholder')}
            aria-invalid={Boolean(errors.featuredLabel)}
            aria-describedby={
              errors.featuredLabel ? 'item-featured-label-error' : undefined
            }
            className={ui.input}
          />
          {errors.featuredLabel && (
            <p id="item-featured-label-error" className={ui.error}>
              {errors.featuredLabel.message}
            </p>
          )}
        </div>
      )}

      {/* Available */}
      <div className="flex items-center gap-3">
        <input
          id="item-available"
          {...register('isAvailable')}
          type="checkbox"
          className="h-4 w-4"
        />
        <label htmlFor="item-available" className="text-sm text-ink">
          {t('availableForOrdering')}
        </label>
      </div>

      {/* Submit */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={ui.btnPrimary}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? t('saving') : t('saveItem')}
        </button>
        <Link
          href={`/dashboard/restaurants/${restaurantId}/menu`}
          className={ui.btnGhost}
        >
          <X className="h-4 w-4" aria-hidden="true" />
          {t('cancel')}
        </Link>
      </div>
    </form>
  );
}