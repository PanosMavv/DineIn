'use client';

import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';

interface Props {
  name: string;
  description: string;
  onNameChange: (v: string) => void;
  onDescriptionChange: (v: string) => void;
  nameError?: string;
}

export function BasicsStep({
  name,
  description,
  onNameChange,
  onDescriptionChange,
  nameError,
}: Props) {
  const t = useTranslations('dashboard.onboarding');

  return (
    <div>
      <h3 className="text-lg font-semibold text-ink mb-1">{t('step1')}</h3>
      <p className="text-sm text-ink-muted mb-4">{t('step1Hint')}</p>

      <div className="space-y-4">
        <div>
          <label className={ui.label}>{t('nameLabel')}</label>
          <input
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            className={ui.input}
            placeholder={t('namePlaceholder')}
            autoFocus
          />
          {nameError && <p className={ui.error}>{nameError}</p>}
        </div>

        <div>
          <label className={ui.label}>
            {t('descLabel')}{' '}
            <span className="text-ink-subtle font-normal">({t('optional')})</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            rows={3}
            className={ui.textarea}
            placeholder={t('descPlaceholder')}
          />
        </div>
      </div>
    </div>
  );
}