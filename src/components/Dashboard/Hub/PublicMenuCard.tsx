import { ExternalLink } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';
import { CopyLinkButton } from '@/components/Dashboard/shared/CopyLinkButton';

interface Props {
  slug: string;
}

export async function PublicMenuCard({ slug }: Props) {
  const t = await getTranslations('dashboard.hub');
  const tc = await getTranslations('dashboard.common');

  return (
    <section className={`${ui.card} p-5`}>
      <h2 className={ui.sectionLabel}>{t('publicMenu')}</h2>

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="min-w-0 flex-1 truncate rounded-[var(--dashboard-radius-sm)] bg-surface-2 px-3 py-2 font-mono text-sm text-ink">
          /{slug}
        </div>
        <div className="flex flex-wrap gap-2">
          <CopyLinkButton slug={slug} />
          <a
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={ui.btnGhost}
          >
            <ExternalLink className="h-4 w-4" aria-hidden="true" />
            {tc('openMenu')}
          </a>
        </div>
      </div>

      <p className="mt-2 text-xs text-ink-muted">{t('publicMenuHint')}</p>
    </section>
  );
}
