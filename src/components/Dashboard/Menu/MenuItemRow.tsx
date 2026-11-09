'use client';

import Link from 'next/link';
import { EyeOff, Pencil, UtensilsCrossed } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';
import { DeleteButton } from '@/components/Dashboard/shared/DeleteButton';
import { ReorderButtons } from '@/components/Dashboard/shared/ReorderButtons';
import type { MenuItemData } from '@/components/Dashboard/Menu/types';

interface Props {
  restaurantId: string;
  item: MenuItemData;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function MenuItemRow({
  restaurantId,
  item,
  canMoveUp,
  canMoveDown,
  disabled,
  onMoveUp,
  onMoveDown,
}: Props) {
  const t = useTranslations('dashboard.menu');
  const name = item.name ?? t('untitledItem');

  return (
    <div className="flex flex-wrap items-center gap-3 px-4 py-3">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--dashboard-radius-sm)] bg-surface-2">
        {item.image ? (
          <img
            src={item.image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <UtensilsCrossed
            className="h-5 w-5 text-ink-subtle"
            aria-hidden="true"
          />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-sm font-semibold text-ink">{name}</p>
          {!item.isAvailable && (
            <span className={`${ui.chip} ${ui.chipMuted}`}>
              <EyeOff className="h-3 w-3" aria-hidden="true" />
              {t('soldOut')}
            </span>
          )}
        </div>
        {item.description && (
          <p className="mt-0.5 line-clamp-1 text-sm text-ink-muted">
            {item.description}
          </p>
        )}
      </div>

      <p className="shrink-0 text-sm font-semibold tabular-nums text-ink">
        €{item.price.toFixed(2)}
      </p>

      <div className="flex basis-full items-center justify-end gap-1 sm:basis-auto">
        <ReorderButtons
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          canMoveUp={canMoveUp}
          canMoveDown={canMoveDown}
          disabled={disabled}
          upLabel={t('moveItemUp', { name })}
          downLabel={t('moveItemDown', { name })}
        />
        <Link
          href={`/dashboard/restaurants/${restaurantId}/menu/${item.id}/edit`}
          className={ui.btnIconSm}
          aria-label={t('editItem', { name })}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Link>
        <DeleteButton
          endpoint={`/api/dashboard/restaurants/${restaurantId}/menu/${item.id}`}
          title={t('deleteItemTitle', { name })}
          description={t('deleteItemBody')}
          triggerLabel={t('deleteItem', { name })}
        />
      </div>
    </div>
  );
}
