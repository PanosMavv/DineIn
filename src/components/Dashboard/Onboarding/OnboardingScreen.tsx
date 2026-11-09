'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Smartphone, ArrowRight, X } from 'lucide-react';
import { BasicsStep } from './BasicsStep';
import { TemplateStep } from './TemplateStep';
import { LivePreviewPanel } from './LivePreviewPanel';
import { TemplateId } from './TemplateThumbnail';
import { SAMPLE_CATEGORIES } from './sampleData';
import { ui } from '@/lib/ui';
import type { MenuItem } from '@/lib/utils';

interface Props {
  cancelHref?: string;
}

export function OnboardingScreen({ cancelHref }: Props) {
  const router = useRouter();
  const t = useTranslations('dashboard.onboarding');

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [template, setTemplate] = useState<TemplateId>('simple-list');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState(false);

  const nameError = useMemo(() => {
    if (!name.trim()) return undefined;
    if (!/^[\x00-\x7F]*$/.test(name)) return t('nameLatinOnly');
    return undefined;
  }, [name, t]);

  const groupedMenu = SAMPLE_CATEGORIES as { category: string; items: MenuItem[] }[];

  const canSubmit = name.trim().length > 0 && !nameError && !isSubmitting;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch('/api/dashboard/restaurants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || null,
          template,
        }),
      });

      if (!res.ok) {
        throw new Error('Create failed');
      }

      const restaurant = await res.json();
      router.push(`/dashboard/restaurants/${restaurant.id}?welcome=1`);
      router.refresh();
    } catch {
      setServerError(t('createFailed'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="lg:grid lg:grid-cols-[45%_1fr] lg:gap-10 lg:min-h-[calc(100vh-8rem)]">
        <div className="space-y-8 max-w-xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-ink md:text-3xl">{t('welcome')}</h1>
              <p className="mt-1 text-ink-muted">{t('subtitle')}</p>
            </div>
            {cancelHref && (
              <Link href={cancelHref} className={`${ui.btnGhost} shrink-0`}>
                <X className="h-4 w-4" aria-hidden="true" />
                {t('cancel')}
              </Link>
            )}
          </div>

          <BasicsStep
            name={name}
            description={description}
            onNameChange={setName}
            onDescriptionChange={setDescription}
            nameError={nameError}
          />

          <TemplateStep
            value={template}
            onChange={setTemplate}
            restaurantName={name}
            restaurantDescription={description}
            groupedMenu={groupedMenu}
          />

          {serverError && (
            <div className="p-4 rounded-(--dashboard-radius-sm) bg-red-500/10 text-red-600 text-sm">
              {serverError}
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <button onClick={handleSubmit} disabled={!canSubmit} className={ui.btnPrimary}>
              {isSubmitting ? t('creating') : t('create')}
              {!isSubmitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="hidden lg:block sticky top-8 self-start h-[calc(100vh-4rem)]">
          <LivePreviewPanel
            restaurantName={name}
            restaurantDescription={description}
            template={template}
            groupedMenu={groupedMenu}
          />
        </div>
      </div>

      <button
        onClick={() => setMobilePreviewOpen(true)}
        className="lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 z-30 inline-flex items-center gap-2 px-6 py-3 bg-ink text-surface rounded-full font-semibold shadow-lg"
        style={{ bottom: 'calc(4.5rem + env(safe-area-inset-bottom))' }}
      >
        <Smartphone className="w-4 h-4" />
        {t('openPreview')}
      </button>

      {mobilePreviewOpen && (
        <LivePreviewPanel
          restaurantName={name}
          restaurantDescription={description}
          template={template}
          groupedMenu={groupedMenu}
          openOnMobile
          onCloseMobile={() => setMobilePreviewOpen(false)}
        />
      )}
    </>
  );
}