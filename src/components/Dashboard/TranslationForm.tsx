'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { availableLocales, getLocaleLabel } from '@/i18n/locales';

interface MenuItem {
  id: string;
  image: string | null;
  translations: { locale: string; name: string; description: string | null }[];
}

interface Category {
  id: string;
  theme?: { image: string | null } | null;
  translations: { locale: string; name: string }[];
  menuItems: MenuItem[];
}

interface RestaurantTranslation {
  locale: string;
  name: string;
  description: string | null;
}

interface Props {
  restaurantId: string;
  locale?: string;
  categories: Category[];
  isEditing?: boolean;
  restaurantTranslations?: RestaurantTranslation[];
  existingLocales?: string[];
}

export function TranslationForm({
  restaurantId,
  locale: initialLocale,
  categories,
  isEditing,
  restaurantTranslations,
  existingLocales = [],
}: Props) {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [locale, setLocale] = useState(initialLocale || '');
  const [collapsedCategories, setCollapsedCategories] = useState<Record<string, boolean>>({});

  const initialRestaurantTranslation = restaurantTranslations?.find(
    tr => tr.locale === initialLocale
  );
  const [restaurantName, setRestaurantName] = useState(
    initialRestaurantTranslation?.name || ''
  );
  const [restaurantDescription, setRestaurantDescription] = useState(
    initialRestaurantTranslation?.description || ''
  );
  const [categoryTranslations, setCategoryTranslations] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {};
    if (initialLocale) {
      categories.forEach(cat => {
        const catTr = cat.translations.find(tr => tr.locale === initialLocale);
        map[cat.id] = catTr?.name || '';
      });
    }
    return map;
  });
  const [itemTranslations, setItemTranslations] = useState<Record<string, { name: string; description: string }>>(() => {
    const map: Record<string, { name: string; description: string }> = {};
    if (initialLocale) {
      categories.forEach(cat => {
        cat.menuItems.forEach(item => {
          const itemTr = item.translations.find(tr => tr.locale === initialLocale);
          map[item.id] = {
            name: itemTr?.name || '',
            description: itemTr?.description || '',
          };
        });
      });
    }
    return map;
  });

  const t = useTranslations(
    `dashboard.management.translations.${isEditing ? 'edit' : 'add'}`
  );
  const languageLabel = locale ? getLocaleLabel(locale) : '';

  const handleLocaleChange = (newLocale: string) => {
    setLocale(newLocale);
    const rt = restaurantTranslations?.find(tr => tr.locale === newLocale);
    setRestaurantName(rt?.name || '');
    setRestaurantDescription(rt?.description || '');

    const catMap: Record<string, string> = {};
    categories.forEach(cat => {
      const catTr = cat.translations.find(tr => tr.locale === newLocale);
      catMap[cat.id] = catTr?.name || '';
    });
    setCategoryTranslations(catMap);

    const itemMap: Record<string, { name: string; description: string }> = {};
    categories.forEach(cat => {
      cat.menuItems.forEach(item => {
        const itemTr = item.translations.find(tr => tr.locale === newLocale);
        itemMap[item.id] = {
          name: itemTr?.name || '',
          description: itemTr?.description || '',
        };
      });
    });
    setItemTranslations(itemMap);
  };

  const toggleCategory = (categoryId: string) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryId]: !(prev[categoryId] ?? true),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = `/api/dashboard/restaurants/${restaurantId}/translations`;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locale,
          restaurant: {
            name: restaurantName,
            description: restaurantDescription,
          },
          categories: categoryTranslations,
          items: itemTranslations,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to save');
      }

      router.push(`/dashboard/restaurants/${restaurantId}/translations`);
      router.refresh();
    } catch {
      setError(t('saveFailed'));
    } finally {
      setIsSaving(false);
    }
  };

  const getEnglishName = (item: MenuItem) => {
    return item.translations.find(tr => tr.locale === 'en')?.name || t('untitled');
  };

  const getEnglishCategoryName = (category: Category) => {
    return category.translations.find(tr => tr.locale === 'en')?.name || t('unnamedCategory');
  };

  // Filter available locales to exclude existing ones
  const availableNewLocales = availableLocales.filter(
    loc => !existingLocales.includes(loc.code)
  );

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-[var(--dashboard-radius-sm)] bg-red-500/10 p-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Language notice */}
      <div className="p-4 bg-accent-brand/10 rounded-xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-accent-brand shrink-0 mt-0.5" />
        <p className="text-sm text-accent-brand">
          {t('description')}
        </p>
      </div>

      {/* Locale selector - only on add */}
      {!isEditing && (
        <div>
          <label htmlFor="translation-locale" className="mb-1 block text-sm font-medium text-ink">
            {t('selectLanguage')}
          </label>
          <div className="relative">
            <select
              id="translation-locale"
              value={locale}
              onChange={(e) => handleLocaleChange(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface rounded-xl border border-hairline text-ink appearance-none cursor-pointer hover:border-ink-subtle transition-colors pr-10"
            >
              <option value="">{t('selectLanguage')}</option>
              {availableNewLocales.map(loc => (
                <option key={loc.code} value={loc.code}>
                  {loc.flag} {loc.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-5 h-5 text-ink-subtle absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Restaurant section */}
      {locale && (
        <>
          <div className="bg-surface rounded-2xl border border-hairline p-6 space-y-4">
            <h3 className="text-lg font-semibold text-ink">
              {t('restaurant')}
            </h3>
            {restaurantTranslations?.find(tr => tr.locale === 'en') && (
              <p className="text-xs text-ink-muted">
                {t('englishReference')} <span className="font-medium text-ink">
                  {restaurantTranslations.find(tr => tr.locale === 'en')?.name}
                </span>
              </p>
            )}
            <div>
              <label htmlFor="translation-restaurant-name" className="mb-1 block text-sm font-medium text-ink">
                {t('nameIn', { locale: languageLabel })}
              </label>
              <input
                id="translation-restaurant-name"
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
              />
            </div>
            <div>
              <label htmlFor="translation-restaurant-description" className="mb-1 block text-sm font-medium text-ink">
                {t('descriptionIn', { locale: languageLabel })}
              </label>
              <textarea
                id="translation-restaurant-description"
                value={restaurantDescription}
                onChange={(e) => setRestaurantDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink field-sizing-content"
              />
            </div>
          </div>

          {/* Categories */}
          {categories.map(category => {
            const isCollapsed = collapsedCategories[category.id] ?? true;
            return (
            <div
              key={category.id}
              className="bg-surface rounded-2xl border border-hairline overflow-hidden"
            >
              {/* Category header - darker background */}
              <div className="flex items-start gap-3 bg-surface-2 px-4 py-3">
                {/* Category image */}
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-[var(--dashboard-radius-sm)] bg-hairline">
                  {category.theme?.image ? (
                    <Image
                      src={category.theme.image}
                      alt={getEnglishCategoryName(category)}
                      width={40}
                      height={40}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-lg" aria-hidden="true">📁</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.id)}
                    aria-expanded={!isCollapsed}
                    aria-controls={`translation-category-${category.id}`}
                    className="flex w-full items-center justify-between gap-2 text-left"
                  >
                    <span className="text-xs text-ink-muted">
                      {t('categoryEnglishLabel')} {getEnglishCategoryName(category)}
                    </span>
                    {isCollapsed ? (
                      <ChevronDown className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                    ) : (
                      <ChevronUp className="h-5 w-5 shrink-0 text-ink-muted" aria-hidden="true" />
                    )}
                  </button>
                  <input
                    type="text"
                    value={categoryTranslations[category.id] || ''}
                    onChange={(e) => setCategoryTranslations({
                      ...categoryTranslations,
                      [category.id]: e.target.value,
                    })}
                    aria-label={t('categoryNamePlaceholder', { locale: languageLabel })}
                    placeholder={t('categoryNamePlaceholder', { locale: languageLabel })}
                    className="mt-1 w-full px-3 py-1.5 bg-surface rounded-lg border border-hairline text-sm text-ink"
                  />
                </div>
              </div>

              {/* Items - only show if not collapsed */}
              <div
                id={`translation-category-${category.id}`}
                hidden={isCollapsed}
                className="divide-y divide-hairline"
              >
                {category.menuItems.map(item => (
                  <div key={item.id} className="flex gap-3 px-4 py-3">
                    {/* Item image */}
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-[var(--dashboard-radius-sm)] bg-surface-2">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={getEnglishName(item)}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        <span className="text-lg" aria-hidden="true">🍽️</span>
                      )}
                    </div>

                    {/* Translation inputs */}
                    <div className="flex-1 space-y-2">
                      <p className="text-xs text-ink-muted">
                        {t('englishReference')} <span className="font-medium text-ink">{getEnglishName(item)}</span>
                      </p>
                      <input
                        type="text"
                        value={itemTranslations[item.id]?.name || ''}
                        onChange={(e) => setItemTranslations({
                          ...itemTranslations,
                          [item.id]: {
                            ...itemTranslations[item.id],
                            name: e.target.value,
                          },
                        })}
                        aria-label={t('itemNamePlaceholder', { locale: languageLabel })}
                        placeholder={t('itemNamePlaceholder', { locale: languageLabel })}
                        className="w-full px-3 py-1.5 bg-surface rounded-lg border border-hairline text-sm text-ink"
                      />
                      <textarea
                        value={itemTranslations[item.id]?.description || ''}
                        onChange={(e) => setItemTranslations({
                          ...itemTranslations,
                          [item.id]: {
                            ...itemTranslations[item.id],
                            description: e.target.value,
                          },
                        })}
                        rows={1}
                        aria-label={t('itemDescriptionPlaceholder', { locale: languageLabel })}
                        placeholder={t('itemDescriptionPlaceholder', { locale: languageLabel })}
                        className="w-full px-3 py-1.5 bg-surface rounded-lg border border-hairline text-sm text-ink field-sizing-content"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            );
          })}
        </>
      )}

      {/* Submit */}
      {locale && (
        <div className="flex gap-3 pt-4">
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-ink text-surface rounded-full font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? t('saving') : t('saveTranslation')}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-hairline rounded-full font-semibold text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="w-4 h-4" />
            {t('cancel')}
          </button>
        </div>
      )}
    </form>
  );
}