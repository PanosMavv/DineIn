'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, UtensilsCrossed, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';
import { EmptyState } from '@/components/Dashboard/shared/EmptyState';
import { MenuCategorySection } from '@/components/Dashboard/Menu/MenuCategorySection';
import type { MenuCategoryData } from '@/components/Dashboard/Menu/types';

interface Props {
  restaurantId: string;
  slug: string;
  categories: MenuCategoryData[];
}

export function MenuBuilder({ restaurantId, slug, categories }: Props) {
  const router = useRouter();
  const t = useTranslations('dashboard.menu');
  const tc = useTranslations('dashboard.common');
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [isReordering, setIsReordering] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleCategory = (categoryId: string) => {
    setCollapsed((current) => ({
      ...current,
      [categoryId]: !current[categoryId],
    }));
  };

  const reorder = async (payload: {
    type: 'category' | 'item';
    ids: string[];
    categoryId?: string;
  }) => {
    setIsReordering(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}/menu`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error('Reorder failed');
      }

      router.refresh();
    } catch {
      setError(t('reorderFailed'));
    } finally {
      setIsReordering(false);
    }
  };

  const moveCategory = (categoryId: string, direction: -1 | 1) => {
    const index = categories.findIndex((category) => category.id === categoryId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= categories.length) return;

    const ids = categories.map((category) => category.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void reorder({ type: 'category', ids });
  };

  const moveItem = (
    categoryId: string,
    itemId: string,
    direction: -1 | 1
  ) => {
    const category = categories.find((entry) => entry.id === categoryId);
    if (!category) return;

    const index = category.items.findIndex((item) => item.id === itemId);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= category.items.length) return;

    const ids = category.items.map((item) => item.id);
    [ids[index], ids[target]] = [ids[target], ids[index]];
    void reorder({ type: 'item', categoryId, ids });
  };

  if (categories.length === 0) {
    return (
      <EmptyState
        icon={UtensilsCrossed}
        title={t('emptyTitle')}
        description={t('emptyBody')}
        primaryHref={`/dashboard/restaurants/${restaurantId}/categories/new`}
        primaryLabel={t('emptyCta')}
        secondaryHref={`/${slug}`}
        secondaryLabel={t('emptySecondary')}
        secondaryExternal
      />
    );
  }

  return (
    <div className="space-y-4" aria-busy={isReordering}>
      {error && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-[var(--dashboard-radius-sm)] border border-hairline bg-surface px-4 py-3 text-sm text-ink"
        >
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden="true" />
          <span className="flex-1">{error}</span>
          <button
            type="button"
            onClick={() => setError(null)}
            className={ui.btnIconSm}
            aria-label={tc('dismiss')}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}

      {categories.map((category, index) => (
        <MenuCategorySection
          key={category.id}
          restaurantId={restaurantId}
          category={category}
          collapsed={Boolean(collapsed[category.id])}
          onToggle={() => toggleCategory(category.id)}
          canMoveUp={index > 0}
          canMoveDown={index < categories.length - 1}
          disabled={isReordering}
          onMoveUp={() => moveCategory(category.id, -1)}
          onMoveDown={() => moveCategory(category.id, 1)}
          onMoveItem={(itemId, direction) =>
            moveItem(category.id, itemId, direction)
          }
        />
      ))}
    </div>
  );
}
