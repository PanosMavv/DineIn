import { anyaround } from 'anyaround';

// ============================================================
// LOCALE CONFIGURATION
// ============================================================

/**
 * Curated list of locales exposed in the app.
 *
 * Each entry maps an ISO 639-1 language code to a representative
 * ISO 3166-1 region code. The region is used only to derive the
 * flag emoji in the UI — it's a design choice, not a standard mapping.
 *
 * Add a new entry here to enable a language in the picker.
 */
const EXPOSED_LOCALES = [
  { code: 'en', region: 'GB' }, // British English
  { code: 'el', region: 'GR' }, // Greece
  { code: 'de', region: 'DE' }, // Germany
  { code: 'fr', region: 'FR' }, // France
  { code: 'zh', region: 'CN' }, // China
  { code: 'es', region: 'ES' }, // Spain
  { code: 'it', region: 'IT' }, // Italy
  { code: 'ja', region: 'JP' }, // Japan
  { code: 'ko', region: 'KR' }, // South Korea
  // { code: 'pt', region: 'PT' }, // Portugal
  { code: 'ru', region: 'RU' }, // Russia
  // { code: 'ar', region: 'SA' }, // Saudi Arabia
  // { code: 'hi', region: 'IN' }, // India
  { code: 'sv', region: 'SE' }, // Sweden
  // { code: 'nl', region: 'NL' }, // Netherlands
  { code: 'pl', region: 'PL' }, // Poland
  // { code: 'tr', region: 'TR' }, // Turkey
  // { code: 'th', region: 'TH' }, // Thailand
  // { code: 'vi', region: 'VN' }, // Vietnam
];

export interface Locale {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const availableLocales: Locale[] = EXPOSED_LOCALES
  .map(({ code, region }) => ({
    code,
    name: anyaround(code, { mode: 'language', locale: 'en' }) || code,
    nativeName: anyaround(code, { mode: 'language', locale: code }) || code,
    flag: anyaround(region, { display: 'flag' }) || '🌐',
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const localeCodes = availableLocales.map(l => l.code);

export const defaultLocale = 'en';

export function getLocaleLabel(code: string): string {
  return anyaround(code, { mode: 'language', locale: 'en' }) || code;
}

export function getLocaleNativeName(code: string): string {
  return anyaround(code, { mode: 'language', locale: code }) || code;
}

export function getLocaleFlag(code: string): string {
  const entry = EXPOSED_LOCALES.find(l => l.code === code);
  if (!entry) return '🌐';
  return anyaround(entry.region, { display: 'flag' }) || '🌐';
}