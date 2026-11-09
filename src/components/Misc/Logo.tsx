'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { QRLogo } from './QRLogo';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showDashboard?: boolean;
  href?: string;
}

export function Logo({ size = 'md', showDashboard = false, href = '/' }: Props) {
  const t = useTranslations('dashboard.nav');
  const sizes = {
    sm: { text: 'text-xl', icon: 'w-6 h-6', dashboard: 'text-xs' },
    md: { text: 'text-2xl', icon: 'w-8 h-8', dashboard: 'text-sm' },
    lg: { text: 'text-3xl', icon: 'w-10 h-10', dashboard: 'text-base' },
  };

  return (
    <Link href={href} className="inline-flex items-center gap-1 shrink-0">
      <QRLogo className={`${sizes[size].icon} shrink-0`} />
      <span className="inline-flex items-end gap-1">
        <span className={`${sizes[size].text} font-extrabold text-ink leading-none`}>
          Dine<span className="text-accent-brand">.</span>In
        </span>
        {showDashboard && (
          <span className={`${sizes[size].dashboard} font-medium text-ink-muted leading-none mb-0.5`}>
            {t('dashboard')}
          </span>
        )}
      </span>
    </Link>
  );
}
