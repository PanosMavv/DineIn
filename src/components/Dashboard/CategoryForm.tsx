'use client';

import { useForm } from 'react-hook-form';
import { valibotResolver } from '@hookform/resolvers/valibot';
import * as v from 'valibot';
import { useRouter } from 'next/navigation';
import { Save, X, Globe } from 'lucide-react';
import { useTranslations } from 'next-intl';

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
      <div className="p-4 bg-accent-brand/10 rounded-xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-accent-brand shrink-0 mt-0.5" />
        <p className="text-sm text-accent-brand">
          {t('description')}
        </p>
      </div>

      {/* Name */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('categoryName')} <span className="text-xs text-ink-subtle">{t('englishReminder')}</span>
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

      {/* Image */}
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

      {/* Emoji */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('emoji')} <span className="text-xs text-ink-subtle">{t('emojiOptional')}</span>
        </label>
        <input
          {...register('emoji')}
          placeholder="🍕"
          className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
        />
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-surface rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSubmitting ? t('saving') : t('saveCategory')}
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