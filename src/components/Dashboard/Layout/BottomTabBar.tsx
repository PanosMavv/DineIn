'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, User } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BottomTabBar() {
  const pathname = usePathname();
  const t = useTranslations('dashboard');

  const tabs = [
    { href: '/dashboard', label: t('overview.header'), icon: Home },
    { href: '/dashboard/restaurants', label: t('myRestaurants.header'), icon: UtensilsCrossed },
    { href: '/dashboard/profile', label: t('profile.name'), icon: User },
  ];

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-hairline"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={[
                'flex-1 flex flex-col items-center gap-1 py-2.5 text-xs font-medium transition-colors',
                active ? 'text-accent' : 'text-ink-subtle',
              ].join(' ')}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}