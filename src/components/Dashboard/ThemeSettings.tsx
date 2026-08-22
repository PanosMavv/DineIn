'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Upload, Image as ImageIcon, Plus, Trash2, Save } from 'lucide-react';

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
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to {restaurantName}
      </Link>

      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Theme & Appearance
      </h1>

      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-6 max-w-2xl">
        {/* Template Selection */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Menu Template
          </h2>
          <div className="space-y-3">
            <select
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
            >
              {templates.map(t => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            <button
              onClick={handleSaveTemplate}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Template
            </button>
          </div>
        </div>

        {/* Logo Image */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Restaurant Logo
          </h2>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                {logoUrl ? (
                  <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Logo URL
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  placeholder="https://example.com/logo.jpg"
                  className="w-full px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
                />
              </div>
            </div>
            <button
              onClick={handleSaveLogo}
              disabled={isSaving}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              Save Logo
            </button>
          </div>
        </div>

        {/* Carousel Images */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Carousel Images
          </h2>

          {/* Existing images */}
          <div className="flex gap-3 flex-wrap mb-4">
            {carouselImages.map((image, index) => (
              <div key={image.id} className="relative group">
                <div className="w-32 h-20 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  <img src={image.image} alt={`Carousel ${index + 1}`} className="w-full h-full object-cover" />
                </div>
                <button
                  onClick={() => handleDeleteCarouselImage(image.id)}
                  className="absolute top-1 right-1 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center opacity-100 transition-opacity"
                  title="Delete image"
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Add Carousel Image
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newCarouselImage}
                onChange={(e) => setNewCarouselImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="flex-1 px-4 py-2 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
              />
              <button
                onClick={handleAddCarouselImage}
                disabled={isSaving || !newCarouselImage.trim()}
                className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full text-sm font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}