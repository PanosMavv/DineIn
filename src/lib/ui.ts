/**
 * Primitive class builders for dashboard UI.
 * Centralizes styling so the dashboard can be re-skinned from one place.
 */
export const ui = {
  // Focus
  focusRing:
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',

  // Buttons
  btnPrimary:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-ink text-surface font-semibold hover:opacity-90 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed',
  btnGhost:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border border-hairline bg-surface text-ink font-semibold hover:bg-surface-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed',
  btnDanger:
    'inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed',
  btnIcon:
    'w-9 h-9 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-50 disabled:cursor-not-allowed',
  btnIconSm:
    'w-8 h-8 flex items-center justify-center rounded-full text-ink-muted hover:bg-surface-2 hover:text-ink transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-40 disabled:cursor-not-allowed',

  // Inputs
  input:
    'w-full px-4 py-3 rounded-[var(--dashboard-radius-sm)] border border-hairline bg-surface text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition',
  textarea:
    'w-full px-4 py-3 rounded-[var(--dashboard-radius-sm)] border border-hairline bg-surface text-ink placeholder:text-ink-subtle focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition resize-none',
  label:
    'block text-sm font-medium text-ink mb-1.5',
  helper:
    'text-xs text-ink-muted mt-1',
  error:
    'text-xs text-red-500 mt-1',
  select:
    'w-full px-4 py-3 rounded-[var(--dashboard-radius-sm)] border border-hairline bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition',

  // Surfaces
  card:
    'rounded-[var(--dashboard-radius)] border border-hairline bg-surface',
  cardMuted:
    'rounded-[var(--dashboard-radius)] border border-hairline bg-surface-2',
  cardInteractive:
    'rounded-[var(--dashboard-radius)] border border-hairline bg-surface transition-colors hover:border-ink-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface',

  // Layout
  container:
    'max-w-6xl mx-auto',
  sectionLabel:
    'text-xs font-semibold uppercase tracking-wide text-ink-muted',

  // Rows
  row:
    'flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-surface-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent-brand/60',

  // Chips / pills
  chip:
    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
  chipSuccess:
    'bg-success/10 text-success',
  chipMuted:
    'bg-surface-2 text-ink-muted',
  chipAccent:
    'bg-accent-soft text-accent-brand',

  // Progress
  progressTrack:
    'h-2 w-full overflow-hidden rounded-full bg-hairline',
  progressFill:
    'h-full rounded-full bg-accent-brand transition-[width] duration-300',

  // Links
  link:
    'font-medium text-accent-brand underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-brand/60 focus-visible:ring-offset-2 focus-visible:ring-offset-surface rounded-sm',
} as const;
