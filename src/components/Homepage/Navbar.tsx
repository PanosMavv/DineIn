'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { authClient } from '@/lib/auth-client';
import { Logo } from '@/components/Misc/Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = authClient.useSession();
  const t = useTranslations('header');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link href="#features" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              {t('features')}
            </Link>
            <Link href="#pricing" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              {t('pricing')}
            </Link>
            <Link href="#restaurants" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              {t('demoMenus')}
            </Link>
          </div>

          {/* User menu - shows on both desktop and mobile */}
          <div className="flex items-center gap-2 shrink-0">
            {session ? (
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-colors block"
                aria-label="Dashboard"
              >
                {session.user.image ? (
                  <img
                    src={session.user.image}
                    alt={session.user.name || 'User'}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-500 flex items-center justify-center text-white text-sm font-bold">
                    {session.user.name?.charAt(0) || 'U'}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/sign-in"
                className="px-5 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                {t('signIn')}
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {isOpen ? (
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              ) : (
                <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex flex-col gap-3">
              <Link href="#features" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('features')}
              </Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('pricing')}
              </Link>
              <Link href="#restaurants" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {t('demoMenus')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}