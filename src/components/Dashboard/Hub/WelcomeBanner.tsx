import { Sparkles } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';

interface Props {
  name: string;
  hasCategories: boolean;
}

export async function WelcomeBanner({ name, hasCategories }: Props) {
  const t = await getTranslations('dashboard.hub');

  return (
    <div
      role="status"
      className={`${ui.card} mb-6 flex items-start gap-3 border-accent-brand/20 bg-accent-soft p-4`}
    >
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-accent-brand">
        <Sparkles className="h-5 w-5" aria-hidden="true" />
      </span>
      <div>
        <p className="text-sm font-semibold text-ink">
          {t('welcomeTitle', { name })}
        </p>
        <p className="mt-0.5 text-sm text-ink-muted">
          {hasCategories ? t('welcomeBodyHasCategories') : t('welcomeBody')}
        </p>
      </div>
    </div>
  );
}
