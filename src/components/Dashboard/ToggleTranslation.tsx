'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';

interface Props {
  restaurantId: string;
  locale: string;
  isActive: boolean;
  label: string;
  disabled?: boolean;
}

export function ToggleTranslation({
  restaurantId,
  locale,
  isActive,
  label,
  disabled = false,
}: Props) {
  const router = useRouter();
  const t = useTranslations('dashboard.languages');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setPending(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/restaurants/${restaurantId}/translations/${locale}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isActive: !isActive }),
        }
      );

      if (!response.ok) {
        throw new Error('Toggle failed');
      }

      router.refresh();
    } catch {
      setError(t('toggleFailed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        type="button"
        role="switch"
        aria-checked={isActive}
        aria-label={label}
        onClick={handleToggle}
        disabled={disabled || pending}
        className={ui.btnIconSm}
      >
        {isActive ? (
          <Eye className="h-4 w-4 text-success" aria-hidden="true" />
        ) : (
          <EyeOff className="h-4 w-4 text-ink-muted" aria-hidden="true" />
        )}
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {error ?? ''}
      </span>
    </>
  );
}
