import Link from 'next/link';
import { Pencil } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import { ProgressBar } from '@/components/Dashboard/shared/ProgressBar';
import { DeleteButton } from '@/components/Dashboard/shared/DeleteButton';
import { ToggleTranslation } from '@/components/Dashboard/ToggleTranslation';

interface Props {
  restaurantId: string;
  locale: string;
  label: string;
  nativeName: string;
  flag: string;
  translated: number;
  total: number;
  isActive: boolean;
  hasRestaurantTranslation: boolean;
  isDefault: boolean;
}

export async function LanguageRow({
  restaurantId,
  locale,
  label,
  nativeName,
  flag,
  translated,
  total,
  isActive,
  hasRestaurantTranslation,
  isDefault,
}: Props) {
  const t = await getTranslations('dashboard.languages');
  const progressLabel = t('progress', { translated, total });

  const status = !hasRestaurantTranslation
    ? { className: ui.chipMuted, text: t('needsName') }
    : isDefault
      ? { className: ui.chipAccent, text: t('default') }
      : isActive
        ? { className: ui.chipSuccess, text: t('live') }
        : { className: ui.chipMuted, text: t('hidden') };

  const toggleLabel =
    isDefault && !isActive
      ? t('publishEnglish')
      : isActive
        ? t('hideLanguage', { language: label })
        : t('showLanguage', { language: label });

  return (
    <div className={`${ui.card} flex flex-wrap items-center gap-4 p-4`}>
      <span
        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface-2 text-xl"
        aria-hidden="true"
      >
        {flag}
      </span>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h2 className="text-sm font-semibold text-ink">{label}</h2>
          {nativeName && nativeName !== label && (
            <span className="text-xs text-ink-muted">{nativeName}</span>
          )}
          <span className={`${ui.chip} ${status.className}`}>{status.text}</span>
        </div>

        <p className="mt-1 text-xs text-ink-muted">{progressLabel}</p>
        <div className="mt-2 max-w-xs">
          <ProgressBar value={translated} total={total} label={progressLabel} />
        </div>
        {!hasRestaurantTranslation && (
          <p className="mt-1 text-xs text-ink-muted">{t('needsNameHint')}</p>
        )}
      </div>

      <div className="flex basis-full items-center justify-end gap-1 sm:basis-auto">
        {hasRestaurantTranslation && (
          <ToggleTranslation
            restaurantId={restaurantId}
            locale={locale}
            isActive={isActive}
            label={toggleLabel}
            disabled={isDefault && isActive}
          />
        )}
        <Link
          href={`/dashboard/restaurants/${restaurantId}/translations/${locale}/edit`}
          className={ui.btnIconSm}
          aria-label={t('editLanguage', { language: label })}
        >
          <Pencil className="h-4 w-4" aria-hidden="true" />
        </Link>
        {!isDefault && (
          <DeleteButton
            endpoint={`/api/dashboard/restaurants/${restaurantId}/translations/${locale}`}
            title={t('deleteLanguageTitle', { language: label })}
            description={t('deleteLanguageBody')}
            triggerLabel={t('deleteLanguage', { language: label })}
          />
        )}
      </div>
    </div>
  );
}
