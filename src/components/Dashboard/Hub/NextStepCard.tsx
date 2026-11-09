import type { LucideIcon } from 'lucide-react';
import { ui } from '@/lib/ui';

interface Props {
  eyebrow: string;
  title: string;
  body: string;
  icon: LucideIcon;
  action: React.ReactNode;
  secondary?: React.ReactNode;
}

export function NextStepCard({
  eyebrow,
  title,
  body,
  icon: Icon,
  action,
  secondary,
}: Props) {
  return (
    <section
      aria-labelledby="next-step-title"
      className="rounded-[var(--dashboard-radius)] border border-accent-brand/20 bg-accent-soft p-5 md:p-6"
    >
      <div className="flex items-start gap-4">
        <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-accent-brand sm:flex">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>

        <div className="min-w-0 flex-1">
          <p className={`${ui.sectionLabel} text-accent-brand`}>{eyebrow}</p>
          <h2 id="next-step-title" className="mt-1 text-xl font-bold text-ink md:text-2xl">
            {title}
          </h2>
          <p className="mt-1.5 max-w-xl text-sm text-ink-muted">{body}</p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {action}
            {secondary}
          </div>
        </div>
      </div>
    </section>
  );
}
