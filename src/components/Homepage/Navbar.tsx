'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8 text-gray-900 dark:text-gray-100" viewBox="0 0 100 100" fill="none">
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="5.5" y="5.5" width="2" height="2" rx="0.5" fill="currentColor" />

                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="16.5" y="5.5" width="2" height="2" rx="0.5" fill="currentColor" />

                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="5.5" y="16.5" width="2" height="2" rx="0.5" fill="currentColor" />

                <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                <circle cx="17" cy="17" r="1.5" fill="currentColor" />
                <circle cx="7" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="7" r="1" fill="currentColor" />
                <circle cx="17" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="17" r="1" fill="currentColor" />
                <circle cx="14" cy="14" r="0.8" fill="currentColor" />
                <circle cx="10" cy="14" r="0.8" fill="currentColor" />
                <circle cx="14" cy="10" r="0.8" fill="currentColor" />
                <circle cx="10" cy="10" r="0.8" fill="currentColor" />
              </svg>
            </svg>
            <span className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">
              Dine<span className="text-blue-600">.</span>In
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-8 flex-1 justify-center">
            <Link href="#features" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Features
            </Link>
            <Link href="#pricing" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Pricing
            </Link>
            <Link href="#restaurants" className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Demo Menus
            </Link>
          </div>

          {/* Desktop sign in */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/sign-in"
              className="px-5 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors"
            >
              Sign in
            </Link>
          </div>

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

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-200 dark:border-gray-800 pt-4">
            <div className="flex flex-col gap-3">
              <Link
                href="#features"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Features
              </Link>
              <Link
                href="#pricing"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Pricing
              </Link>
              <Link
                href="#restaurants"
                onClick={() => setIsOpen(false)}
                className="text-sm font-semibold text-gray-900 dark:text-gray-100"
              >
                Demo Menus
              </Link>
              <Link
                href="/sign-in"
                onClick={() => setIsOpen(false)}
                className="px-5 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors w-fit mt-2"
              >
                Sign in
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}