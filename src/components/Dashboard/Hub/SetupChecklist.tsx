import { ui } from '@/lib/ui';
import { ProgressBar } from '@/components/Dashboard/shared/ProgressBar';
import { StatusRow, type StepStatus } from '@/components/Dashboard/shared/StatusRow';

export interface ChecklistStep {
  id: string;
  status: StepStatus;
  title: string;
  meta: string;
  href: string;
  action: string;
}

interface Props {
  title: string;
  progressLabel: string;
  progressValue: number;
  progressTotal: number;
  badge?: React.ReactNode;
  steps: ChecklistStep[];
  optionalLabel: string;
}

export function SetupChecklist({
  title,
  progressLabel,
  progressValue,
  progressTotal,
  badge,
  steps,
  optionalLabel,
}: Props) {
  return (
    <section className={ui.card}>
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-hairline px-4 py-3">
        <div className="flex items-center gap-2">
          <h2 className={ui.sectionLabel}>{title}</h2>
          {badge}
        </div>
        <span className={`${ui.chip} ${ui.chipMuted}`}>{progressLabel}</span>
      </div>

      <div className="px-4 py-3">
        <ProgressBar
          value={progressValue}
          total={progressTotal}
          label={progressLabel}
        />
      </div>

      <div className="divide-y divide-hairline border-t border-hairline">
        {steps.map((step) => (
          <StatusRow
            key={step.id}
            status={step.status}
            title={step.title}
            meta={step.meta}
            href={step.href}
            action={step.action}
            optionalLabel={optionalLabel}
          />
        ))}
      </div>
    </section>
  );
}
