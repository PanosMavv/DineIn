// This file defines all available locales for the app
// When adding a new language, add it here AND create the corresponding message file

export const availableLocales = [
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'el', label: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
];

export const localeCodes = availableLocales.map(l => l.code);

export const defaultLocale = 'en';

export function getLocaleLabel(code: string): string {
  return availableLocales.find(l => l.code === code)?.label || code;
}

export function getLocaleFlag(code: string): string {
  return availableLocales.find(l => l.code === code)?.flag || '🌐';
}