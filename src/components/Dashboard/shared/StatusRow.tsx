import Link from 'next/link';
import { Check, ChevronRight, Circle, CircleDot } from 'lucide-react';
import { ui } from '@/lib/ui';

export type StepStatus = 'done' | 'current' | 'pending' | 'optional';

interface Props {
  status: StepStatus;
  title: string;
  meta: string;
  href: string;
  action: string;
  optionalLabel: string;
}

export function StatusRow({
  status,
  title,
  meta,
  href,
  action,
  optionalLabel,
}: Props) {
  const iconClasses =
    status === 'done'
      ? 'bg-success/10 text-success'
      : status === 'current'
        ? 'bg-accent-soft text-accent-brand'
        : 'border border-hairline text-ink-subtle';

  return (
    <Link
      href={href}
      aria-current={status === 'current' ? 'step' : undefined}
      className={`group flex items-center gap-3 ${ui.row}`}
    >
      <span
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${iconClasses}`}
        aria-hidden="true"
      >
        {status === 'done' ? (
          <Check className="h-4 w-4" />
        ) : status === 'current' ? (
          <CircleDot className="h-4 w-4" />
        ) : (
          <Circle className="h-3.5 w-3.5" />
        )}
      </span>

      <span className="min-w-0 flex-1">
        <span className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold text-ink">{title}</span>
          {status === 'optional' && (
            <span className={`${ui.chip} ${ui.chipMuted}`}>{optionalLabel}</span>
          )}
        </span>
        <span className="mt-0.5 block text-sm text-ink-muted">{meta}</span>
      </span>

      <span className="hidden shrink-0 text-sm font-medium text-ink-muted group-hover:text-ink sm:inline">
        {action}
      </span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-ink-subtle"
        aria-hidden="true"
      />
    </Link>
  );
}
