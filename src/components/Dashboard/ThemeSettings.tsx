'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Image as ImageIcon, Plus, Save, Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';

interface Props {
  restaurantId: string;
  currentTemplate: string;
  currentLogo: string | null;
  carouselImages: { id: string; image: string; order: number }[];
}

export function ThemeSettings({
  restaurantId,
  currentTemplate,
  currentLogo,
  carouselImages,
}: Props) {
  const router = useRouter();
  const t = useTranslations('dashboard.management.theme');
  const tTemplates = useTranslations('dashboard.onboarding.templates');
  const [template, setTemplate] = useState(currentTemplate);
  const [logoUrl, setLogoUrl] = useState(currentLogo || '');
  const [newCarouselImage, setNewCarouselImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState('');

  const templates = [
    { value: 'simple-list', label: tTemplates('simple-list.name') },
    { value: 'category-cards', label: tTemplates('category-cards.name') },
    { value: 'fast-food', label: tTemplates('fast-food.name') },
  ];

  const startSaving = () => {
    setIsSaving(true);
    setError('');
    setSaved('');
  };

  const finishSaving = () => {
    setIsSaving(false);
    setSaved(t('saved'));
  };

  const handleSaveTemplate = async () => {
    startSaving();

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}/theme`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ template }),
        }
      );

      if (!response.ok) throw new Error('Save failed');

      router.refresh();
      finishSaving();
    } catch {
      setError(t('saveFailed'));
      setIsSaving(false);
    }
  };

  const handleSaveLogo = async () => {
    startSaving();

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}/theme`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ logoImage: logoUrl }),
        }
      );

      if (!response.ok) throw new Error('Save failed');

      router.refresh();
      finishSaving();
    } catch {
      setError(t('saveFailed'));
      setIsSaving(false);
    }
  };

  const handleAddCarouselImage = async () => {
    if (!newCarouselImage.trim()) return;
    startSaving();

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}/theme/carousel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: newCarouselImage }),
        }
      );

      if (!response.ok) throw new Error('Save failed');

      setNewCarouselImage('');
      router.refresh();
      finishSaving();
    } catch {
      setError(t('addImageFailed'));
      setIsSaving(false);
    }
  };

  const handleDeleteCarouselImage = async (imageId: string) => {
    startSaving();

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}/theme/carousel/${imageId}`,
        { method: 'DELETE' }
      );

      if (!response.ok) throw new Error('Save failed');

      router.refresh();
      finishSaving();
    } catch {
      setError(t('deleteImageFailed'));
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      {error && (
        <div
          role="alert"
          className="rounded-[var(--dashboard-radius-sm)] bg-red-500/10 p-4 text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {saved && (
        <div
          role="status"
          className="rounded-[var(--dashboard-radius-sm)] bg-success/10 p-3 text-sm text-success"
        >
          {saved}
        </div>
      )}

      {/* Template selection */}
      <section className={`${ui.card} p-5`}>
        <h2 className="text-lg font-semibold text-ink">{t('menuTemplate')}</h2>
        <div className="mt-3 space-y-3">
          <label htmlFor="theme-template" className={ui.label}>
            {t('menuTemplate')}
          </label>
          <select
            id="theme-template"
            value={template}
            onChange={(event) => setTemplate(event.target.value)}
            className={ui.select}
          >
            {templates.map((entry) => (
              <option key={entry.value} value={entry.value}>
                {entry.label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={handleSaveTemplate}
            disabled={isSaving}
            className={ui.btnPrimary}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {t('saveTemplate')}
          </button>
        </div>
      </section>

      {/* Logo */}
      <section className={`${ui.card} p-5`}>
        <h2 className="text-lg font-semibold text-ink">{t('logo')}</h2>
        <div className="mt-3 space-y-3">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-2">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={t('logo')}
                  className="h-full w-full object-cover"
                />
              ) : (
                <ImageIcon className="h-8 w-8 text-ink-subtle" aria-hidden="true" />
              )}
            </div>
            <div className="min-w-0 flex-1">
              <label htmlFor="theme-logo-url" className={ui.label}>
                {t('logoUrl')}
              </label>
              <input
                id="theme-logo-url"
                type="text"
                value={logoUrl}
                onChange={(event) => setLogoUrl(event.target.value)}
                placeholder="https://example.com/logo.jpg"
                className={ui.input}
              />
            </div>
          </div>
          <button
            type="button"
            onClick={handleSaveLogo}
            disabled={isSaving}
            className={ui.btnPrimary}
          >
            <Save className="h-4 w-4" aria-hidden="true" />
            {t('saveLogo')}
          </button>
        </div>
      </section>

      {/* Photos */}
      <section className={`${ui.card} p-5`}>
        <h2 className="text-lg font-semibold text-ink">{t('carouselImages')}</h2>

        {carouselImages.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3">
            {carouselImages.map((image, index) => (
              <div key={image.id} className="relative">
                <div className="h-20 w-32 overflow-hidden rounded-[var(--dashboard-radius-sm)] bg-surface-2">
                  <img
                    src={image.image}
                    alt={t('carouselImageAlt', { index: index + 1 })}
                    className="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDeleteCarouselImage(image.id)}
                  disabled={isSaving}
                  className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white transition-opacity disabled:opacity-50"
                  aria-label={t('deleteImage')}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 space-y-3">
          <label htmlFor="theme-carousel-url" className={ui.label}>
            {t('addCarouselImage')}
          </label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              id="theme-carousel-url"
              type="text"
              value={newCarouselImage}
              onChange={(event) => setNewCarouselImage(event.target.value)}
              placeholder="https://example.com/image.jpg"
              className={`${ui.input} flex-1`}
            />
            <button
              type="button"
              onClick={handleAddCarouselImage}
              disabled={isSaving || !newCarouselImage.trim()}
              className={`${ui.btnPrimary} shrink-0`}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
              {t('add')}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
