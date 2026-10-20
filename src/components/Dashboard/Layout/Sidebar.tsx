'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, UtensilsCrossed, User, LogOut } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import { Logo } from '@/components/Misc/Logo';

export function Sidebar() {
  const pathname = usePathname();
  const t = useTranslations('dashboard');
  const { data: session } = authClient.useSession();

  const navLinks = [
    { href: '/dashboard', label: t('overview.header'), icon: Home },
    { href: '/dashboard/restaurants', label: t('myRestaurants.header'), icon: UtensilsCrossed },
    { href: '/dashboard/profile', label: t('profile.name'), icon: User },
  ];

  const isActive = (href: string) =>
    href === '/dashboard' ? pathname === '/dashboard' : pathname.startsWith(href);

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = '/';
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-surface border-r border-hairline shrink-0">
      <div className="p-6 border-b border-hairline">
        <Logo size="md" showDashboard href="/dashboard" />
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {navLinks.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={[
                'flex items-center gap-3 px-4 py-2.5 rounded-(--dashboard-radius-sm) text-sm font-medium transition-colors',
                active
                  ? 'bg-ink text-surface'
                  : 'text-ink-muted hover:bg-surface-2 hover:text-ink',
              ].join(' ')}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          );
        })}
      </nav>

      {session?.user && (
        <div className="p-3 border-t border-hairline">
          <div className="flex items-center gap-3 px-2 mb-3">
            <div className="w-9 h-9 rounded-full overflow-hidden bg-surface-2 shrink-0">
              {session.user.image ? (
                <img
                  src={session.user.image}
                  alt={session.user.name || 'User'}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-full h-full bg-accent flex items-center justify-center text-white text-sm font-bold">
                  {session.user.name?.charAt(0) || 'U'}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-ink truncate">{session.user.name}</p>
              <p className="text-xs text-ink-subtle truncate">{session.user.email}</p>
            </div>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-(--dashboard-radius-sm) text-sm text-red-600 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {t('signOut')}
          </button>
        </div>
      )}
    </aside>
  );
}