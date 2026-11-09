'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ui } from '@/lib/ui';
import { ConfirmDialog } from '@/components/Dashboard/shared/ConfirmDialog';

interface Props {
  endpoint: string;
  title: string;
  description: string;
  triggerLabel: string;
  triggerVariant?: 'icon' | 'button';
  redirectTo?: string;
}

export function DeleteButton({
  endpoint,
  title,
  description,
  triggerLabel,
  triggerVariant = 'icon',
  redirectTo,
}: Props) {
  const router = useRouter();
  const t = useTranslations('dashboard.common');
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpen = () => {
    setError(null);
    setOpen(true);
  };

  const handleDelete = async () => {
    setPending(true);
    setError(null);

    try {
      const response = await fetch(endpoint, { method: 'DELETE' });

      if (!response.ok) {
        throw new Error('Delete failed');
      }

      setOpen(false);
      if (redirectTo) {
        router.push(redirectTo);
        router.refresh();
      } else {
        router.refresh();
      }
    } catch {
      setError(t('deleteFailed'));
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      {triggerVariant === 'button' ? (
        <button type="button" onClick={handleOpen} className={ui.btnDanger}>
          <Trash2 className="h-4 w-4" aria-hidden="true" />
          {triggerLabel}
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className={ui.btnIconSm}
          aria-label={triggerLabel}
        >
          <Trash2 className="h-4 w-4 text-red-600" aria-hidden="true" />
        </button>
      )}

      <ConfirmDialog
        open={open}
        title={title}
        description={description}
        confirmLabel={t('delete')}
        cancelLabel={t('cancel')}
        pendingLabel={t('deleting')}
        pending={pending}
        error={error}
        onConfirm={handleDelete}
        onClose={() => {
          if (!pending) setOpen(false);
        }}
        icon={<Trash2 className="h-5 w-5" aria-hidden="true" />}
      />
    </>
  );
}
