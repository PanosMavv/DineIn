import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';

interface Props {
  restaurantId: string;
}

export async function NotLiveBanner({ restaurantId }: Props) {
  const t = await getTranslations('dashboard.hub');

  return (
    <div
      role="status"
      className={`${ui.card} mb-6 flex flex-col gap-3 border-accent-brand/30 p-4 sm:flex-row sm:items-center sm:justify-between`}
    >
      <div className="flex items-start gap-3">
        <AlertTriangle
          className="mt-0.5 h-5 w-5 shrink-0 text-accent-brand"
          aria-hidden="true"
        />
        <div>
          <p className="text-sm font-semibold text-ink">{t('notLive')}</p>
          <p className="text-sm text-ink-muted">{t('notLiveBody')}</p>
        </div>
      </div>
      <Link
        href={`/dashboard/restaurants/${restaurantId}/translations`}
        className={`${ui.btnGhost} shrink-0`}
      >
        {t('notLiveCta')}
      </Link>
    </div>
  );
}
