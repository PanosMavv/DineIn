/**
 * Primitive class builders for dashboard UI.
 * Centralizes styling so the dashboard can be re-skinned from one place.
 */
export const ui = {
  // Buttons
  btnPrimary:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ink text-surface font-semibold hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed',
  btnGhost:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-hairline text-ink font-semibold hover:bg-surface-2 transition disabled:opacity-50 disabled:cursor-not-allowed',
  btnIcon:
    'w-9 h-9 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-2 transition',

  // Inputs
  input:
    'w-full px-4 py-3 rounded-[var(--dashboard-radius-sm)] border border-hairline bg-surface text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition',
  textarea:
    'w-full px-4 py-3 rounded-[var(--dashboard-radius-sm)] border border-hairline bg-surface text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none',
  label:
    'block text-sm font-medium text-ink mb-1.5',
  helper:
    'text-xs text-ink-subtle mt-1',
  error:
    'text-xs text-red-500 mt-1',

  // Surfaces
  card:
    'rounded-[var(--dashboard-radius)] border border-hairline bg-surface',
  cardMuted:
    'rounded-[var(--dashboard-radius)] border border-hairline bg-surface-2',

  // Layout
  container:
    'max-w-6xl mx-auto',

  // Chips / pills
  chip:
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
  chipSuccess:
    'bg-success/10 text-success',
  chipMuted:
    'bg-surface-2 text-ink-muted',
} as const;