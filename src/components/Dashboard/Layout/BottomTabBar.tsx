'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Languages,
  LayoutDashboard,
  Palette,
  Plus,
  Settings,
  User,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslations } from 'next-intl';

export function BottomTabBar() {
  const pathname = usePathname();
  const t = useTranslations('dashboard.nav');

  const restaurantMatch = pathname.match(
    /^\/dashboard\/restaurants\/([^/]+)/
  );
  const restaurantId = restaurantMatch?.[1];
  const restaurantBase = restaurantId
    ? `/dashboard/restaurants/${restaurantId}`
    : null;

  const tabs = restaurantBase
    ? [
        {
          href: restaurantBase,
          label: t('overview'),
          icon: LayoutDashboard,
          active: pathname === restaurantBase,
        },
        {
          href: `${restaurantBase}/menu`,
          label: t('menu'),
          icon: UtensilsCrossed,
          active:
            pathname.startsWith(`${restaurantBase}/menu`) ||
            pathname.startsWith(`${restaurantBase}/categories`),
        },
        {
          href: `${restaurantBase}/theme`,
          label: t('design'),
          icon: Palette,
          active: pathname.startsWith(`${restaurantBase}/theme`),
        },
        {
          href: `${restaurantBase}/translations`,
          label: t('languages'),
          icon: Languages,
          active: pathname.startsWith(`${restaurantBase}/translations`),
        },
        {
          href: `${restaurantBase}/settings`,
          label: t('settings'),
          icon: Settings,
          active: pathname.startsWith(`${restaurantBase}/settings`),
        },
      ]
    : [
        {
          href: '/dashboard',
          label: t('restaurants'),
          icon: Home,
          active: pathname === '/dashboard',
        },
        {
          href: '/dashboard?new=1',
          label: t('newRestaurant'),
          icon: Plus,
          active: false,
        },
        {
          href: '/dashboard/profile',
          label: t('account'),
          icon: User,
          active: pathname.startsWith('/dashboard/profile'),
        },
      ];

  return (
    <nav
      aria-label={restaurantId ? t('thisRestaurant') : t('restaurants')}
      className="fixed bottom-0 left-0 right-0 z-40 border-t border-hairline bg-surface md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="flex items-stretch">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={tab.active ? 'page' : undefined}
            className={[
              'flex flex-1 flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-brand/60',
              tab.active ? 'text-accent-brand' : 'text-ink-muted',
            ].join(' ')}
          >
            <tab.icon className="h-5 w-5" aria-hidden="true" />
            <span>{tab.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
