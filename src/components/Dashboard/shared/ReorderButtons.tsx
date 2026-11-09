import { ChevronDown, ChevronUp } from 'lucide-react';
import { ui } from '@/lib/ui';

interface Props {
  onMoveUp: () => void;
  onMoveDown: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  disabled?: boolean;
  upLabel: string;
  downLabel: string;
}

export function ReorderButtons({
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  disabled = false,
  upLabel,
  downLabel,
}: Props) {
  return (
    <div className="flex items-center">
      <button
        type="button"
        onClick={onMoveUp}
        disabled={disabled || !canMoveUp}
        className={ui.btnIconSm}
        aria-label={upLabel}
      >
        <ChevronUp className="h-4 w-4" aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={onMoveDown}
        disabled={disabled || !canMoveDown}
        className={ui.btnIconSm}
        aria-label={downLabel}
      >
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
