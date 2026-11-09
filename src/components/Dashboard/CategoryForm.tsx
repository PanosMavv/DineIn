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
  const isEdit = !!initialData;
  const t = useTranslations(`dashboard.management.categories.${isEdit ? 'edit' : 'add'}`);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const categorySchema = v.object({
    name: v.pipe(
      v.string(),
      v.minLength(1, t('nameRequired')),
      v.regex(/^[\x00-\x7F]*$/, t('latinOnly'))
    ),
    image: v.optional(v.string()),
    emoji: v.optional(v.string()),
  });

  type CategoryFormData = v.InferOutput<typeof categorySchema>;

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
  const nameValue = watch('name');

  const onSubmit = async (data: CategoryFormData) => {
    setSubmitError(null);
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

      router.push(`/dashboard/restaurants/${restaurantId}/menu`);
      router.refresh();
    } catch {
      setSubmitError(t('saveFailed'));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg space-y-6">
      {/* Language notice */}
      <div className="flex items-start gap-3 rounded-[var(--dashboard-radius-sm)] bg-accent-brand/10 p-4">
        <Globe className="mt-0.5 h-5 w-5 shrink-0 text-accent-brand" aria-hidden="true" />
        <p className="text-sm text-accent-brand">{t('description')}</p>
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
        <label htmlFor="category-name" className={ui.label}>
          {t('categoryName')}{' '}
          <span className="text-xs font-normal text-ink-subtle">
            {t('englishReminder')}
          </span>
        </label>
        <input
          id="category-name"
          {...register('name')}
          placeholder={t('namePlaceholder')}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'category-name-error' : undefined}
          className={ui.input}
        />
        {errors.name && (
          <p id="category-name-error" className={ui.error}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Image */}
      <div>
        <label htmlFor="category-image" className={ui.label}>
          {t('imageUrl')}
        </label>
        <input
          id="category-image"
          {...register('image')}
          placeholder="https://..."
          className={ui.input}
        />
        {imageUrl && (
          <img
            src={imageUrl}
            alt={nameValue || t('categoryName')}
            className="mt-2 h-24 w-24 rounded-[var(--dashboard-radius-sm)] object-cover"
          />
        )}
      </div>

      {/* Emoji */}
      <div>
        <label htmlFor="category-emoji" className={ui.label}>
          {t('emoji')}{' '}
          <span className="text-xs font-normal text-ink-subtle">
            {t('emojiOptional')}
          </span>
        </label>
        <input
          id="category-emoji"
          {...register('emoji')}
          placeholder="🍕"
          className={ui.input}
        />
      </div>

      {/* Submit */}
      <div className="flex flex-wrap gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className={ui.btnPrimary}
        >
          <Save className="h-4 w-4" aria-hidden="true" />
          {isSubmitting ? t('saving') : t('saveCategory')}
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