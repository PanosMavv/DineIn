'use client';

import Link from 'next/link';
import {
  ChevronDown,
  Pencil,
  Plus,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';
import { DeleteButton } from '@/components/Dashboard/shared/DeleteButton';
import { ReorderButtons } from '@/components/Dashboard/shared/ReorderButtons';
import { MenuItemRow } from '@/components/Dashboard/Menu/MenuItemRow';
import type { MenuCategoryData } from '@/components/Dashboard/Menu/types';

interface Props {
  restaurantId: string;
  category: MenuCategoryData;
  collapsed: boolean;
  onToggle: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onMoveItem: (itemId: string, direction: -1 | 1) => void;
}

export function MenuCategorySection({
  restaurantId,
  category,
  collapsed,
  onToggle,
  canMoveUp,
  canMoveDown,
  disabled,
  onMoveUp,
  onMoveDown,
  onMoveItem,
}: Props) {
  const t = useTranslations('dashboard.menu');
  const tc = useTranslations('dashboard.common');
  const name = category.name ?? t('untitledCategory');
  const contentId = `category-${category.id}`;

  return (
    <section className={`${ui.card} overflow-hidden`}>
      <div className="flex flex-wrap items-center gap-2 border-b border-hairline bg-surface-2 px-2 py-2 sm:px-3">
        <h3 className="min-w-[9rem] flex-1">
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={!collapsed}
            aria-controls={contentId}
            className={`flex w-full items-center gap-3 rounded-[var(--dashboard-radius-sm)] px-2 py-1.5 text-left transition-colors hover:bg-surface ${ui.focusRing}`}
          >
            <ChevronDown
              className={`h-4 w-4 shrink-0 text-ink-muted transition-transform ${collapsed ? '-rotate-90' : ''}`}
              aria-hidden="true"
            />
            <span className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--dashboard-radius-sm)] bg-surface">
              {category.image ? (
                <img
                  src={category.image}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : category.emoji ? (
                <span className="text-lg" aria-hidden="true">
                  {category.emoji}
                </span>
              ) : (
                <UtensilsCrossed
                  className="h-4 w-4 text-ink-subtle"
                  aria-hidden="true"
                />
              )}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold text-ink">
                {name}
              </span>
              <span className="block text-xs text-ink-muted">
                {tc('itemCount', { count: category.items.length })}
              </span>
            </span>
          </button>
        </h3>

        <div className="flex basis-full items-center justify-end gap-1 sm:basis-auto">
          <ReorderButtons
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            canMoveUp={canMoveUp}
            canMoveDown={canMoveDown}
            disabled={disabled}
            upLabel={t('moveCategoryUp', { name })}
            downLabel={t('moveCategoryDown', { name })}
          />
          <Link
            href={`/dashboard/restaurants/${restaurantId}/menu/new?category=${category.id}`}
            className={ui.btnIconSm}
            aria-label={t('addDishTo', { name })}
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </Link>
          <Link
            href={`/dashboard/restaurants/${restaurantId}/categories/${category.id}/edit`}
            className={ui.btnIconSm}
            aria-label={t('editCategory', { name })}
          >
            <Pencil className="h-4 w-4" aria-hidden="true" />
          </Link>
          <DeleteButton
            endpoint={`/api/dashboard/restaurants/${restaurantId}/categories/${category.id}`}
            title={t('deleteCategoryTitle', { name })}
            description={t('deleteCategoryBody')}
            triggerLabel={t('deleteCategory', { name })}
          />
        </div>
      </div>

      <div id={contentId} hidden={collapsed}>
        {category.items.length === 0 ? (
          <div className="flex flex-col items-center gap-1.5 px-4 py-8 text-center">
            <p className="text-sm text-ink-muted">{t('noDishes')}</p>
            <Link
              href={`/dashboard/restaurants/${restaurantId}/menu/new?category=${category.id}`}
              className={ui.link}
            >
              {t('addFirstDish')}
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-hairline">
            {category.items.map((item, index) => (
              <MenuItemRow
                key={item.id}
                restaurantId={restaurantId}
                item={item}
                canMoveUp={index > 0}
                canMoveDown={index < category.items.length - 1}
                disabled={disabled}
                onMoveUp={() => onMoveItem(item.id, -1)}
                onMoveDown={() => onMoveItem(item.id, 1)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
