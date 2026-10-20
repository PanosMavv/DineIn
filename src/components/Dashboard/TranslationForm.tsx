'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { availableLocales } from '@/i18n/locales';

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

  const [restaurantName, setRestaurantName] = useState('');
  const [restaurantDescription, setRestaurantDescription] = useState('');
  const [categoryTranslations, setCategoryTranslations] = useState<Record<string, string>>({});
  const [itemTranslations, setItemTranslations] = useState<Record<string, { name: string; description: string }>>({});

  const t = useTranslations(
    `dashboard.management.translations.${isEditing ? 'edit' : 'add'}`
  );

  // Initialize all categories as collapsed
  useEffect(() => {
    const initialCollapsed: Record<string, boolean> = {};
    categories.forEach(cat => {
      initialCollapsed[cat.id] = true;
    });
    setCollapsedCategories(initialCollapsed);
  }, [categories]);

  // Load existing translations when editing
  useEffect(() => {
    if (initialLocale) {
      const rt = restaurantTranslations?.find(tr => tr.locale === initialLocale);
      setRestaurantName(rt?.name || '');
      setRestaurantDescription(rt?.description || '');

      const catMap: Record<string, string> = {};
      categories.forEach(cat => {
        const catTr = cat.translations.find(tr => tr.locale === initialLocale);
        catMap[cat.id] = catTr?.name || '';
      });
      setCategoryTranslations(catMap);

      const itemMap: Record<string, { name: string; description: string }> = {};
      categories.forEach(cat => {
        cat.menuItems.forEach(item => {
          const itemTr = item.translations.find(tr => tr.locale === initialLocale);
          itemMap[item.id] = {
            name: itemTr?.name || '',
            description: itemTr?.description || '',
          };
        });
      });
      setItemTranslations(itemMap);
    }
  }, [initialLocale, categories, restaurantTranslations]);

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
      [categoryId]: !prev[categoryId],
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
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
        <div className="p-4 bg-red-500/10 text-red-600 rounded-xl text-sm">
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
          <label className="block text-sm font-medium text-ink mb-1">
            {t('selectLanguage')}
          </label>
          <div className="relative">
            <select
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
              <label className="block text-sm font-medium text-ink mb-1">
                {t('nameIn', { locale: locale.toUpperCase() })}
              </label>
              <input
                type="text"
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-ink mb-1">
                {t('descriptionIn', { locale: locale.toUpperCase() })}
              </label>
              <textarea
                value={restaurantDescription}
                onChange={(e) => setRestaurantDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink field-sizing-content"
              />
            </div>
          </div>

          {/* Categories */}
          {categories.map(category => (
            <div
              key={category.id}
              className="bg-surface rounded-2xl border border-hairline overflow-hidden"
            >
              {/* Category header - darker background */}
              <button
                type="button"
                onClick={() => toggleCategory(category.id)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-surface-2"
              >
                {/* Category image */}
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-hairline flex items-center justify-center shrink-0">
                  {category.theme?.image ? (
                    <Image
                      src={category.theme.image}
                      alt={getEnglishCategoryName(category)}
                      width={40}
                      height={40}
                      className="object-cover w-full h-full"
                      unoptimized
                    />
                  ) : (
                    <span className="text-lg">📁</span>
                  )}
                </div>

                <div className="flex-1 text-left">
                  <p className="text-xs text-ink-muted">
                    {t('categoryEnglishLabel')} {getEnglishCategoryName(category)}
                  </p>
                  <input
                    type="text"
                    value={categoryTranslations[category.id] || ''}
                    onChange={(e) => setCategoryTranslations({
                      ...categoryTranslations,
                      [category.id]: e.target.value,
                    })}
                    onClick={(e) => e.stopPropagation()}
                    placeholder={t('categoryNamePlaceholder', { locale: locale.toUpperCase() })}
                    className="mt-1 w-full px-3 py-1.5 bg-surface rounded-lg border border-hairline text-sm text-ink"
                  />
                </div>

                {collapsedCategories[category.id] ? (
                  <ChevronDown className="w-5 h-5 text-ink-muted shrink-0" />
                ) : (
                  <ChevronUp className="w-5 h-5 text-ink-muted shrink-0" />
                )}
              </button>

              {/* Items - only show if not collapsed */}
              {!collapsedCategories[category.id] && (
                <div className="divide-y divide-hairline">
                  {category.menuItems.map(item => (
                    <div key={item.id} className="px-4 py-3 flex gap-3">
                      {/* Item image */}
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-surface-2 flex items-center justify-center shrink-0">
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={getEnglishName(item)}
                            width={48}
                            height={48}
                            className="object-cover w-full h-full"
                            unoptimized
                          />
                        ) : (
                          <span className="text-lg">🍽️</span>
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
                          placeholder={t('itemNamePlaceholder', { locale: locale.toUpperCase() })}
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
                          placeholder={t('itemDescriptionPlaceholder', { locale: locale.toUpperCase() })}
                          className="w-full px-3 py-1.5 bg-surface rounded-lg border border-hairline text-sm text-ink field-sizing-content"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
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