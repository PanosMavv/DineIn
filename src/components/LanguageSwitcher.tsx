'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const languages = [
  { code: 'en', flag: '🇬🇧' },
  { code: 'el', flag: '🇬🇷' },
  { code: 'de', flag: '🇩🇪' },
];

export function LanguageSwitcher() {
  const [isOpen, setIsOpen] = useState(false);
  const locale = useLocale();
  const router = useRouter();

  const switchLanguage = (code: string) => {
    document.cookie = `locale=${code}; path=/; max-age=31536000`;
    setIsOpen(false);
    router.refresh();
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      <div
        className={`flex flex-col items-center gap-1 bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 transition-all duration-300 origin-bottom w-12 ${
          isOpen
            ? 'rounded-[24px] py-2 px-2'
            : 'rounded-full h-12 justify-center cursor-pointer hover:scale-105'
        }`}
        onClick={() => !isOpen && setIsOpen(true)}
      >
        {isOpen ? (
          languages.map(lang => (
            <button
              key={lang.code}
              onClick={(e) => {
                e.stopPropagation();
                if (lang.code !== locale) switchLanguage(lang.code);
              }}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors text-base ${
                lang.code === locale
                  ? 'bg-gray-100 dark:bg-gray-700'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              aria-label={lang.code}
            >
              <span className="leading-none">{lang.flag}</span>
            </button>
          ))
        ) : (
          <span className="leading-none text-xl">
            {languages.find(l => l.code === locale)?.flag}
          </span>
        )}
      </div>
    </div>
  );
}