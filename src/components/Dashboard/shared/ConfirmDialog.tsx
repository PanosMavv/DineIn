'use client';

import { useEffect, useId, useRef } from 'react';
import { X } from 'lucide-react';
import { ui } from '@/lib/ui';

interface Props {
  open: boolean;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  pendingLabel: string;
  pending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onClose: () => void;
  icon?: React.ReactNode;
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  pendingLabel,
  pending = false,
  error,
  onConfirm,
  onClose,
  icon,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onCancel={(event) => {
        event.preventDefault();
        if (!pending) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget && !pending) onClose();
      }}
      className="m-auto w-[calc(100%-2rem)] max-w-sm rounded-[var(--dashboard-radius)] border border-hairline bg-surface p-0 text-ink shadow-xl backdrop:bg-black/50"
    >
      <div className="p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            {icon && (
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-500/10 text-red-600">
                {icon}
              </span>
            )}
            <h2 id={titleId} className="text-lg font-bold text-ink">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className={ui.btnIcon}
            aria-label={cancelLabel}
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <p id={descriptionId} className="mt-3 text-sm text-ink-muted">
          {description}
        </p>

        {error && (
          <p role="alert" className="mt-3 text-sm text-red-600">
            {error}
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className={ui.btnGhost}
            autoFocus
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={pending}
            className={ui.btnDanger}
          >
            {pending ? pendingLabel : confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}
