import Link from 'next/link';
import { ArrowLeft, ExternalLink, Eye } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { ui } from '@/lib/ui';

interface Props {
  name: string;
  slug: string;
  backHref: string;
  backLabel: string;
  isLive?: boolean;
  children?: React.ReactNode;
}

export async function RestaurantHeader({
  name,
  slug,
  backHref,
  backLabel,
  isLive,
  children,
}: Props) {
  const t = await getTranslations('dashboard.common');

  return (
    <header className="mb-6">
      <Link
        href={backHref}
        className={`inline-flex items-center gap-2 rounded-sm text-sm text-ink-muted hover:text-ink ${ui.focusRing}`}
      >
        <ArrowLeft className="w-4 h-4" aria-hidden="true" />
        {backLabel}
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="min-w-0 truncate text-2xl font-bold text-ink md:text-3xl">
              {name}
            </h1>
            {isLive !== undefined && (
              <span className={`${ui.chip} ${isLive ? ui.chipSuccess : ui.chipMuted}`}>
                <span
                  className={`h-1.5 w-1.5 rounded-full ${isLive ? 'bg-success' : 'bg-ink-subtle'}`}
                  aria-hidden="true"
                />
                {isLive ? t('live') : t('draft')}
              </span>
            )}
          </div>

          <Link
            href={`/${slug}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`mt-1 inline-flex items-center gap-1.5 rounded-sm text-sm text-ink-muted hover:text-ink ${ui.focusRing}`}
          >
            /{slug}
            <ExternalLink className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          {children ?? (
            <a
              href={`/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className={ui.btnGhost}
            >
              <Eye className="w-4 h-4" aria-hidden="true" />
              {t('preview')}
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
