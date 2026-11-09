'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Save } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';
import { CopyLinkButton } from '@/components/Dashboard/shared/CopyLinkButton';
import { DeleteButton } from '@/components/Dashboard/shared/DeleteButton';

interface Props {
  restaurantId: string;
  initialName: string;
  initialDescription: string;
  slug: string;
}

export function RestaurantSettingsForm({
  restaurantId,
  initialName,
  initialDescription,
  slug,
}: Props) {
  const router = useRouter();
  const t = useTranslations('dashboard.settings');
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSaved(false);

    if (!name.trim()) {
      setError(t('nameRequired'));
      return;
    }

    setPending(true);

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            description: description.trim() || null,
          }),
        }
      );

      if (!response.ok) throw new Error('Save failed');

      setSaved(true);
      router.refresh();
    } catch {
      setError(t('saveFailed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <form onSubmit={handleSubmit} className={`${ui.card} space-y-5 p-5`}>
        {error && (
          <div
            role="alert"
            className="rounded-[var(--dashboard-radius-sm)] bg-red-500/10 p-3 text-sm text-red-600"
          >
            {error}
          </div>
        )}

        {saved && (
          <div
            role="status"
            className="rounded-[var(--dashboard-radius-sm)] bg-success/10 p-3 text-sm text-success"
          >
            {t('saved')}
          </div>
        )}

        <div>
          <label htmlFor="settings-name" className={ui.label}>
            {t('nameLabel')}
          </label>
          <input
            id="settings-name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder={t('namePlaceholder')}
            aria-invalid={Boolean(error)}
            className={ui.input}
          />
        </div>

        <div>
          <label htmlFor="settings-description" className={ui.label}>
            {t('descriptionLabel')}
          </label>
          <textarea
            id="settings-description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            placeholder={t('descriptionPlaceholder')}
            className={ui.textarea}
          />
        </div>

        <div>
          <p className={ui.label}>{t('publicUrl')}</p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="min-w-0 flex-1 truncate rounded-[var(--dashboard-radius-sm)] bg-surface-2 px-3 py-2 font-mono text-sm text-ink">
              /{slug}
            </div>
            <CopyLinkButton slug={slug} />
          </div>
          <p className={ui.helper}>{t('publicUrlHint')}</p>
        </div>

        <button type="submit" disabled={pending} className={ui.btnPrimary}>
          <Save className="h-4 w-4" aria-hidden="true" />
          {pending ? t('saving') : t('save')}
        </button>
      </form>

      <section className={`${ui.card} border-red-500/30 p-5`}>
        <h2 className="text-lg font-semibold text-red-600">{t('dangerZone')}</h2>
        <p className="mt-1 text-sm text-ink-muted">{t('dangerBody')}</p>
        <div className="mt-4">
          <DeleteButton
            endpoint={`/api/dashboard/restaurants/${restaurantId}`}
            title={t('deleteTitle', { name: name.trim() || initialName })}
            description={t('deleteBody')}
            triggerLabel={t('deleteRestaurant')}
            triggerVariant="button"
            redirectTo="/dashboard"
          />
        </div>
      </section>
    </div>
  );
}
