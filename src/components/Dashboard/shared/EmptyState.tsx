import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { ui } from '@/lib/ui';

interface Props {
  icon: LucideIcon;
  title: string;
  description: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
  secondaryExternal?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  secondaryExternal,
}: Props) {
  return (
    <div className={`${ui.card} flex flex-col items-center px-6 py-12 text-center`}>
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft text-accent-brand">
        <Icon className="h-6 w-6" aria-hidden="true" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-ink">{title}</h2>
      <p className="mt-1 max-w-md text-sm text-ink-muted">{description}</p>

      {(primaryHref && primaryLabel) || (secondaryHref && secondaryLabel) ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
          {primaryHref && primaryLabel && (
            <Link href={primaryHref} className={ui.btnPrimary}>
              {primaryLabel}
            </Link>
          )}
          {secondaryHref && secondaryLabel && (
            <a
              href={secondaryHref}
              target={secondaryExternal ? '_blank' : undefined}
              rel={secondaryExternal ? 'noopener noreferrer' : undefined}
              className={ui.btnGhost}
            >
              {secondaryLabel}
            </a>
          )}
        </div>
      ) : null}
    </div>
  );
}
