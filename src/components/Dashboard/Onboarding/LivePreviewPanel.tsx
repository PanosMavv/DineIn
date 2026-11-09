'use client';

import { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { PreviewFrame } from './PreviewFrame';
import { PreviewErrorBoundary } from './PreviewErrorBoundary';
import { SimpleListMenu } from '@/components/Restaurant/Themes/SimpleListMenu';
import { CategoryCardMenu } from '@/components/Restaurant/Themes/CategoryCardMenu';
import { FastFoodMenu } from '@/components/Restaurant/Themes/FastFoodMenu';
import { SAMPLE_RESTAURANT } from './sampleData';
import type { TemplateId } from './TemplateThumbnail';
import type { MenuItem } from '@/lib/utils';

interface Props {
  restaurantName: string;
  restaurantDescription: string;
  template: TemplateId;
  groupedMenu: { category: string; items: MenuItem[] }[];
  openOnMobile?: boolean;
  onCloseMobile?: () => void;
}

export function LivePreviewPanel({
  restaurantName,
  restaurantDescription,
  template,
  groupedMenu,
  openOnMobile,
  onCloseMobile,
}: Props) {
  const t = useTranslations('dashboard.onboarding');
  const [device, setDevice] = useState<'mobile' | 'desktop'>('mobile');

  const restaurant = {
    ...SAMPLE_RESTAURANT,
    name: restaurantName || t('previewFallbackName'),
    description: restaurantDescription || SAMPLE_RESTAURANT.description,
    template,
  };

  const rendered = (
    <PreviewErrorBoundary>
      {template === 'category-cards' ? (
        <CategoryCardMenu restaurant={restaurant} groupedMenu={groupedMenu} />
      ) : template === 'fast-food' ? (
        <FastFoodMenu restaurant={restaurant} groupedMenu={groupedMenu} />
      ) : (
        <SimpleListMenu restaurant={restaurant} groupedMenu={groupedMenu} />
      )}
    </PreviewErrorBoundary>
  );

  // Mobile overlay mode
  if (openOnMobile) {
    return (
      <div className="fixed inset-0 z-60 bg-(--color-surface-2) flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-hairline bg-surface">
          <h3 className="font-semibold text-ink">{t('previewTitle')}</h3>
          <button
            onClick={onCloseMobile}
            className="px-3 py-1.5 text-sm font-medium text-ink-muted hover:text-ink"
          >
            {t('close')}
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <PreviewFrame device="mobile">{rendered}</PreviewFrame>
        </div>
      </div>
    );
  }

  // Desktop panel
  return (
    <div className="hidden lg:flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-ink">{t('previewTitle')}</h3>
          <p className="text-xs text-ink-subtle">{t('previewHint')}</p>
        </div>
        <div className="inline-flex rounded-full bg-surface-2 p-1">
          <button
            onClick={() => setDevice('mobile')}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition',
              device === 'mobile' ? 'bg-surface shadow-sm text-ink' : 'text-ink-muted',
            ].join(' ')}
          >
            <Smartphone className="w-3.5 h-3.5" />
            {t('mobileToggle')}
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={[
              'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition',
              device === 'desktop' ? 'bg-surface shadow-sm text-ink' : 'text-ink-muted',
            ].join(' ')}
          >
            <Monitor className="w-3.5 h-3.5" />
            {t('desktopToggle')}
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-hidden">
        <PreviewFrame device={device}>{rendered}</PreviewFrame>
      </div>
    </div>
  );
}