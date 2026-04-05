import React from 'react';
import { cn } from '@/lib/utils';

// ─── Shared pulse atom ────────────────────────────────────────────────────────

function Bone({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        // bg-muted resolves to hsl(var(--muted)) — change --muted in index.css
        // to retheme all skeleton bones instantly across the entire app.
        'animate-pulse rounded-md bg-muted/60',
        className
      )}
      {...props}
    />
  );
}

// ─── Shared card shell ────────────────────────────────────────────────────────
// bg-card / border-border resolve to hsl(var(--card)) / hsl(var(--border)).
// Changing --card in index.css now updates every skeleton and every real card.

function CardShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border bg-card p-5',
        'shadow-sm shadow-black/[0.04] dark:shadow-none',
        className
      )}
    >
      {children}
    </div>
  );
}

// ─── Summary Card skeleton ────────────────────────────────────────────────────
// Matches SummaryCard exactly:
//   p-5 outer | top row (label ~12px + value ~36px) + icon 40px | trend row ~18px
//   Total inner height: 12 + 8 + 36 + 20 + 18 = 94px → card ~134px

export function SkeletonSummaryCard() {
  return (
    <CardShell>
      <div className="flex items-start justify-between">
        <div className="space-y-2.5">
          {/* Label */}
          <Bone className="h-3 w-24" />
          {/* Value */}
          <Bone className="h-9 w-40" />
        </div>
        {/* Icon box */}
        <Bone className="h-10 w-10 rounded-xl" />
      </div>
      {/* Trend row */}
      <div className="mt-5 flex items-center gap-2">
        <Bone className="h-3.5 w-12 rounded-full" />
        <Bone className="h-3 w-32 rounded-full" />
      </div>
    </CardShell>
  );
}

// ─── Chart Card skeleton ──────────────────────────────────────────────────────
// Matches the shared chart card structure:
//   p-5 outer | header block ~50px | mb-5 | chart area (explicit height)

export function SkeletonChartCard({
  chartHeight = 288,
  className,
}: {
  chartHeight?: number;
  className?: string;
}) {
  return (
    <CardShell className={className}>
      {/* Header: title + subtitle left, chip right */}
      <div className="mb-5 flex items-start justify-between">
        <div className="space-y-2">
          <Bone className="h-4 w-36" />
          <Bone className="h-3 w-52" />
        </div>
        <Bone className="h-6 w-20 rounded-lg" />
      </div>
      {/* Chart body — explicit height for CLS prevention */}
      <Bone
        className="w-full rounded-xl"
        style={{ height: chartHeight } as React.CSSProperties}
      />
    </CardShell>
  );
}

// ─── Insight Card skeleton ────────────────────────────────────────────────────
// Matches InsightCard exactly:
//   p-4 | flex row: icon 36px + text block (label ~12px, value ~24px, subtext ~12px)

export function SkeletonInsightCard() {
  return (
    // !p-4 overrides the CardShell default p-5 — matches the real InsightCard padding
    <CardShell className="!p-4">
      <div className="flex items-start gap-3">
        {/* Icon */}
        <Bone className="h-9 w-9 flex-shrink-0 rounded-lg" />
        {/* Text block */}
        <div className="flex-1 space-y-2 pt-0.5">
          <Bone className="h-3 w-28" />
          <Bone className="h-6 w-20" />
          <Bone className="h-3 w-36" />
        </div>
      </div>
    </CardShell>
  );
}