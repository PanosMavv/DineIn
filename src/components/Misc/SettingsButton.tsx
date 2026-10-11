'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Settings, X, Sun, Moon, Check, ChevronDown } from 'lucide-react';
import { availableLocales, localeCodes } from '@/i18n/locales';

export function SettingsButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLocaleDropdownOpen, setIsLocaleDropdownOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [availableRestaurantLocales, setAvailableRestaurantLocales] = useState<string[]>([]);

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return document.documentElement.classList.contains('dark');
    }
    return true;
  });

  // Fetch available locales for current restaurant
  useEffect(() => {
    const segments = pathname.split('/').filter(Boolean);
    if (segments.length === 1 && !localeCodes.includes(segments[0])) {
      fetch(`/api/restaurant/${segments[0]}/locales`)
        .then(res => res.json())
        .then(data => setAvailableRestaurantLocales(data.locales))
        .catch(() => setAvailableRestaurantLocales(localeCodes));
    } else {
      setAvailableRestaurantLocales([]);
    }
  }, [pathname]);

  const languages = availableRestaurantLocales.length > 0
    ? availableLocales.filter(lang => availableRestaurantLocales.includes(lang.code))
    : availableLocales;

  const currentLanguage = availableLocales.find(l => l.code === locale) || availableLocales[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLocaleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Lock body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const switchLanguage = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=31536000`;
    setIsLocaleDropdownOpen(false);
    router.refresh();
  };

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`fixed inset-x-0 bottom-0 z-50 bg-white dark:bg-gray-900 rounded-t-2xl shadow-lg transition-transform duration-300 ease-out max-w-2xl mx-auto ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
        style={{ maxHeight: '80vh' }}
      >
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
        </div>

        <div className="flex items-center justify-between px-6 py-3">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Settings</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="px-6 pb-8 space-y-6 overflow-y-auto" style={{ maxHeight: 'calc(80vh - 60px)' }}>
          {/* Language dropdown */}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Language</p>
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsLocaleDropdownOpen(!isLocaleDropdownOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currentLanguage.flag}</span>
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {currentLanguage.name}
                    </p>
                    {currentLanguage.nativeName !== currentLanguage.name && (
                      <p className="text-xs text-gray-400">{currentLanguage.nativeName}</p>
                    )}
                  </div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-gray-400 transition-transform ${isLocaleDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {isLocaleDropdownOpen && (
                <div className="mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 max-h-64 overflow-y-auto">
                  {languages.map(lang => (
                    <button
                      key={lang.code}
                      onClick={() => switchLanguage(lang.code)}
                      className="w-full flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{lang.flag}</span>
                        <div className="text-left">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {lang.name}
                          </p>
                          {lang.nativeName !== lang.name && (
                            <p className="text-xs text-gray-400">{lang.nativeName}</p>
                          )}
                        </div>
                      </div>
                      {lang.code === locale && (
                        <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700" />

          {/* Theme toggle */}
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Appearance</p>
            <button
              onClick={toggleTheme}
              className="flex items-center justify-between w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              <div className="flex items-center gap-3">
                {isDark ? (
                  <Moon className="w-5 h-5 text-gray-500" />
                ) : (
                  <Sun className="w-5 h-5 text-yellow-500" />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </span>
              </div>
              <span className="text-xs text-gray-400">{isDark ? 'Switch to light' : 'Switch to dark'}</span>
            </button>
          </div>
        </div>
      </div>

      <button
        onClick={() => {
          const dark = document.documentElement.classList.contains('dark');
          setIsDark(dark);
          setIsOpen(true);
        }}
        className="fixed bottom-4 right-4 z-30 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center transition-all duration-300 hover:scale-105"
        aria-label="Settings"
      >
        <Settings className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </button>
    </>
  );
}