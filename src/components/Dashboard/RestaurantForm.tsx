'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save, X, Globe } from 'lucide-react';

const restaurantTypes = [
  { value: 'RESTAURANT', label: 'Restaurant' },
  { value: 'COFFEE_SHOP', label: 'Coffee Shop' },
  { value: 'FAST_FOOD', label: 'Fast Food' },
  { value: 'TAVERN', label: 'Tavern' },
  { value: 'BAR', label: 'Bar' },
  { value: 'PIZZERIA', label: 'Pizzeria' },
  { value: 'CRÊPERIE', label: 'Crêperie' },
  { value: 'SUSHI', label: 'Sushi' },
  { value: 'BAKERY', label: 'Bakery' },
];

export function RestaurantForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const res = await fetch('/api/dashboard/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to create restaurant');
      }

      const restaurant = await res.json();
      router.push(`/dashboard/restaurants/${restaurant.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-6">
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Language notice */}
      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
        <Globe className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Enter your restaurant details in <strong>English</strong>. You can add translations later.
        </p>
      </div>

      {/* Restaurant name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Restaurant Name <span className="text-xs text-gray-400">(English)</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          placeholder="e.g. Bella Napoli"
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Restaurant description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description <span className="text-xs text-gray-400">(English)</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          placeholder="Describe your restaurant"
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        />
      </div>

      {/* Restaurant type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Restaurant Type
        </label>
        <select
          value={formData.type}
          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          required
          className="w-full px-4 py-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-100"
        >
          <option value="">Select a type...</option>
          {restaurantTypes.map(type => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>

      {/* Submit */}
      <div className="flex gap-3 pt-4">
        <button
          type="submit"
          disabled={isSaving}
          className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white rounded-full font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          {isSaving ? 'Creating...' : 'Create Restaurant'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 rounded-full font-semibold hover:bg-gray-50 transition-colors"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
      </div>
    </form>
  );
}