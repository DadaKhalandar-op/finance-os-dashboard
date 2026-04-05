/**
 * Shared class strings for recurring surface patterns.
 *
 * Every value here uses semantic Tailwind tokens (bg-card, border-border,
 * text-card-foreground) so they automatically respond to CSS variable changes
 * in index.css — no component edits needed when you retheme.
 */

/** Standard dashboard card surface */
export const cardClass = [
    'rounded-2xl border border-border bg-card',
    'shadow-sm shadow-black/[0.04] dark:shadow-none',
    'text-card-foreground',
  ].join(' ');
  
  /** Card with a hover state (SummaryCard, InsightCard) */
  export const interactiveCardClass = [
    cardClass,
    'transition-shadow duration-200 hover:shadow-md',
  ].join(' ');
  
  /** Inner padding variants */
  export const cardPadding = {
    md: 'p-5',
    sm: 'p-4',
  } as const;
  
  /** Table / list container (no padding — content manages its own) */
  export const tableCardClass = [
    'overflow-hidden rounded-2xl border border-border bg-card',
    'shadow-sm shadow-black/[0.04] dark:shadow-none',
  ].join(' ');