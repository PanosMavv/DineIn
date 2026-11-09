'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Languages,
  LayoutDashboard,
  LogOut,
  Palette,
  Plus,
  UtensilsCrossed,
} from 'lucide-react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import { Logo } from '@/components/Misc/Logo';
import { ui } from '@/lib/ui';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('dashboard.nav');
  const td = useTranslations('dashboard');
  const { data: session } = authClient.useSession();

  const restaurantMatch = pathname.match(
    /^\/dashboard\/restaurants\/([^/]+)/
  );
  const restaurantId = restaurantMatch?.[1];
  const restaurantBase = restaurantId
    ? `/dashboard/restaurants/${restaurantId}`
    : null;

  const isRestaurantsActive = pathname === '/dashboard';

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  const navItemClass = (active: boolean) =>
    [
      'flex items-center gap-3 px-4 py-2.5 rounded-[var(--dashboard-radius-sm)] text-sm font-medium transition-colors',
      ui.focusRing,
      active
        ? 'bg-ink text-surface'
        : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
    ].join(' ');

  const restaurantLinks = restaurantBase
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
      ]
    : [];

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-hairline bg-surface md:flex">
      <div className="border-b border-hairline p-6">
        <Logo size="md" showDashboard href="/dashboard" />
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        <Link
          href="/dashboard"
          aria-current={isRestaurantsActive ? 'page' : undefined}
          className={navItemClass(isRestaurantsActive)}
        >
          <Home className="h-5 w-5" aria-hidden="true" />
          {t('restaurants')}
        </Link>

        <Link
          href="/dashboard?new=1"
          className={`flex items-center gap-3 rounded-[var(--dashboard-radius-sm)] px-4 py-2.5 text-sm font-medium text-accent-brand transition-colors hover:bg-accent-soft ${ui.focusRing}`}
        >
          <Plus className="h-5 w-5" aria-hidden="true" />
          {t('newRestaurant')}
        </Link>

        {restaurantId && (
          <div className="pt-4">
            <p className={`${ui.sectionLabel} px-4 pb-2`}>{t('thisRestaurant')}</p>
            <div className="space-y-1">
              {restaurantLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={link.active ? 'page' : undefined}
                  className={navItemClass(link.active)}
                >
                  <link.icon className="h-5 w-5" aria-hidden="true" />
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {session?.user && (
        <div className="border-t border-hairline p-3">
          <Link
            href="/dashboard/profile"
            className={`mb-2 flex items-center gap-3 rounded-[var(--dashboard-radius-sm)] px-2 py-2 transition-colors hover:bg-surface-2 ${ui.focusRing}`}
          >
            <div className="h-9 w-9 shrink-0 overflow-hidden rounded-full bg-surface-2">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="h-full w-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-accent-brand text-sm font-bold text-white">
                  {session.user.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-ink">
                {session.user.name}
              </p>
              <p className="truncate text-xs text-ink-muted">
                {session.user.email}
              </p>
            </div>
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className={`flex w-full items-center gap-3 rounded-[var(--dashboard-radius-sm)] px-4 py-2.5 text-sm text-red-600 transition-colors hover:bg-red-500/10 ${ui.focusRing}`}
          >
            <LogOut className="h-5 w-5" aria-hidden="true" />
            {td('signOut')}
          </button>
        </div>
      )}
    </aside>
  );
}
