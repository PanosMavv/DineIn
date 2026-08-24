'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';
import { authClient } from '@/lib/auth-client';
import { Logo } from '@/components/Misc/Logo';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { data: session } = authClient.useSession();

  const handleSignOut = async () => {
    await authClient.signOut();
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Logo />

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link href="#features" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              Pricing
            </Link>
            <Link href="#restaurants" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 transition-colors">
              Demo Menus
            </Link>
          </div>

          {/* User menu - shows on both desktop and mobile */}
          <div className="flex items-center gap-2 shrink-0">
            {session ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="w-9 h-9 rounded-full overflow-hidden border border-gray-200 dark:border-gray-700"
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
                </button>

                {/* Dropdown - works on mobile too */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 shadow-lg py-2">
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                        {session.user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/dashboard/restaurants"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      My Restaurants
                    </Link>
                    <Link
                      href="/dashboard/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      Profile Settings
                    </Link>
                    <div className="border-t border-gray-100 dark:border-gray-800 mt-2 pt-2">
                      <button
                        onClick={handleSignOut}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/sign-in"
                className="px-5 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                Sign in
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
                Features
              </Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Pricing
              </Link>
              <Link href="#restaurants" onClick={() => setIsOpen(false)} className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                Demo Menus
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}