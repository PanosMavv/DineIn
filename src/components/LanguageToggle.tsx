'use client';

import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';

const flags = {
  en: '🇬🇧',
  el: '🇬🇷',
  de: '🇩🇪',
};

export function LanguageToggle() {
  const locale = useLocale();
  const router = useRouter();

  const cycleLanguage = () => {
    const codes = Object.keys(flags);
    const currentIndex = codes.indexOf(locale);
    const nextIndex = (currentIndex + 1) % codes.length;
    const newLocale = codes[nextIndex];

    document.cookie = `locale=${newLocale}; path=/; max-age=31536000`;
    router.refresh();
  };

  return (
    <button
      onClick={cycleLanguage}
      className="fixed bottom-20 right-4 z-50 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-200 dark:border-gray-700 flex items-center justify-center text-xl transition-colors"
      aria-label="Switch language"
    >
      <span className="leading-none">{flags[locale as keyof typeof flags]}</span>
    </button>
  );
}