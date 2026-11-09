import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { routing } from './routing';

type Messages = {
  [key: string]: string | Messages;
};

/**
 * Merge `override` on top of `base` so a locale can be partially translated.
 * Keys missing from the active locale fall back to English instead of rendering
 * the raw `namespace.key` path.
 */
function mergeMessages(base: Messages, override: Messages): Messages {
  const result: Messages = { ...base };

  for (const [key, value] of Object.entries(override)) {
    const baseValue = result[key];

    if (
      value &&
      typeof value === 'object' &&
      !Array.isArray(value) &&
      baseValue &&
      typeof baseValue === 'object' &&
      !Array.isArray(baseValue)
    ) {
      result[key] = mergeMessages(baseValue as Messages, value as Messages);
    } else {
      result[key] = value;
    }
  }

  return result;
}

export default getRequestConfig(async () => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('locale')?.value;

  // Validate cookie locale against available locales
  const locale = cookieLocale && routing.locales.includes(cookieLocale)
    ? cookieLocale
    : routing.defaultLocale;

  const messages = (await import(`../messages/${locale}.json`)).default as Messages;

  if (locale === routing.defaultLocale) {
    return { locale, messages };
  }

  const fallback = (await import('../messages/en.json')).default as Messages;

  return {
    locale,
    messages: mergeMessages(fallback, messages),
  };
});
