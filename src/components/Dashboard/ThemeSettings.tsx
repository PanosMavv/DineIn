'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Image as ImageIcon, Plus, Trash2, Save } from 'lucide-react';
import { useTranslations } from 'next-intl';

interface Props {
  restaurantId: string;
  restaurantName: string;
  currentTemplate: string;
  currentLogo: string | null;
  carouselImages: { id: string; image: string; order: number }[];
}

export function ThemeSettings({ restaurantId, restaurantName, currentTemplate, currentLogo, carouselImages }: Props) {
  const router = useRouter();
  const [template, setTemplate] = useState(currentTemplate);
  const [logoUrl, setLogoUrl] = useState(currentLogo || '');
  const [newCarouselImage, setNewCarouselImage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const t = useTranslations('dashboard.management.theme');

  const templates = [
    { value: 'simple-list', label: 'Simple List' },
    { value: 'category-cards', label: 'Category Cards' },
    { value: 'fast-food', label: 'Fast Food' },
  ];

  const handleSaveTemplate = async () => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard/restaurants/${restaurantId}/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ template }),
      });
      if (!res.ok) throw new Error('Failed to save template');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveLogo = async () => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard/restaurants/${restaurantId}/theme`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logoImage: logoUrl }),
      });
      if (!res.ok) throw new Error('Failed to save logo');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddCarouselImage = async () => {
    if (!newCarouselImage.trim()) return;
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard/restaurants/${restaurantId}/theme/carousel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: newCarouselImage }),
      });
      if (!res.ok) throw new Error('Failed to add image');
      setNewCarouselImage('');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add image');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCarouselImage = async (imageId: string) => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/dashboard/restaurants/${restaurantId}/theme/carousel/${imageId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete image');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete image');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <Link
        href={`/dashboard/restaurants/${restaurantId}`}
        className="inline-flex items-center gap-2 text-sm text-ink-muted hover:text-ink mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        {t('back', { name: restaurantName })}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-ink mb-8">
        {t('header')}
      </h1>

      {error && (
        <div className="p-4 bg-red-500/10 text-red-600 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 max-w-2xl">
        {/* Template Selection */}
        <div className="bg-surface rounded-2xl border border-hairline p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">
            {t('menuTemplate')}
          </h2>
          <div className="space-y-3">
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
            >
              {templates.map(tpl => (
                <option key={tpl.value} value={tpl.value}>{tpl.label}</option>
              ))}
            </select>
            <button
              onClick={handleSaveTemplate}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-surface rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {t('saveTemplate')}
            </button>
          </div>
        </div>

        {/* Logo Image */}
        <div className="bg-surface rounded-2xl border border-hairline p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">
            {t('logo')}
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-surface-2 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-ink-subtle" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-ink mb-1">
                  {t('logoUrl')}
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
                />
              </div>
            </div>
            <button
              onClick={handleSaveLogo}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-ink text-surface rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {t('saveLogo')}
            </button>
          </div>
        </div>

        {/* Carousel Images */}
        <div className="bg-surface rounded-2xl border border-hairline p-6">
          <h2 className="text-lg font-semibold text-ink mb-4">
            {t('carouselImages')}
          </h2>

          {/* Existing images */}
          <div className="flex gap-3 flex-wrap mb-4">
            {carouselImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-surface-2">
                  <img src={image.image} alt={`Carousel ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => handleDeleteCarouselImage(image.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-100 transition-opacity"
                  title={t('deleteImage')}
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <span className="absolute bottom-1 right-1 px-2 py-0.5 bg-black/60 text-white text-xs rounded">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>

          {/* Add new image */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-ink">
              {t('addCarouselImage')}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCarouselImage}
                onChange={(e) => setNewCarouselImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 bg-surface rounded-xl border border-hairline text-ink"
              />
              <button
                onClick={handleAddCarouselImage}
                disabled={isSaving || !newCarouselImage.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-ink text-surface rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                {t('add')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}