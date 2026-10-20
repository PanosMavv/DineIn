'use client';

import { useTranslations } from 'next-intl';
import type { TemplateId } from './TemplateThumbnail';
import { SimpleListMenu } from '@/components/Restaurant/Themes/SimpleListMenu';
import { CategoryCardMenu } from '@/components/Restaurant/Themes/CategoryCardMenu';
import { FastFoodMenu } from '@/components/Restaurant/Themes/FastFoodMenu';
import { PreviewErrorBoundary } from './PreviewErrorBoundary';
import type { MenuItem } from '@/lib/utils';
import { SAMPLE_RESTAURANT } from './sampleData';

const TEMPLATES: { id: TemplateId; nameKey: string; descKey: string }[] = [
  { id: 'simple-list', nameKey: 'templates.simple-list.name', descKey: 'templates.simple-list.description' },
  { id: 'category-cards', nameKey: 'templates.category-cards.name', descKey: 'templates.category-cards.description' },
  { id: 'fast-food', nameKey: 'templates.fast-food.name', descKey: 'templates.fast-food.description' },
];

interface Props {
  value: TemplateId;
  onChange: (v: TemplateId) => void;
  restaurantName: string;
  restaurantDescription: string;
  groupedMenu: { category: string; items: MenuItem[] }[];
}

function MiniTemplate({ template, restaurantName, restaurantDescription, groupedMenu }: {
  template: TemplateId;
  restaurantName: string;
  restaurantDescription: string;
  groupedMenu: { category: string; items: MenuItem[] }[];
}) {
  const restaurant = {
    ...SAMPLE_RESTAURANT,
    name: restaurantName || SAMPLE_RESTAURANT.name,
    description: restaurantDescription || SAMPLE_RESTAURANT.description,
    template,
  };

  return (
    <div className="w-full aspect-9/16 overflow-hidden rounded-xl relative bg-surface pointer-events-none">
      <div
        className="absolute top-0 left-0 origin-top-left"
        style={{ transform: 'scale(0.35)', width: `${100 / 0.35}%` }}
      >
        <PreviewErrorBoundary>
          {template === 'category-cards' ? (
            <CategoryCardMenu restaurant={restaurant} groupedMenu={groupedMenu} />
          ) : template === 'fast-food' ? (
            <FastFoodMenu restaurant={restaurant} groupedMenu={groupedMenu} />
          ) : (
            <SimpleListMenu restaurant={restaurant} groupedMenu={groupedMenu} />
          )}
        </PreviewErrorBoundary>
      </div>
    </div>
  );
}

export function TemplateStep({
  value,
  onChange,
  restaurantName,
  restaurantDescription,
  groupedMenu,
}: Props) {
  const t = useTranslations('dashboard.onboarding');

  return (
    <div>
      <h3 className="text-lg font-semibold text-ink mb-1">{t('step2')}</h3>
      <p className="text-sm text-ink-muted mb-4">{t('templateLabel')}</p>

      <div className="grid grid-cols-3 gap-3 md:gap-4">
        {TEMPLATES.map((tpl) => {
          const selected = value === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onChange(tpl.id)}
              className={[
                'text-left rounded-(--dashboard-radius) p-2 transition-all border-2',
                selected
                  ? 'border-ink-subtle bg-surface'
                  : 'border-hairline bg-surface hover:border-ink-muted',
              ].join(' ')}
            >
              <MiniTemplate
                template={tpl.id}
                restaurantName={restaurantName}
                restaurantDescription={restaurantDescription}
                groupedMenu={groupedMenu}
              />
              <p className="mt-2 text-xs md:text-sm font-semibold text-ink truncate">
                {t(tpl.nameKey)}
              </p>
              <p className="text-[10px] md:text-xs text-ink-subtle line-clamp-2 mt-0.5">
                {t(tpl.descKey)}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}