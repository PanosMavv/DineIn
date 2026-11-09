import { ui } from '@/lib/ui';

interface Props {
  value: number;
  total: number;
  label: string;
}

export function ProgressBar({ value, total, label }: Props) {
  const safeTotal = Math.max(total, 1);
  const safeValue = Math.min(Math.max(value, 0), safeTotal);
  const percent = Math.round((safeValue / safeTotal) * 100);

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={safeTotal}
      aria-valuenow={safeValue}
      aria-label={label}
      className={ui.progressTrack}
    >
      <div className={ui.progressFill} style={{ width: `${percent}%` }} />
    </div>
  );
}
