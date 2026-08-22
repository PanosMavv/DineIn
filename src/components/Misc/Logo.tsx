import Link from 'next/link';
import { QRLogo } from './QRLogo';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  showDashboard?: boolean;
  href?: string;
}

export function Logo({ size = 'md', showDashboard = false, href = '/' }: Props) {
  const sizes = {
    sm: { text: 'text-xl', icon: 'w-6 h-6', dashboard: 'text-xs' },
    md: { text: 'text-2xl', icon: 'w-8 h-8', dashboard: 'text-sm' },
    lg: { text: 'text-3xl', icon: 'w-10 h-10', dashboard: 'text-base' },
  };

  return (
    <Link href={href} className="inline-flex items-center gap-1 shrink-0">
      <QRLogo className={`${sizes[size].icon} shrink-0`} />
      <span className="inline-flex items-end gap-1">
        <span className={`${sizes[size].text} font-extrabold text-gray-900 dark:text-gray-100 leading-none`}>
          Dine<span className="text-blue-600">.</span>In
        </span>
        {showDashboard && (
          <span className={`${sizes[size].dashboard} font-medium text-gray-500 dark:text-gray-400  leading-none mb-0.5`}>
            Dashboard
          </span>
        )}
      </span>
    </Link>
  );
}